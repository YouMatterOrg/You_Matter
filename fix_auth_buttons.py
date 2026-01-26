#!/usr/bin/env python3
import os
import re
import glob

# List of all HTML files to update
html_files = glob.glob("*.html")

# Pattern to find the old onAuthStateChanged handler
old_pattern = r'''onAuthStateChanged\(auth, \(user\) => \{
        // Update desktop button
        if \(openSigninDesktopBtn\) \{
          if \(user\) \{
            authButtons\.innerHTML = `
              <div class="user-pill">
                <span>Hi, \$\{user\.displayName \|\| user\.email \|\| "User"\}</span>
                <button id="logoutBtnDesktop" class="btn-logout">Log out</button>
              </div>
            `;
            document\.getElementById\("logoutBtnDesktop"\)\?\.addEventListener\("click", async \(\) => \{
              await signOut\(auth\);
            \}\);
          \} else \{
            authButtons\.innerHTML = `
              <button id="openSigninDesktop" class="btn-auth">Sign in</button>
            `;
            document\.getElementById\("openSigninDesktop"\)\?\.addEventListener\("click", \(\) => openModal\("login"\)\);
          \}
        \}
        
        // Update mobile button in menu
        if \(navAuthContainer\) \{
          const navAuthBtn = navAuthContainer\.querySelector\("button"\);
          if \(user\) \{
            navAuthContainer\.innerHTML = `
              <div style="padding: 0 12px;">
                <div style="color: #fff; font-size: 13px; margin-bottom: 8px;">Hi, \$\{user\.displayName \|\| user\.email \|\| "User"\}</div>
                <button id="logoutBtnMobile" class="btn-logout" style="width: 100%;">Log out</button>
              </div>
            `;
            document\.getElementById\("logoutBtnMobile"\)\?\.addEventListener\("click", async \(\) => \{
              await signOut\(auth\);
            \}\);
          \} else \{
            navAuthContainer\.innerHTML = `
              <button id="openSignin" class="btn-auth">Sign in</button>
            `;
            document\.getElementById\("openSignin"\)\?\.addEventListener\("click", \(\) => openModal\("login"\)\);
          \}
        \}
      \}\);'''

new_code = '''onAuthStateChanged(auth, (user) => {
        // Update desktop button
        if (openSigninDesktopBtn && authButtons) {
          if (user) {
            // Show user info
            const displayName = user.displayName || user.email?.split("@")[0] || "User";
            openSigninDesktopBtn.innerHTML = `<span class="user-pill">Hi, ${displayName}</span>`;
            
            // Add logout button if not present
            if (!document.getElementById("logoutBtnDesktop")) {
              const logoutBtn = document.createElement("button");
              logoutBtn.id = "logoutBtnDesktop";
              logoutBtn.className = "btn-logout";
              logoutBtn.textContent = "Log out";
              logoutBtn.addEventListener("click", async () => {
                await signOut(auth);
              });
              authButtons.appendChild(logoutBtn);
            }
          } else {
            // Reset to Sign in button
            openSigninDesktopBtn.textContent = "Sign in";
            openSigninDesktopBtn.className = "btn-auth";
            
            // Remove logout button if present
            const logoutBtn = document.getElementById("logoutBtnDesktop");
            if (logoutBtn) logoutBtn.remove();
          }
        }
        
        // Update mobile button in menu
        if (navAuthContainer && openSigninMobileBtn) {
          if (user) {
            const displayName = user.displayName || user.email?.split("@")[0] || "User";
            openSigninMobileBtn.innerHTML = `Hi, ${displayName}`;
            openSigninMobileBtn.className = "user-pill-mobile";
            
            // Add logout button if not present
            if (!document.getElementById("logoutBtnMobile")) {
              const logoutBtn = document.createElement("button");
              logoutBtn.id = "logoutBtnMobile";
              logoutBtn.className = "btn-logout";
              logoutBtn.textContent = "Log out";
              logoutBtn.style.width = "100%";
              logoutBtn.addEventListener("click", async () => {
                await signOut(auth);
              });
              navAuthContainer.appendChild(logoutBtn);
            }
          } else {
            openSigninMobileBtn.textContent = "Sign in";
            openSigninMobileBtn.className = "btn-auth";
            
            // Remove logout button if present
            const logoutBtn = document.getElementById("logoutBtnMobile");
            if (logoutBtn) logoutBtn.remove();
          }
        }
      });'''

# Simpler approach: find the old pattern and replace it
def fix_auth_buttons(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if file has onAuthStateChanged
        if 'onAuthStateChanged' not in content:
            return False
        
        # Look for the old pattern more flexibly
        # Find onAuthStateChanged block
        match = re.search(r'onAuthStateChanged\(auth, \(user\) => \{[\s\S]*?\}\);', content)
        if not match:
            print(f"✗ {filename} - Could not find onAuthStateChanged pattern")
            return False
        
        old_block = match.group(0)
        
        # Check if it's already the new pattern
        if 'openSigninDesktopBtn && authButtons' in old_block:
            print(f"✓ {filename} - Already updated")
            return False
        
        # Check if it contains the old pattern
        if 'authButtons.innerHTML' in old_block and 'navAuthContainer.innerHTML' in old_block:
            # Replace with new pattern
            content = content.replace(old_block, new_code)
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {filename}")
            return True
        else:
            print(f"? {filename} - Pattern not recognized")
            return False
    except Exception as e:
        print(f"✗ {filename} - Error: {e}")
        return False

# Process all HTML files
count = 0
for html_file in sorted(html_files):
    if html_file.endswith('.html') and not html_file.startswith('.'):
        if fix_auth_buttons(html_file):
            count += 1

print(f"\nTotal files updated: {count}")
