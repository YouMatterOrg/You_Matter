import re

# Pages that need auth buttons
pages = [
    "appointment.html",
    "Assesment.html",
    "blog.html",
    "check-in.html",
    "disorder-ocd.html",
    "disorders.html",
    "FAQ.html",
    "forums.html",
    "lifestages.html"
]

auth_modal_html = '''<!-- ================= AUTH MODAL ================= -->
<div class="ym-modal-overlay" id="authModal">
  <div class="ym-modal-content">
    <button class="modal-close" onclick="closeModal()">&times;</button>

    <div class="modal-tabs">
      <button class="modal-tab active" onclick="switchTab('login')">Sign In</button>
      <button class="modal-tab" onclick="switchTab('register')">Register</button>
    </div>

    <!-- Sign In Tab -->
    <div id="login" class="modal-content-tab active">
      <h2 class="modal-title">Welcome Back</h2>
      <p class="modal-subtitle">Sign in to your YouMatter account</p>

      <div class="form-group">
        <label for="loginEmail">Email</label>
        <input type="email" id="loginEmail" placeholder="your@email.com">
        <div class="error-message" id="loginEmailError"></div>
      </div>

      <div class="form-group">
        <label for="loginPassword">Password</label>
        <input type="password" id="loginPassword" placeholder="••••••••">
        <div class="error-message" id="loginPasswordError"></div>
      </div>

      <div class="form-group" style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
        <input type="checkbox" id="staySignedIn" checked>
        <label for="staySignedIn" style="margin: 0; font-size: 13px;">Keep me signed in</label>
      </div>

      <button class="btn-auth" onclick="signIn()">Sign In</button>

      <div class="modal-divider">
        <span>or</span>
      </div>

      <button class="btn-auth-google" onclick="signInWithGoogle()">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <p style="text-align: center; margin-top: 15px; font-size: 13px; color: #666;">
        Don't have an account? <button style="background: none; border: none; color: #0d2b57; cursor: pointer; font-weight: 600; text-decoration: underline;" onclick="switchTab('register')">Register here</button>
      </p>
    </div>

    <!-- Register Tab -->
    <div id="register" class="modal-content-tab">
      <h2 class="modal-title">Create Account</h2>
      <p class="modal-subtitle">Join YouMatter today</p>

      <div class="form-group">
        <label for="registerName">Full Name</label>
        <input type="text" id="registerName" placeholder="Your name">
        <div class="error-message" id="registerNameError"></div>
      </div>

      <div class="form-group">
        <label for="registerEmail">Email</label>
        <input type="email" id="registerEmail" placeholder="your@email.com">
        <div class="error-message" id="registerEmailError"></div>
      </div>

      <div class="form-group">
        <label for="registerPassword">Password</label>
        <input type="password" id="registerPassword" placeholder="••••••••">
        <div class="error-message" id="registerPasswordError"></div>
      </div>

      <div class="form-group">
        <label for="registerConfirmPassword">Confirm Password</label>
        <input type="password" id="registerConfirmPassword" placeholder="••••••••">
        <div class="error-message" id="registerConfirmPasswordError"></div>
      </div>

      <button class="btn-auth" onclick="register()">Create Account</button>

      <div class="modal-divider">
        <span>or</span>
      </div>

      <button class="btn-auth-google" onclick="signInWithGoogle()">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>

      <p style="text-align: center; margin-top: 15px; font-size: 13px; color: #666;">
        Already have an account? <button style="background: none; border: none; color: #0d2b57; cursor: pointer; font-weight: 600; text-decoration: underline;" onclick="switchTab('login')">Sign in here</button>
      </p>
    </div>
  </div>
</div>

<!-- Firebase & Auth Scripts -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyA0xkQvPgFeFuLxLZBd3xg1b7f8rQ6-vLw",
    authDomain: "youmatter-c29c4.firebaseapp.com",
    projectId: "youmatter-c29c4",
    storageBucket: "youmatter-c29c4.appspot.com",
    messagingSenderId: "909175936213",
    appId: "1:909175936213:web:4b9c65c234c2a99f1a1e8e"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  window.switchTab = function(tab) {
    document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.modal-content-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.modal-tab[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
  };

  window.openModal = function(mode) {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    if (mode === 'login') {
      document.querySelector('.modal-tab:first-child').click();
    } else if (mode === 'register') {
      document.querySelector('.modal-tab:last-child').click();
    }
  };

  window.closeModal = function() {
    document.getElementById('authModal').classList.remove('active');
  };

  document.getElementById('authModal').addEventListener('click', function(event) {
    if (event.target === this) {
      this.classList.remove('active');
    }
  });

  window.signIn = async function() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const staySignedIn = document.getElementById('staySignedIn').checked;

    if (!email) {
      showError('loginEmailError', 'Please enter your email');
      return;
    }

    if (!password) {
      showError('loginPasswordError', 'Please enter your password');
      return;
    }

    try {
      const persistence = staySignedIn ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      closeModal();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        showError('loginEmailError', 'Email not found');
      } else if (error.code === 'auth/wrong-password') {
        showError('loginPasswordError', 'Incorrect password');
      } else {
        showError('loginEmailError', error.message);
      }
    }
  };

  window.register = async function() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (!name) {
      showError('registerNameError', 'Please enter your name');
      return;
    }

    if (!email) {
      showError('registerEmailError', 'Please enter your email');
      return;
    }

    if (password.length < 6) {
      showError('registerPasswordError', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showError('registerConfirmPasswordError', 'Passwords do not match');
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await userCredential.user.updateProfile({ displayName: name });
      closeModal();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showError('registerEmailError', 'Email already in use');
      } else {
        showError('registerEmailError', error.message);
      }
    }
  };

  window.signInWithGoogle = async function() {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, provider);
      closeModal();
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  window.signOutUser = async function() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => {
      errorElement.classList.remove('show');
    }, 3000);
  }

  onAuthStateChanged(auth, (user) => {
    const openSigninDesktopBtn = document.getElementById('openSigninDesktopBtn');
    const openSigninMobileBtn = document.getElementById('openSigninMobileBtn');
    const authButtons = document.getElementById('authButtons');
    const navAuthContainer = document.getElementById('navAuthContainer');

    if (user) {
      const displayName = user.displayName || 'User';
      const firstName = displayName.split(' ')[0];

      if (openSigninDesktopBtn) {
        openSigninDesktopBtn.innerHTML = `<span class="user-pill">${firstName} <button onclick="signOutUser()">Log out</button></span>`;
      }

      if (openSigninMobileBtn) {
        openSigninMobileBtn.innerHTML = `<span class="user-pill">${firstName} <button onclick="signOutUser()">Log out</button></span>`;
      }
    } else {
      if (openSigninDesktopBtn) {
        openSigninDesktopBtn.textContent = 'Sign in';
        openSigninDesktopBtn.className = 'btn-auth';
      }

      if (openSigninMobileBtn) {
        openSigninMobileBtn.textContent = 'Sign in';
        openSigninMobileBtn.className = 'btn-auth';
      }
    }
  });

  const openSigninDesktopBtn = document.getElementById('openSigninDesktopBtn');
  const openSigninMobileBtn = document.getElementById('openSigninMobileBtn');

  openSigninDesktopBtn?.addEventListener('click', () => {
    if (!auth.currentUser) {
      openModal('login');
    }
  });

  openSigninMobileBtn?.addEventListener('click', () => {
    if (!auth.currentUser) {
      openModal('login');
    }
  });
</script>
'''

