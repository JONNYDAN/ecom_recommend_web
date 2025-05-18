import PageContainer from "@/components/common/PageContainer";
import useMessage from "@/hooks/useMessage";
import { setAuthState } from "@/redux/auth/authSlice";
import { login } from "@/redux/auth/authThunk";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "rsuite";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales } from "@/config/localeConfig";

export async function getServerSideProps({ query, locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales()
  );

  return {
    props: {
      code: query.code || null,
      ...translation,
    },
  };
}

function GoogleLoginPage({ code }) {
  const { isLoggedIn = false, error = null } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const { showToast } = useMessage();

  useEffect(() => {
    if (!code) {
      router.replace("/authen/sign-in");
    } else {
      dispatch(login({ code }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      // navigate to redirectUrl or home page after login successfully
      const redirectUrl = router.query.redirectUrl || "/";
      router.replace(redirectUrl);
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (error) {
      showToast(error, { type: "error" });
      // reset error to avoid error message is shown up when user navigates to sign-in page
      dispatch(
        setAuthState({
          error: null,
          errorCode: null,
        })
      );
      router.replace("/authen/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <PageContainer>
      <div className="verify-email-container">
        <Loader size="md" content="Checking..." />
      </div>
    </PageContainer>
  );
}

export default GoogleLoginPage;
