#!/usr/bin/env python3
"""Add sign in button to remaining pages"""

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

# Pattern to find nav without auth button
old_nav_close = '''                </ul>
            </div>
            <i class="fa fa-bars" onclick="showMenu()"></i>
        </nav>'''

new_nav_close = '''                </ul>
            </div>
            <div id="authButtons" class="nav-actions">
              <button id="openSigninDesktop" class="btn-auth" type="button">Sign in</button>
            </div>
            <i class="fa fa-bars" onclick="showMenu()"></i>
        </nav>'''

# Add nav auth container to the UL
old_ul_close = '''                    <li class="has-dropdown">
                        <a href="forums.html">CONNECT <i class="fa-solid fa-angle-down"></i></a>
                        <ul class="dropdown">
                            <li><a href="forums.html">Forums</a></li>
                            <li><a href="FAQ.html">FAQ</a></li>
                        </ul>
                    </li>
                </ul>'''

new_ul_close = '''                    <li class="has-dropdown">
                        <a href="forums.html">CONNECT <i class="fa-solid fa-angle-down"></i></a>
                        <ul class="dropdown">
                            <li><a href="forums.html">Forums</a></li>
                            <li><a href="FAQ.html">FAQ</a></li>
                        </ul>
                    </li>
                    <li id="navAuthContainer" class="nav-auth-container">
                      <button id="openSignin" class="btn-auth" type="button">Sign in</button>
                    </li>
                </ul>'''

updated_count = 0

for page in pages_to_update:
    if not os.path.exists(page):
        print(f"File not found: {page}")
        continue
    
    try:
        with open(page, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Add auth button to nav
        if old_ul_close in content and 'navAuthContainer' not in content:
            content = content.replace(old_ul_close, new_ul_close)
            print(f"✓ Added mobile auth button to {page}")
        
        if old_nav_close in content and 'openSigninDesktop' not in content:
            content = content.replace(old_nav_close, new_nav_close)
            print(f"✓ Added desktop auth button to {page}")
        
        # Write back if changed
        if content != original_content:
            with open(page, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_count += 1
        else:
            print(f"- No changes needed for {page}")
    
    except Exception as e:
        print(f"✗ Error processing {page}: {e}")

print(f"\n✓ Updated {updated_count} files")
