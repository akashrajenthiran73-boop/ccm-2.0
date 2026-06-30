// ===== THEME EFFECTS MANAGER =====

class ThemeEffects {
  constructor() {
    this.init();
  }

  init() {
    this.addBMWLoadEffect();
    this.addLionStatsEffect();
    this.addSpiderNotifications();
    this.addTransformerButtons();
    this.addPageTransitions();
  }

  // 1. BMW - Page Load Effect
  addBMWLoadEffect() {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('bmw-load');
      setTimeout(() => {
        document.body.classList.remove('bmw-load');
      }, 800);
    });
  }

  // 2. LION - Profile Stats Roar
  addLionStatsEffect() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.lion-stat')) {
        const stat = e.target.closest('.lion-stat');
        stat.classList.add('lion-roar');
        setTimeout(() => {
          stat.classList.remove('lion-roar');
        }, 800);
      }
    });
  }

  // 3. SPIDER - Chat Notifications
  addSpiderNotifications() {
    window.showSpiderNotification = (element) => {
      element.classList.add('spider-notify', 'spider-web');
      setTimeout(() => {
        element.classList.remove('spider-notify', 'spider-web');
      }, 600);
    }
  }

  // 4. TRANSFORMERS - Button Transform
  addTransformerButtons() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.transformer-btn');
      if (btn) {
        btn.style.pointerEvents = 'none';
        setTimeout(() => {
          btn.style.pointerEvents = 'auto';
        }, 600);
      }
    });

    // Success animation trigger
    window.showTransformSuccess = (element) => {
      element.classList.add('transformer-success');
      setTimeout(() => {
        element.classList.remove('transformer-success');
      }, 800);
    }
  }

  // 5. PAGE TRANSITIONS
  addPageTransitions() {
    document.querySelectorAll('a[href$=".html"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.hostname === window.location.hostname) {
          document.body.style.opacity = '0';
          document.body.style.transition = 'opacity 0.2s';
        }
      });
    });

    // Page enter effect
    window.addEventListener('pageshow', () => {
      document.body.classList.add('page-transition');
    });
  }
}

// Init
new ThemeEffects();