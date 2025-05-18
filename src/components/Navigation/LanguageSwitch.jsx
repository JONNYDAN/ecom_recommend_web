import { memo, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { Dropdown } from "rsuite";

import { LANGUAGES } from "@/utils/constant";
import useLanguage from "@/hooks/useLanguage";
import SafeImage from "../common/SafeImage";
import { useRouter } from "next/router";

const viFlagUrl = "/images/logo/vietnamese.png";
const enFlagUrl = "/images/logo/english.png";

function LanguageSwitch({ showTitle, onChange = () => {} }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { language, isVi, isEn } = useLanguage();
  const flagUrl = isVi ? viFlagUrl : enFlagUrl;

  const title = useMemo(
    () => (
      <div className="d-flex align-items-center ">
        <SafeImage
          src={flagUrl}
          width={64}
          height={64}
          style={{ height: "24px", width: "24px" }}
        />
        {showTitle && <span>{t("language")}</span>}
      </div>
    ),
    [flagUrl, showTitle, t]
  );

  const handleChangeLanguage = (nextLanguage) => {
    if (nextLanguage === language) {
      return;
    }

    const { pathname, asPath, query } = router;
    // change just the locale and maintain all other route information including href's query
    router.push({ pathname, query }, asPath, { locale: nextLanguage });

    if (typeof onChange === "function") {
      // involve the callback prop
      onChange(nextLanguage);
    }
  };

  return (
    // <Dropdown noCaret classPrefix="" style={{zIndex: 1032}} icon={title}>
    <Dropdown noCaret style={{zIndex: 1032}} title={title}>
      <Dropdown.Item
        active={isEn}
        onClick={() => handleChangeLanguage(LANGUAGES.EN)}
      >
        {t("english")}
      </Dropdown.Item>
      <Dropdown.Item
        active={isVi}
        onClick={() => handleChangeLanguage(LANGUAGES.VI)}
      >
        {t("vietnamese")}
      </Dropdown.Item>
    </Dropdown>
  );
}

export default memo(LanguageSwitch);
