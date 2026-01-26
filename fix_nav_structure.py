#!/usr/bin/env python3
"""Add sign in button to remaining pages with different nav structure"""

import os

pages_to_update = [
    'appointment.html',
    'Assesment.html',
    'blog.html',
    'check-in.html',
    'disorder-ocd.html',
    'disorders.html',
    'factvsfiction.html',
    'FAQ.html',
    'forums.html',
    'lifestages.html',
]

# These pages don't have closing div before hamburger, go directly
# Pattern: closing ul, then direct to hamburger without authButtons div
old_pattern = '''      </ul>
    </div>
    <i class="fa fa-bars" onclick="showMenu()"></i>
  </nav>'''

new_pattern = '''      </ul>
      <li id="navAuthContainer" class="nav-auth-container">
        <button id="openSignin" class="btn-auth" type="button">Sign in</button>
      </li>
    </ul>
    </div>
    <div id="authButtons" class="nav-actions">
      <button id="openSigninDesktop" class="btn-auth" type="button">Sign in</button>
    </div>
    <i class="fa fa-bars" onclick="showMenu()"></i>
  </nav>'''

updated_count = 0

for page in pages_to_update:
    if not os.path.exists(page):
        print(f"File not found: {page}")
        continue
    
    try:
        with open(page, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if old_pattern in content and 'openSigninDesktop' not in content:
            content = content.replace(old_pattern, new_pattern)
            print(f"✓ Updated {page}")
            
            with open(page, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_count += 1
        else:
            print(f"- {page} already has auth button or different structure")
    
    except Exception as e:
        print(f"✗ Error processing {page}: {e}")

print(f"\n✓ Updated {updated_count} files")
