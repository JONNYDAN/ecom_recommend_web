import Brand from "@/components/Brand";
import PageContainer from "@/components/common/PageContainer";
import LanguageSwitch from "@/components/Navigation/LanguageSwitch";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import useLocale from "@/hooks/useLocale";
import useMessage from "@/hooks/useMessage";
import useToggle from "@/hooks/useToggle";
import { authService } from "@/services";
import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Button, Form, InputGroup, Panel, Schema, Stack } from "rsuite";

const { StringType } = Schema.Types;

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.resetPassword, localeItems.formRule)
  );

  return {
    props: {
      ...translation,
    },
  };
}

function ResetPasswordPage() {
  const [visiblePassword, toggleVisiblePassword] = useToggle(false);
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef(null);
  const [formValue, setPasswordFormValue] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const router = useRouter();
  const { showToast } = useMessage();

  const { t: tCommon } = useLocale(localeItems.common);
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tReset } = useLocale(localeItems.resetPassword);
  const { t: tFormRule } = useLocale(localeItems.formRule);

  const passwordFormModel = Schema.Model({
    newPassword: StringType()
      .minLength(8, tFormRule("min_8_character"))
      .containsUppercaseLetter(tFormRule("uppercase_rule"))
      .containsLowercaseLetter(tFormRule("lowercase_rule"))
      .isRequired(tFormRule("require_field_message")),
    confirmPassword: StringType()
      .addRule((value, data) => {
        if (value !== data.newPassword) {
          return false;
        }
        return true;
      }, tFormRule("password_not_match"))
      .isRequired(tFormRule("require_field_message")),
  });

  const handleUpdatePassword = async () => {
    if (!formRef.current.check()) {
      return;
    }

    setIsLoading(true);

    const token = router.query.token;
    const status = await authService.resetPassword({
      password: formValue.newPassword,
      token,
    });
    setIsLoading(false);

    if (status) {
      // show notification then redirect user to login page after 3s
      showToast(tReset("reset_success_message"), {
        duration: 6000,
      });
      setTimeout(() => {
        router.push(`/authen/sign-in`);
      }, 3000);
    } else {
      showToast(tReset("some_errors_occured"), { type: "error" });
    }
  };

  return (
    <PageContainer
      metaData={{ title: tReset("meta_title") }}
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
          <Panel shaded header={tReset("heading")}>
            <Form
              className="mt-2"
              ref={formRef}
              model={passwordFormModel}
              onChange={setPasswordFormValue}
              formValue={formValue}
            >
              <Form.Group>
                <Form.ControlLabel>{tReset("new_password")}</Form.ControlLabel>
                <InputGroup inside style={{ width: "100%" }}>
                  <Form.Control
                    name="newPassword"
                    type={visiblePassword ? "text" : "password"}
                    autoComplete="off"
                  />
                  <InputGroup.Button onClick={toggleVisiblePassword}>
                    {visiblePassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </InputGroup.Button>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>
                  {tReset("confirm_password")}
                </Form.ControlLabel>
                <InputGroup style={{ width: "100%" }}>
                  <Form.Control
                    name="confirmPassword"
                    type={visiblePassword ? "text" : "password"}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Button
                  appearance="primary"
                  disabled={isLoading}
                  onClick={handleUpdatePassword}
                >
                  {tButton("update")}
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

export default ResetPasswordPage;
