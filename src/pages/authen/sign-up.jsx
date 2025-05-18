import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Form,
  Button,
  Panel,
  InputGroup,
  Stack,
  Divider,
  Schema,
} from "rsuite";

import EyeIcon from "@rsuite/icons/legacy/Eye";
import EyeSlashIcon from "@rsuite/icons/legacy/EyeSlash";
import Link from "next/link";
import Brand from "@/components/Brand";
import { resetAuthState } from "@/redux/auth/authSlice";
import { register } from "@/redux/auth/authThunk";
import { useDispatch, useSelector } from "react-redux";
import useMessage from "@/hooks/useMessage";
import { useRouter } from "next/router";
import PageContainer from "@/components/common/PageContainer";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { combineListLocales, localeItems } from "@/config/localeConfig";
import LanguageSwitch from "@/components/Navigation/LanguageSwitch";
import useLocale from "@/hooks/useLocale";

const { StringType } = Schema.Types;

export async function getStaticProps({ locale }) {
  const translation = await serverSideTranslations(
    locale,
    combineListLocales(localeItems.signUp, localeItems.formRule)
  );

  return {
    props: {
      ...translation,
    },
  };
}

const SignUp = () => {
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState(false);

  const {
    isLoggedIn = false,
    isRegistered = false,
    isLoading = false,
    error = null,
  } = useSelector((state) => state.auth);

  const formRef = useRef(null);

  const router = useRouter();
  const { showToast } = useMessage();
  const dispatch = useDispatch();

  const { t: tCommon } = useLocale(localeItems.common);
  const { t: tButton } = useLocale(localeItems.button);
  const { t: tSignUp } = useLocale(localeItems.signUp);
  const { t: tFormRule } = useLocale(localeItems.formRule);

  const formModel = Schema.Model({
    name: StringType()
      .maxLength(30, tFormRule("name_maxlen_rule"))
      .isRequired(tFormRule("require_field_message")),
    email: StringType()
      .isEmail(tFormRule("invalid_email_message"))
      .isRequired(tFormRule("require_field_message")),
    password: StringType()
      .minLength(8, tFormRule("min_8_character"))
      .containsUppercaseLetter(tFormRule("uppercase_rule"))
      .containsLowercaseLetter(tFormRule("lowercase_rule"))
      .isRequired(tFormRule("require_field_message")),
    confirmPassword: StringType()
      .addRule((value, data) => {
        if (value !== data.password) {
          return false;
        }
        return true;
      }, tFormRule("password_not_match"))
      .isRequired(tFormRule("require_field_message")),
  });

  const handleRegister = () => {
    if (formRef.current.check()) {
      dispatch(
        register({
          email: formValue.email,
          name: formValue.name,
          password: formValue.password,
        })
      );
    }
  };

  useEffect(() => {
    if (isRegistered) {
      showToast(tSignUp("registered_success_message"), { type: "success" });
      dispatch(resetAuthState());

      // navigate to sign-in page after registering successfully
      router.push("/authen/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegistered]);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/");
    } else {
      // reset auth state when user access sign-up page
      dispatch(resetAuthState());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <PageContainer metaData={{ title: tSignUp("meta_title") }}>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="column"
        className="full-height"
      >
        <Brand style={{ marginBottom: 10 }} />
        <Stack.Item className="authen-card">
          <Panel header={tSignUp("create_an_account")} shaded>
            <p>
              <span>{tSignUp("already_have_an_account")}</span>{" "}
              <Link className="text-14" href="/authen/sign-in">
                {tSignUp("sign_in_here")}
              </Link>
            </p>

            <Divider>{tSignUp("or")}</Divider>

            <Form
              ref={formRef}
              model={formModel}
              fluid
              onChange={setFormValue}
              formValue={formValue}
            >
              <Form.Group>
                <Form.ControlLabel>{tSignUp("username")}</Form.ControlLabel>
                <Form.Control name="name" />
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>{tSignUp("email")}</Form.ControlLabel>
                <Form.Control name="email" />
              </Form.Group>
              <Form.Group>
                <Form.ControlLabel>{tSignUp("password")}</Form.ControlLabel>
                <InputGroup inside style={{ width: "100%" }}>
                  <Form.Control
                    name="password"
                    type={visible ? "text" : "password"}
                    autoComplete="off"
                  />
                  <InputGroup.Button onClick={() => setVisible(!visible)}>
                    {visible ? <EyeIcon /> : <EyeSlashIcon />}
                  </InputGroup.Button>
                </InputGroup>
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>
                  {tSignUp("confirm_password")}
                </Form.ControlLabel>
                <Form.Control
                  name="confirmPassword"
                  type={visible ? "text" : "password"}
                />
              </Form.Group>

              <Form.Group>
                <Stack justifyContent="space-between">
                  <Button
                    appearance="primary"
                    type="submit"
                    onClick={handleRegister}
                    loading={isLoading}
                    disabled={isLoading || isRegistered}
                  >
                    {tButton("create")}
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

export default SignUp;
