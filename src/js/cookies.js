const setCookie = (name, value, expires, miliseconds) => {
  const date = new Date();

  if (!expires) {
    date.setTime(date.getTime() + 400 * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  } else if (miliseconds) {
    date.setTime(date.getTime() + miliseconds);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  } else {
    document.cookie = `${name}=${value};path=/`;
  }
};

const getCookie = (name) => {
  const cookies = document.cookie.split(";");
  const cookie = cookies.find((el) => {
    const key = el.split("=")[0];
    return key.trim() === name;
  });

  if (cookie) {
    return cookie.split("=")[1];
  }

  return null;
};

const removeCookie = (name) => {
  const date = new Date();
  date.setTime(date.getTime() - 1000);
  document.cookie = `${name}= ; expires=${date.toUTCString()}; path=/`;
};

const handleCookieSettingsChange = () => {
  const cookieSettingsFooterBtn = document.querySelector(".footer__cookie-settings");
  if (!cookieSettingsFooterBtn) return;

  cookieSettingsFooterBtn.addEventListener("click", () => {
    const cookieSettingsBtn = document.querySelector(".cky-btn-revisit");
    if (!cookieSettingsBtn) return;

    cookieSettingsBtn.click();
  });
};

export { setCookie, getCookie, removeCookie, handleCookieSettingsChange };
