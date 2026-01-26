#!/usr/bin/env python3
"""Add sign in button and lifestages to remaining pages"""

import os

pages_to_update = [
    'appointment.html',
    'Assesment.html',
    'check-in.html',
    'disorder-ocd.html',
    'disorders.html',
    'factvsfiction.html',
    'FAQ.html',
    'forums.html',
]

# Add lifestages to LEARN dropdown
old_learn = '''            <ul class="dropdown">
              <li><a href="blog.html">Blog</a></li>
              <li><a href="disorders.html">Disorders</a></li>
              <li><a href="factvsfiction.html">Fact vs Fiction</a></li>
            </ul>'''

new_learn = '''            <ul class="dropdown">
              <li><a href="blog.html">Blog</a></li>
              <li><a href="disorders.html">Disorders</a></li>
              <li><a href="factvsfiction.html">Fact vs Fiction</a></li>
              <li><a href="lifestages.html">Life Stages</a></li>
            </ul>'''

# Add nav auth button
old_nav = '''        </ul>
      </div>
      <i class="fa fa-bars" onclick="showMenu()"></i>
    </nav>'''

new_nav = '''          <li id="navAuthContainer" class="nav-auth-container">
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
        
        original = content
        
        # Add lifestages if missing
        if 'lifestages.html' not in content and old_learn in content:
            content = content.replace(old_learn, new_learn)
            print(f"✓ Added Life Stages to {page}")
        
        # Add auth buttons if missing
        if 'openSigninDesktop' not in content and old_nav in content:
            content = content.replace(old_nav, new_nav)
            print(f"✓ Added auth buttons to {page}")
        
        if content != original:
            with open(page, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_count += 1
    
    except Exception as e:
        print(f"✗ Error processing {page}: {e}")

print(f"\n✓ Updated {updated_count} files")
