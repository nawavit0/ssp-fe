import Cookies from 'js-cookie';

export function setCookie(cookieName, value, expires = 365) {
  Cookies.set(cookieName, value, { expires: expires });
}

export function unsetCookie(cookieName) {
  Cookies.remove(cookieName);
}

export function getCookie(cookieName) {
  return Cookies.get(cookieName);
}
