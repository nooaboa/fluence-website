(function () {
  'use strict';

  var POLICY_VERSION = '2026-05-01';
  var GA_ID = 'G-R1FJW3BWJ2';
  var API_URL = '/api/consent';
  var gaLoaded = false;

  function fetchConsent() {
    return fetch(API_URL, { method: 'GET', credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('Consent fetch failed');
        return res.json();
      });
  }

  function saveConsent(analytics) {
    return fetch(API_URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analytics: analytics }),
    }).then(function (res) {
      if (!res.ok) throw new Error('Consent save failed');
      return res.json();
    });
  }

  function updateGtagConsent(analytics) {
    if (typeof gtag !== 'function') return;
    gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }

  function loadGoogleAnalytics() {
    if (gaLoaded || typeof gtag !== 'function') return;
    gaLoaded = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function applyConsent(consent) {
    var analytics = consent && consent.analytics === true;
    updateGtagConsent(analytics);
    if (analytics) {
      loadGoogleAnalytics();
    }
  }

  function needsBanner(consent) {
    if (!consent) return true;
    if (consent.policyVersion !== POLICY_VERSION) return true;
    return false;
  }

  function createBanner() {
    var root = document.createElement('div');
    root.id = 'cookie-consent-root';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Cookie consent');

    root.innerHTML =
      '<div class="cookie-banner" id="cookie-banner" hidden>' +
        '<div class="cookie-banner-inner">' +
          '<div class="cookie-banner-text">' +
            '<p class="cookie-banner-title">We value your privacy</p>' +
            '<p class="cookie-banner-desc">We use a strictly necessary cookie to remember your choices. With your consent, we use Google Analytics to understand how visitors use our site. You can accept, reject, or manage preferences. <a href="cookie-policy.html">Cookie Policy</a></p>' +
          '</div>' +
          '<div class="cookie-banner-actions">' +
            '<button type="button" class="btn btn-ghost cookie-btn-reject" id="cookie-reject-all">Reject all</button>' +
            '<button type="button" class="btn btn-ghost cookie-btn-manage" id="cookie-manage">Manage preferences</button>' +
            '<button type="button" class="btn btn-primary cookie-btn-accept" id="cookie-accept-all">Accept all</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cookie-modal-overlay" id="cookie-modal-overlay" hidden aria-hidden="true">' +
        '<div class="cookie-modal" role="dialog" aria-labelledby="cookie-modal-title" aria-modal="true">' +
          '<button type="button" class="cookie-modal-close" id="cookie-modal-close" aria-label="Close">&times;</button>' +
          '<h2 id="cookie-modal-title" class="cookie-modal-title">Cookie preferences</h2>' +
          '<p class="cookie-modal-intro">Choose which cookies you allow. Strictly necessary cookies cannot be disabled because they store your consent choice.</p>' +
          '<div class="cookie-category">' +
            '<div class="cookie-category-header">' +
              '<div>' +
                '<h3>Strictly necessary</h3>' +
                '<p>Stores your cookie preferences so we do not ask again on every visit.</p>' +
              '</div>' +
              '<span class="cookie-always-on" aria-label="Always active">Always on</span>' +
            '</div>' +
          '</div>' +
          '<div class="cookie-category">' +
            '<div class="cookie-category-header">' +
              '<div>' +
                '<h3>Analytics</h3>' +
                '<p>Google Analytics helps us understand site usage. Data may be processed in the US. See our <a href="cookie-policy.html">Cookie Policy</a>.</p>' +
              '</div>' +
              '<label class="cookie-toggle">' +
                '<input type="checkbox" id="cookie-analytics-toggle" />' +
                '<span class="cookie-toggle-slider"></span>' +
              '</label>' +
            '</div>' +
          '</div>' +
          '<div class="cookie-modal-actions">' +
            '<button type="button" class="btn btn-ghost" id="cookie-modal-reject">Reject all</button>' +
            '<button type="button" class="btn btn-primary" id="cookie-modal-save">Save preferences</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(root);
    return root;
  }

  function showBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.hidden = false;
      banner.classList.add('cookie-banner-visible');
    }
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) {
      banner.hidden = true;
      banner.classList.remove('cookie-banner-visible');
    }
  }

  function openModal(analyticsChecked) {
    var overlay = document.getElementById('cookie-modal-overlay');
    var toggle = document.getElementById('cookie-analytics-toggle');
    if (toggle) toggle.checked = !!analyticsChecked;
    if (overlay) {
      overlay.hidden = false;
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cookie-modal-open');
    }
  }

  function closeModal() {
    var overlay = document.getElementById('cookie-modal-overlay');
    if (overlay) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cookie-modal-open');
    }
  }

  function handleChoice(analytics) {
    return saveConsent(analytics)
      .then(function (data) {
        applyConsent(data.consent);
        hideBanner();
        closeModal();
        return data.consent;
      });
  }

  function bindEvents() {
    document.getElementById('cookie-accept-all').addEventListener('click', function () {
      handleChoice(true);
    });

    document.getElementById('cookie-reject-all').addEventListener('click', function () {
      handleChoice(false);
    });

    document.getElementById('cookie-manage').addEventListener('click', function () {
      openModal(false);
    });

    document.getElementById('cookie-modal-close').addEventListener('click', closeModal);
    document.getElementById('cookie-modal-overlay').addEventListener('click', function (e) {
      if (e.target === e.currentTarget) closeModal();
    });

    document.getElementById('cookie-modal-reject').addEventListener('click', function () {
      handleChoice(false);
    });

    document.getElementById('cookie-modal-save').addEventListener('click', function () {
      var toggle = document.getElementById('cookie-analytics-toggle');
      handleChoice(toggle && toggle.checked);
    });

    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        fetchConsent()
          .then(function (data) {
            var analytics = data.consent && data.consent.analytics;
            openModal(analytics);
          })
          .catch(function () {
            openModal(false);
          });
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function init() {
    createBanner();
    bindEvents();

    fetchConsent()
      .then(function (data) {
        var consent = data.consent;
        if (needsBanner(consent)) {
          updateGtagConsent(false);
          showBanner();
        } else {
          applyConsent(consent);
        }
      })
      .catch(function () {
        updateGtagConsent(false);
        showBanner();
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
