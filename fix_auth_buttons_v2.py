#!/usr/bin/env python3
import os
import re

pages = [
    "about-what-we-do.html",
    "about-who-we-are.html",
    "about-why-we-started.html",
    "about-youmatter.html",
    "barbaratestimonials.html",
    "course.html",
    "gethelp.html",
    "lavnishtestimonials.html",
    "lisatestimonials.html",
    "mitultestimonials.html",
    "stantestimonials.html",
    "testimonials.html",
    "thread-anxiety-stress.html",
    "thread-depression.html",
    "thread-introduce-yourself.html",
    "thread-self-care.html",
    "thread-wins.html",
    "zaktestimonials.html",
]

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

def fix_page(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already updated
        if 'openSigninDesktopBtn && authButtons' in content:
            print(f"✓ {filename} - Already updated")
            return False
        
        # Find and replace the onAuthStateChanged block
        # This pattern matches the old code structure with flexible whitespace
        pattern = r'onAuthStateChanged\(auth, \(user\) => \{\s*// Update desktop button\s*if \(openSigninDesktopBtn\) \{[\s\S]*?// Update mobile button in menu[\s\S]*?\}\s*\}\);'
        
        match = re.search(pattern, content)
        if match:
            old_block = match.group(0)
            content = content.replace(old_block, new_code)
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {filename}")
            return True
        else:
            print(f"✗ {filename} - Could not find pattern")
            return False
    except Exception as e:
        print(f"✗ {filename} - Error: {e}")
        return False

count = 0
for page in pages:
    if os.path.exists(page):
        if fix_page(page):
            count += 1
    else:
        print(f"✗ {page} - File not found")

print(f"\nTotal files updated: {count}")
