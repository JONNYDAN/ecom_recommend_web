import React from "react";
import { IconButton } from "rsuite";
import ArrowLeftLine from "@rsuite/icons/ArrowLeftLine";
import ErrorPage from "@/components/ErrorPage";
import NavLink from "@/components/Navigation/NavLink";
import PageContainer from "@/components/common/PageContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.errorPage)
  );

  return {
    props: {
      ...translation,
    },
  };
}

const PageNotFound = () => {
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tError } = useLocale(localeItems.errorPage);

  return (
    <PageContainer metaData={{ title: tError("not_found_meta_title") }}>
      <ErrorPage code={404}>
        <p className="error-page-subtitle text-muted ">
          {tError("not_found_heading")}
        </p>
        <IconButton
          icon={<ArrowLeftLine />}
          appearance="primary"
          href="/"
          as={NavLink}
        >
          {tButton("take_me_home")}
        </IconButton>
      </ErrorPage>
    </PageContainer>
  );
};

export default PageNotFound;
