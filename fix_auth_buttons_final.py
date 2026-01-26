#!/usr/bin/env python3
import os

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

# The correct fixed code to replace with
new_code = '''      // Auth state - update both desktop and mobile buttons
      onAuthStateChanged(auth, (user) => {
        // Update desktop button
        if (openSigninDesktopBtn && authButtons) {
          if (user) {
            // Show user info
            const displayName = user.displayName || user.email?.split("@")[0] || "User";
            openSigninDesktopBtn.innerHTML = `<span class="user-pill">${displayName}</span>`;
            
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
        
        # Check if already updated with new pattern
        if 'openSigninDesktopBtn && authButtons' in content:
            print(f"✓ {filename} - Already updated")
            return False
        
        # Look for the old auth state update pattern and replace it
        # Find: "// Auth state - update both desktop and mobile buttons"
        # And replace everything up to and including the closing })
        
        marker_start = "      // Auth state - update both desktop and mobile buttons"
        
        if marker_start not in content:
            print(f"✗ {filename} - Could not find auth state marker")
            return False
        
        # Find the start position
        start_idx = content.find(marker_start)
        
        # Find the end - look for the closing }); after onAuthStateChanged
        # Start searching from the marker
        search_from = start_idx
        bracket_count = 0
        in_function = False
        end_idx = -1
        
        for i in range(start_idx, len(content)):
            if content[i:i+17] == "onAuthStateChanged":
                in_function = True
            
            if in_function:
                if content[i] == '{':
                    bracket_count += 1
                elif content[i] == '}':
                    bracket_count -= 1
                    if bracket_count == 0 and i+1 < len(content) and content[i+1] == ')' and i+2 < len(content) and content[i+2] == ';':
                        end_idx = i + 3
                        break
        
        if end_idx == -1:
            print(f"✗ {filename} - Could not find end of auth state handler")
            return False
        
        # Get old code for verification
        old_code = content[start_idx:end_idx]
        
        # Replace
        new_content = content[:start_idx] + new_code + content[end_idx:]
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ Updated {filename}")
        return True
        
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