def add_auth_buttons_to_page(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has auth modal
        if 'openSigninDesktopBtn' in content or 'authModal' in content:
            print(f"✗ {filename} - Already has auth buttons/modal")
            return False
        
        # Check if has modal CSS, if not add it
        if 'ym-modal-overlay' not in content:
            # Add modal CSS to head
            css_style = '''  <!-- Auth Modal Styles -->
  <style>
    .ym-modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      justify-content: center;
      align-items: center;
    }

    .ym-modal-overlay.active {
      display: flex;
    }

    .ym-modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 450px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      position: relative;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }

    .modal-close:hover {
      color: #000;
    }

    .modal-title {
      font-size: 28px;
      font-weight: 600;
      color: #0d2b57;
      margin-bottom: 10px;
    }

    .modal-subtitle {
      font-size: 14px;
      color: #666;
      margin-bottom: 25px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }

    .form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #0d2b57;
    }

    .btn-auth {
      width: 100%;
      padding: 12px;
      background: #0d2b57;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-auth:hover {
      background: #051d42;
    }

    .btn-auth-google {
      width: 100%;
      padding: 12px;
      background: white;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background 0.3s;
      margin-top: 12px;
    }

    .btn-auth-google:hover {
      background: #f9f9f9;
    }

    .btn-auth-google svg {
      width: 18px;
      height: 18px;
    }

    .modal-divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }

    .modal-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #ddd;
    }

    .modal-divider span {
      background: white;
      padding: 0 10px;
      color: #999;
      font-size: 13px;
      position: relative;
      z-index: 1;
    }

    .modal-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 25px;
      border-bottom: 2px solid #f0f0f0;
    }

    .modal-tab {
      padding: 10px 0;
      border: none;
      background: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      color: #999;
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .modal-tab.active {
      color: #0d2b57;
      border-bottom-color: #0d2b57;
    }

    .modal-content-tab {
      display: none;
    }

    .modal-content-tab.active {
      display: block;
    }

    .error-message {
      color: #d32f2f;
      font-size: 12px;
      margin-top: 5px;
      display: none;
    }

    .error-message.show {
      display: block;
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(13, 43, 87, 0.1);
      border-radius: 20px;
      font-size: 13px;
      color: #0d2b57;
      font-weight: 500;
    }

    .user-pill button {
      background: none;
      border: none;
      color: #0d2b57;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
      padding: 0;
      font-size: 13px;
    }

    .nav-auth-container {
      display: none;
    }

    .nav-auth-container.active {
      display: flex;
      align-items: center;
    }

    .auth-buttons {
      display: none;
    }

    .auth-buttons.active {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    @media (max-width: 768px) {
      .ym-modal-content {
        width: 95%;
        max-width: 100%;
        padding: 30px 20px;
      }

      .modal-title {
        font-size: 24px;
      }
    }
  </style>
'''
            content = content.replace('</head>', css_style + '\n</head>')
        
        # Add auth modal HTML and script before closing body
        content = content.replace('</body>', auth_modal_html + '\n</body>')
        
        # Now add the button to the nav
        # Try different patterns
        patterns = [
            # Pattern 1: nav closing with hamburger
            (r'(\s+)<i class="fa fa-bars"[^>]*onclick="showMenu\(\)"[^>]*></i>\s*</nav>',
             r'\1<li class="nav-auth-container" id="navAuthContainer">\n            <button class="btn-auth" id="openSigninMobileBtn">Sign in</button>\n          </li>\n        </ul>\n\n        <div class="auth-buttons" id="authButtons" style="display: flex; align-items: center; gap: 10px; margin-right: 20px;">\n          <button class="btn-auth" id="openSigninDesktopBtn">Sign in</button>\n        </div>\n      </div>\n\n      \1<i class="fa fa-bars" onclick="showMenu()"></i>\n    </nav>'),
            
            # Pattern 2: regular close
            (r'(\s+)</div>\s*<i class="fa fa-bars"[^>]*></i>\s*</nav>',
             r'\1</div>\n\n        <div class="auth-buttons" id="authButtons" style="display: flex; align-items: center; gap: 10px; margin-right: 20px;">\n          <button class="btn-auth" id="openSigninDesktopBtn">Sign in</button>\n        </div>\n      </div>\n\n      \1<i class="fa fa-bars" onclick="showMenu()"></i>\n    </nav>'),
        ]
        
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ Updated {filename}")
                return True
        
        print(f"✗ {filename} - Could not find nav pattern")
        return False
    except Exception as e:
        print(f"✗ {filename} - Error: {e}")
        return False

# Process all pages
for page in pages:
    if add_auth_buttons_to_page(page):
        pass
