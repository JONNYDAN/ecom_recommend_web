import { useTranslation } from "next-i18next";

/**
 * to map useTranslation hook of next-i18next easier
 */
function useLocale(...arg) {
  return useTranslation(...arg);
}

export default useLocale;
