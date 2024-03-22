const handleCookieSettingsChange = () => {
  const cookieSettingsFooterBtn = document.querySelector(".footer__cookie-settings");
  cookieSettingsFooterBtn.addEventListener("click", () => {
    const cookieSettingsBtn = document.querySelector(".cky-btn-revisit");
    if (!cookieSettingsBtn) return;

    cookieSettingsBtn.click();
  });
};

window.addEventListener("DOMContentLoaded", handleCookieSettingsChange);
