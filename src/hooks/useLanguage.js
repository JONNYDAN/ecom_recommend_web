import { LANGUAGES } from "@/utils/constant";
import { useTranslation } from "next-i18next";

function useLanguage() {
  const {
    i18n: { language },
  } = useTranslation();
  return {
    language,
    isEn: language === LANGUAGES.EN,
    isVi: language === LANGUAGES.VI,
  };
}

export default useLanguage;
