/**
 * Function to set a key value in cookie
 *
 * @param name Name of cookie
 * @param value Value of cookie
 * @param expires Expiration time
 * @param path Path of cookie
 */
export const setCookie = ({
  name,
  value,
  expires,
  path,
}: {
  name: string;
  value: string;
  expires?: Date;
  path?: string;
}) => {
  document.cookie = `${name}=${encodeURIComponent(value)};${expires ? `expires=${expires.toUTCString()}; ` : " "}path=${path ?? "/"}`;
};

/**
 * Function to get a cookie by value
 *
 * @param name Name of cookie
 * @returns Value of cookie
 */
export const getCookie = (name: string) => {
  const cookie =
    typeof window !== "undefined"
      ? document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
      : undefined;
  if (!cookie) return undefined;
  const index = cookie.indexOf("=");
  return decodeURIComponent(cookie.slice(index + 1));
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};
