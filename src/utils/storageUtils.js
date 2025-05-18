import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const TOKEN_KEY = `T${btoa("token")}`.replaceAll("=", "");
export const USER_KEY = `U${btoa("user")}`.replaceAll("=", "");

const defaultCookieOptions = {
  path: "/",
  maxAge: 3 * 24 * 60 * 60, // 3 days
};

export const toBase64 = (str) => {
  return btoa(encodeURIComponent(str));
};

export const decodeBase64 = (b64Str) => {
  return decodeURIComponent(atob(b64Str));
};

export const setToken = (token, options) => {
  setCookie(TOKEN_KEY, token, { ...defaultCookieOptions, ...options });
};

export const getToken = (options) => {
  return getCookie(TOKEN_KEY, options);
};

export const clearToken = (options) => {
  deleteCookie(TOKEN_KEY, options);
};

export const setUser = (user, options) => {
  try {
    const encodedUser = toBase64(JSON.stringify(user));
    setCookie(USER_KEY, encodedUser, { ...defaultCookieOptions, ...options });
  } catch (err) {
    console.log("Can not set user: ", err);
  }
};

export const parseEncodedUser = (encodedUser) => {
  try {
    return JSON.parse(decodeBase64(encodedUser));
  } catch (err) {}
  return null;
};

export const getUser = (options) => {
  const encodedUser = getCookie(USER_KEY, options);
  return parseEncodedUser(encodedUser);
};

export const clearUser = (options) => {
  deleteCookie(USER_KEY, options);
};

export const isAuthenticated = (context) => {
  return validateTokenBasic(getToken(context)) && !!getUser(context);
};

export const validateTokenBasic = (token) => {
  try {
    // get token data - the 2nd part in the token
    // const [, tokenData] = token.split(".");

    // const { exp: expireTime } = JSON.parse(decodeBase64(tokenData));
    // const currentTime = +new Date();

    // return +expireTime > currentTime;
    return true;
  } catch (_err) {
    return false;
  }
};
