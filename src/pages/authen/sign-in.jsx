import React, { useMemo } from "react";
import { Form, Button, Panel, Stack, Schema } from "rsuite";
import Link from "next/link";
import Brand from "@/components/Brand";
import useInput from "@/hooks/useInput";

// redux
import { login } from "@/redux/auth/authThunk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useMessage from "@/hooks/useMessage";
import PageContainer from "@/components/common/PageContainer";
import { resetAuthState, setAuthState } from "@/redux/auth/authSlice";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import LanguageSwitch from "@/components/Navigation/LanguageSwitch";
import useLocale from "@/hooks/useLocale";
import { useBodyClass } from "@/hooks/useBodyClass";

const { StringType } = Schema.Types;

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.signIn, localeItems.formRule)
  );

  return {
    props: {
      ...translation,
    },
  };
}

const SignIn = () => {
  const email = useInput("");
  const password = useInput("");
  const {
    isLoggedIn = false,
    isLoading = false,
    error = null,
    errorCode = null,
  } = useSelector((state) => state.auth);

  const { showToast } = useMessage();

  const dispatch = useDispatch();
  const router = useRouter();

  const { t: tCommon } = useLocale(localeItems.common);
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tSignIn } = useLocale(localeItems.signIn);
  const { t: tFormRule } = useLocale(localeItems.formRule);

  const formModel = Schema.Model({
    email: StringType()
      .isEmail(tFormRule("invalid_email_message"))
      .isRequired(tFormRule("require_field_message")),
    password: StringType().isRequired(tFormRule("require_field_message")),
  });

  const handleLogin = async (event) => {
    if (email.value && password.value) {
      await dispatch(
        login({
          email: email.value,
          password: password.value,
        })
      );
    }
  };

  const navigateToRegister = () => {
    dispatch(resetAuthState());
  };

  useEffect(() => {
    if (isLoggedIn) {
      // navigate to redirectUrl or home page after login successfully
      const redirectUrl = router.query.redirectUrl || "/";
      router.replace(redirectUrl);
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (error) {
      showToast(error, { type: "error", duration: 5000 });
      // reset error to avoid error message is shown up when user navigates to sign-in page
      dispatch(
        setAuthState({
          error: null,
          errorCode: null,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useBodyClass("background-login");
  

  return (
    <PageContainer metaData={{ title: tSignIn("meta_title") }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        className="full-height"
      >
        <Brand style={{ marginBottom: 10 }} />

        <Stack.Item className="authen-card bg-white shadow-sm" style={{borderRadius: '10px'}}>
          <Panel shaded header={tSignIn("heading")}>
            <p style={{ marginBottom: 10 }}>
              <span className="text-muted">{tSignIn("new_here")} </span>{" "}
              <Link
                href="/authen/sign-up"
                className="text-14"
                onClick={navigateToRegister}
              >
                {tSignIn("create_an_account")}
              </Link>
            </p>

            <Form model={formModel} fluid onSubmit={handleLogin}>
              <Form.Group>
                <Form.ControlLabel>
                  {tSignIn("email_address")}
                </Form.ControlLabel>
                <Form.Control {...email} name="email" />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>
                  <span>{tSignIn("password")}</span>
                  <Link
                    className="text-14"
                    href="/authen/forgot-password"
                    style={{ float: "right" }}
                  >
                    {tSignIn("forgot_password")}
                  </Link>
                </Form.ControlLabel>
                <Form.Control {...password} name="password" type="password" />
              </Form.Group>
              <Form.Group>
                <Stack justifyContent="space-between">
                  <Button
                    appearance="primary"
                    type="submit"
                    onClick={handleLogin}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {tButton("sign_in")}
                  </Button>
                </Stack>
              </Form.Group>
            </Form>
          </Panel>
        </Stack.Item>
      </Stack>
    </PageContainer>
  );
};

export default SignIn;
