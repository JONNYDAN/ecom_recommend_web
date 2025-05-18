import PageContainer from "@/components/common/PageContainer";
import React from "react";
import VerifyEmail from "@/components/verify-email/VerifyEmail";
import RequestVerifyEmail from "@/components/verify-email/RequestVerifyEmail";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";

export async function getServerSideProps({ query, locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.verifyEmail, localeItems.formRule)
  );

  return {
    props: {
      token: query.token || null,
      ...translation,
    },
  };
}

function VerifyEmailPage({ token }) {
  const { t: tVerify } = useLocale(localeItems.verifyEmail);

  return (
    <PageContainer
      metaData={{ title: tVerify("meta_title") }}
      className="container"
    >
      {token ? <VerifyEmail token={token} /> : <RequestVerifyEmail />}
    </PageContainer>
  );
}

export default VerifyEmailPage;
