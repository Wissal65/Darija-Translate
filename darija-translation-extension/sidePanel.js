class DarijaTranslateExtension {
  constructor() {
    this.API_URL = 'http://localhost:3000/api';
    this.sessionId = null;
    this.user = null;
    this.direction = 'en-to-darija';
    this.currentScreen = 'landing';
    this.isLogin = true;
    this.selectedContext = null;
    this.showPassword = false;
    
    this.init();
  }

  async init() {
    await this.loadSession();
    this.showScreen('landing');
    this.bindEvents();
    this.updateAuthUI();
  }

  async loadSession() {
    const result = await chrome.storage.local.get(['sessionId', 'user', 'apiUrl']);
    if (result.sessionId && result.user) {
      this.sessionId = result.sessionId;
      this.user = result.user;
      const isValid = await this.validateSession();
      if (!isValid) {
        await this.clearSession();
      }
    }
    if (result.apiUrl) {
      this.API_URL = result.apiUrl;
    }
  }

  async validateSession() {
    try {
      const response = await fetch(`${this.API_URL}/auth/validate`, {
        headers: { 'Authorization': `Bearer ${this.sessionId}` }
      });
      const data = await response.json();
      return data.success && data.valid;
    } catch (error) {
      return false;
    }
  }

  async clearSession() {
    this.sessionId = null;
    this.user = null;
    await chrome.storage.local.remove(['sessionId', 'user']);
  }

  showScreen(screenName) {
    this.currentScreen = screenName;
    document.getElementById('landingScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('translationScreen').classList.add('hidden');
    
    document.getElementById(`${screenName}Screen`).classList.remove('hidden');
  }

  bindEvents() {
    // Landing Page
    document.getElementById('startTranslatingBtn').addEventListener('click', () => this.handleStartTranslating());
    document.getElementById('landingSwapBtn').addEventListener('click', () => this.swapLanguagesLanding());

    // Auth Screen
    document.getElementById('authBackBtn').addEventListener('click', () => this.showScreen('landing'));
    document.getElementById('switchModeBtn').addEventListener('click', () => this.toggleAuthMode());
    document.getElementById('togglePasswordBtn').addEventListener('click', () => this.togglePassword());
    document.getElementById('submitAuthBtn').addEventListener('click', () => this.handleAuth());
    document.getElementById('continueWithoutBtn').addEventListener('click', () => this.showScreen('landing'));

    // Translation Screen
    document.getElementById('homeButton').addEventListener('click', () => this.showScreen('landing'));
    document.getElementById('homeActionButton').addEventListener('click', () => this.showScreen('landing'));
    document.getElementById('contextSelectorBtn').addEventListener('click', () => this.showContextModal());
    document.getElementById('modalCloseBtn').addEventListener('click', () => this.hideContextModal());
    document.getElementById('swapArrowBtn').addEventListener('click', () => this.swapLanguages());
    document.getElementById('translateButton').addEventListener('click', () => this.translate());
    document.getElementById('clearButton').addEventListener('click', () => this.clearAll());
    document.getElementById('speakInputBtn').addEventListener('click', () => this.speak('input'));
    document.getElementById('speakOutputBtn').addEventListener('click', () => this.speak('output'));
    document.getElementById('micButton').addEventListener('click', () => alert('Voice recording not supported in extensions'));

    // Input character count
    document.getElementById('inputText').addEventListener('input', (e) => {
      document.getElementById('inputCounter').textContent = e.target.value.length;
    });

    // Context options
    document.querySelectorAll('.context-option').forEach(option => {
      option.addEventListener('click', () => this.selectContext(option.dataset.context));
    });

    // Listen for messages from context menu
    chrome.runtime.onMessage.addListener((request) => {
      if (request.action === 'translateText' && request.text) {
        this.showScreen('translation');
        document.getElementById('inputText').value = request.text;
        document.getElementById('inputCounter').textContent = request.text.length;
        setTimeout(() => this.translate(), 500);
      }
    });
  }

  updateAuthUI() {
    const authStatusContent = document.getElementById('authStatusContent');
    const footerNote = document.getElementById('footerNote');
    const userBadgeSmall = document.getElementById('userBadgeSmall');

    if (this.sessionId && this.user) {
      authStatusContent.innerHTML = `
        <div class="user-badge">
          <i class="material-icons" style="font-size: 20px;">person_circle</i> ${this.user.username}
        </div>
        <button class="logout-btn" id="logoutBtn">Logout</button>
      `;
      footerNote.style.display = 'none';
      if (userBadgeSmall) {
        userBadgeSmall.innerHTML = `<i class="material-icons" style="font-size: 16px;">person_circle</i> ${this.user.username}`;
      }
      document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    } else {
      authStatusContent.innerHTML = `
        <button class="sign-in-btn" id="signInBtn">
          <i class="material-icons">login</i>
          <span>Sign In</span>
        </button>
      `;
      footerNote.style.display = 'block';
      if (userBadgeSmall) {
        userBadgeSmall.innerHTML = '';
      }
      document.getElementById('signInBtn').addEventListener('click', () => this.showScreen('auth'));
    }
  }

  handleStartTranslating() {
    if (this.sessionId) {
      this.showScreen('translation');
    } else {
      this.showScreen('auth');
    }
  }

  swapLanguagesLanding() {
    this.direction = this.direction === 'en-to-darija' ? 'darija-to-en' : 'en-to-darija';
    const sourceLang = document.getElementById('landingSourceLang');
    const targetLang = document.getElementById('landingTargetLang');
    
    if (this.direction === 'en-to-darija') {
      sourceLang.textContent = 'English';
      targetLang.textContent = 'Darija';
    } else {
      sourceLang.textContent = 'Darija';
      targetLang.textContent = 'English';
    }
  }

  toggleAuthMode() {
    this.isLogin = !this.isLogin;
    const emailGroup = document.getElementById('emailGroup');
    const authSubtitle = document.getElementById('authSubtitle');
    const submitAuthText = document.getElementById('submitAuthText');
    const switchText = document.getElementById('switchText');
    const switchModeBtn = document.getElementById('switchModeBtn');

    if (this.isLogin) {
      emailGroup.style.display = 'none';
      authSubtitle.textContent = 'Sign in to continue';
      submitAuthText.textContent = 'Sign In';
      switchText.textContent = "Don't have an account?";
      switchModeBtn.textContent = 'Sign Up';
    } else {
      emailGroup.style.display = 'block';
      authSubtitle.textContent = 'Create your account';
      submitAuthText.textContent = 'Create Account';
      switchText.textContent = 'Already have an account?';
      switchModeBtn.textContent = 'Sign In';
    }

    // Clear errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    const passwordField = document.getElementById('authPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    passwordField.type = this.showPassword ? 'text' : 'password';
    eyeIcon.textContent = this.showPassword ? 'visibility_off' : 'visibility';
  }

  async handleAuth() {
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;
    const email = document.getElementById('authEmail').value.trim();

    // Clear previous errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validation
    let hasError = false;
    if (!username || username.length < 3) {
      document.getElementById('usernameError').textContent = 'Username must be at least 3 characters';
      hasError = true;
    }
    if (!this.isLogin && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      document.getElementById('emailError').textContent = 'Invalid email format';
      hasError = true;
    }
    if (!password || password.length < 6) {
      document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) return;

    const submitBtn = document.getElementById('submitAuthBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = this.isLogin ? 'Signing in...' : 'Creating account...';

    try {
      const endpoint = this.isLogin ? '/auth/login' : '/auth/register';
      const body = this.isLogin ? { username, password } : { username, email, password };

      const response = await fetch(`${this.API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        this.sessionId = data.data.sessionId;
        this.user = data.data.user;
        
        await chrome.storage.local.set({
          sessionId: this.sessionId,
          user: this.user
        });

        this.updateAuthUI();
        alert(`Welcome${this.isLogin ? ' back' : ''}, ${this.user.username}!`);
        
        // Clear form
        document.getElementById('authUsername').value = '';
        document.getElementById('authEmail').value = '';
        document.getElementById('authPassword').value = '';
        
        this.showScreen('translation');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      alert('Cannot connect to server. Please check your connection.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = this.isLogin ? 'Sign In' : 'Create Account';
    }
  }

  async logout() {
    if (this.sessionId) {
      try {
        await fetch(`${this.API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${this.sessionId}` }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    await this.clearSession();
    this.updateAuthUI();
    alert('Logged out successfully');
    this.showScreen('landing');
  }

  showContextModal() {
    document.getElementById('contextModal').classList.remove('hidden');
  }

  hideContextModal() {
    document.getElementById('contextModal').classList.add('hidden');
  }

  selectContext(context) {
    this.selectedContext = context || null;
    
    // Update active state
    document.querySelectorAll('.context-option').forEach(opt => {
      opt.classList.remove('context-option-active');
      if (opt.dataset.context === context) {
        opt.classList.add('context-option-active');
      }
    });

    // Update display
    const contextNames = {
      '': 'Auto-detect',
      'casual': 'Casual',
      'formal': 'Formal',
      'medical': 'Medical',
      'business': 'Business',
      'shopping': 'Shopping',
      'restaurant': 'Restaurant',
      'travel': 'Travel',
      'emergency': 'Emergency',
      'social': 'Social'
    };

    document.getElementById('contextValue').textContent = contextNames[context] || 'Auto-detect';
    this.hideContextModal();
  }

  swapLanguages() {
    this.direction = this.direction === 'en-to-darija' ? 'darija-to-en' : 'en-to-darija';
    
    const inputLabel = document.getElementById('inputCardLabel');
    const outputLabel = document.getElementById('outputCardLabel');

    if (this.direction === 'en-to-darija') {
      inputLabel.textContent = 'ENGLISH';
      outputLabel.textContent = 'DARIJA';
    } else {
      inputLabel.textContent = 'DARIJA';
      outputLabel.textContent = 'ENGLISH';
    }

    // Swap text
    const inputText = document.getElementById('inputText').value;
    const outputText = document.getElementById('outputText').textContent;
    
    if (outputText !== 'Translation will appear here...') {
      document.getElementById('inputText').value = outputText;
      document.getElementById('outputText').textContent = inputText;
      document.getElementById('inputCounter').textContent = outputText.length;
    }
  }

  async translate() {
    const inputText = document.getElementById('inputText').value.trim();

    if (!inputText) {
      alert('Please enter some text!');
      return;
    }

    if (!this.sessionId) {
      alert('Please sign in to use translation');
      this.showScreen('auth');
      return;
    }

    const translateBtn = document.getElementById('translateButton');
    const outputText = document.getElementById('outputText');
    const loadingBox = document.getElementById('loadingBox');

    translateBtn.disabled = true;
    outputText.style.display = 'none';
    loadingBox.classList.remove('hidden');

    try {
      const requestBody = { 
        text: inputText, 
        direction: this.direction 
      };
      if (this.selectedContext) {
        requestBody.context = this.selectedContext;
      }

      const response = await fetch(`${this.API_URL}/translate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionId}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        outputText.textContent = data.data.translatedText;
        
        // Show context info
        if (data.data.context && data.data.contextConfidence) {
          const contextNames = {
            'casual': 'Casual', 'formal': 'Formal', 'medical': 'Medical',
            'business': 'Business', 'shopping': 'Shopping', 'restaurant': 'Restaurant',
            'travel': 'Travel', 'emergency': 'Emergency', 'social': 'Social'
          };
          
          const confidence = (data.data.contextConfidence * 100).toFixed(0);
          const contextSubtext = document.getElementById('contextSubtext');
          contextSubtext.textContent = `Detected: ${contextNames[data.data.context]} ${confidence}%`;
          contextSubtext.style.color = data.data.contextConfidence > 0.8 ? '#16A34A' : 
                                       data.data.contextConfidence > 0.6 ? '#D97706' : '#DC2626';
        }
      } else {
        if (response.status === 401) {
          await this.clearSession();
          alert('Session expired. Please sign in again.');
          this.showScreen('auth');
        } else {
          alert(data.error || 'Translation failed');
        }
      }
    } catch (error) {
      alert('Cannot connect to server');
      console.error(error);
    } finally {
      translateBtn.disabled = false;
      loadingBox.classList.add('hidden');
      outputText.style.display = 'block';
    }
  }

  speak(type) {
    const text = type === 'input'
      ? document.getElementById('inputText').value
      : document.getElementById('outputText').textContent;

    if (!text || text === 'Translation will appear here...') {
      alert('No text to speak');
      return;
    }

    const lang = (type === 'input' && this.direction === 'en-to-darija') ||
                 (type === 'output' && this.direction === 'darija-to-en')
      ? 'en-US' : 'ar-SA';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  clearAll() {
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').textContent = 'Translation will appear here...';
    document.getElementById('inputCounter').textContent = '0';
    document.getElementById('contextSubtext').textContent = '';
    window.speechSynthesis.cancel();
  }
}

const app = new DarijaTranslateExtension();