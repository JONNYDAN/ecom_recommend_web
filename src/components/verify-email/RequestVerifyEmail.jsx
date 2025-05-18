import React, { useRef, useState } from "react";
import { Button, Form, InputGroup, Panel, Schema, Stack } from "rsuite";
import Brand from "../Brand";
import useMessage from "@/hooks/useMessage";
import NavLink from "../Navigation/NavLink";
import { authService } from "@/services";
import Timer from "../quiz/Timer";
import useToggle from "@/hooks/useToggle";
import LanguageSwitch from "../Navigation/LanguageSwitch";
import useLocale from "@/hooks/useLocale";
import { localeItems } from "@/config/localeConfig";

const { StringType } = Schema.Types;

function RequestVerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequest, toggleSentRequest] = useToggle(false);

  const formRef = useRef(null);
  const [formValue, setPasswordFormValue] = useState({
    email: "",
  });

  const { showToast } = useMessage();

  const { t: tCommon } = useLocale(localeItems.common);
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tFormRule } = useLocale(localeItems.formRule);
  const { t: tVerify } = useLocale(localeItems.verifyEmail);

  const verifyFormModel = Schema.Model({
    email: StringType()
      .isEmail(tFormRule("invalid_email_message"))
      .isRequired(tFormRule("require_field_message")),
  });

  const handleUpdatePassword = async () => {
    if (!formRef.current.check() || sentRequest) {
      return;
    }

    setIsLoading(true);

    const { success, error } = await authService.requestVerifyEmail({
      email: formValue.email,
    });
    setIsLoading(false);

    if (success) {
      toggleSentRequest();

      // show notification then redirect user to login page after 3s
      showToast(tVerify("reset_tutorial"), {
        duration: 0,
      });
    } else {
      showToast(error || tVerify("some_errors_occured"), {
        type: "error",
      });
    }
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      className="full-height"
    >
      <Brand className="mb-3" />
      <Stack.Item className="authen-card">
        <Panel shaded header={tVerify("heading")}>
          <Form
            className="mt-2"
            ref={formRef}
            model={verifyFormModel}
            onChange={setPasswordFormValue}
            formValue={formValue}
          >
            <Form.Group>
              <Form.ControlLabel>{tVerify("your_emal")}</Form.ControlLabel>
              <InputGroup style={{ width: "100%" }}>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder={tVerify("enter_your_email")}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="d-flex justify-content-between">
              <Button
                appearance="primary"
                disabled={isLoading || sentRequest}
                loading={isLoading}
                onClick={handleUpdatePassword}
                className="d-flex"
              >
                {tButton("send")}
              </Button>
              <Button appearance="link" as={NavLink} href="/authen/sign-in">
                {tButton("back_to_sign_in")}
              </Button>
            </Form.Group>
            {sentRequest && (
              <Form.Group>
                <p className="text-muted">
                  {tVerify("request_after")}{" "}
                  <Timer
                    duration={60}
                    showTimeOnly
                    onFinish={toggleSentRequest}
                  />
                </p>
              </Form.Group>
            )}
          </Form>
        </Panel>
      </Stack.Item>
      <div className="mt-3">
        <small className="mx-2">{tCommon("language")}:</small>
        <LanguageSwitch />
      </div>
    </Stack>
  );
}

export default RequestVerifyEmail;
