import PageContainer from "@/components/common/PageContainer";
import React, { useRef, useState } from "react";
import { Button, Form, InputGroup, Panel, Schema, Stack } from "rsuite";
import useToggle from "@/hooks/useToggle";
import Brand from "@/components/Brand";
import { authService } from "@/services";
import useMessage from "@/hooks/useMessage";
import NavLink from "@/components/Navigation/NavLink";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";
import LanguageSwitch from "@/components/Navigation/LanguageSwitch";

const { StringType } = Schema.Types;

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.forgotPassword, localeItems.formRule)
  );

  return {
    props: {
      ...translation,
    },
  };
}

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef(null);
  const [formValue, setPasswordFormValue] = useState({
    email: "",
  });

  const { showToast } = useMessage();

  const { t: tCommon } = useLocale(localeItems.common);
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tForgot } = useLocale(localeItems.forgotPassword);
  const { t: tFormRule } = useLocale(localeItems.formRule);

  const passwordFormModel = Schema.Model({
    email: StringType()
      .isEmail(tFormRule("invalid_email_message"))
      .isRequired(tFormRule("require_field_message")),
  });

  const handleUpdatePassword = async () => {
    if (!formRef.current.check()) {
      return;
    }

    setIsLoading(true);

    const { success, error } = await authService.forgotPassword({
      email: formValue.email,
    });
    setIsLoading(false);

    if (success) {
      // show notification then redirect user to login page after 3s
      showToast(tForgot("reset_tutorial"), {
        duration: 0,
      });
    } else {
      showToast(error || tForgot("some_errors_occured"), {
        type: "error",
      });
    }
  };

  return (
    <PageContainer
      metaData={{ title: tForgot("meta_title") }}
      className="container"
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        className="full-height"
      >
        <Brand className="mb-3" />

        <Stack.Item className="authen-card">
          <Panel
            shaded
            style={{ maxWidth: 400 }}
            className="authen-card w-100"
            header={tForgot("heading")}
          >
            <Form
              className="mt-2"
              ref={formRef}
              model={passwordFormModel}
              onChange={setPasswordFormValue}
              formValue={formValue}
            >
              <Form.Group>
                <Form.ControlLabel>{tForgot("your_email")}</Form.ControlLabel>
                <InputGroup style={{ width: "100%" }}>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder={tForgot("enter_your_email")}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="d-flex justify-content-between">
                <Button
                  appearance="primary"
                  disabled={isLoading}
                  onClick={handleUpdatePassword}
                  className="d-flex"
                >
                  {tButton("reset_password")}
                </Button>
                <Button appearance="link" as={NavLink} href="/authen/sign-in">
                  {tButton("back_to_sign_in")}
                </Button>
              </Form.Group>
            </Form>
          </Panel>
        </Stack.Item>

        <div className="mt-3">
          <small className="mx-2">{tCommon("language")}:</small>
          <LanguageSwitch />
        </div>
      </Stack>
    </PageContainer>
  );
}

export default ForgotPasswordPage;
