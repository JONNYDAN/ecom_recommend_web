import { authService } from "@/services";
import React, { useEffect } from "react";
import { Loader, Message } from "rsuite";
import { useRouter } from "next/router";
import useMessage from "@/hooks/useMessage";
import Link from "next/link";
import useSWR from "swr";
import useLocale from "@/hooks/useLocale";
import { localeItems } from "@/config/localeConfig";

function VerifyEmail({ token }) {
  const { data: { success, error } = {}, isLoading } = useSWR(
    ["verifyEmail", token],
    () => authService.verifyEmail(token)
  );

  const { t: tButton } = useLocale(localeItems.button);
  const { t: tVerify } = useLocale(localeItems.verifyEmail);

  const { showToast } = useMessage();
  const router = useRouter();

  const navigateToLoginPage = () => {
    router.replace("/authen/sign-in");
  };

  useEffect(() => {
    if (!isLoading && error) {
      showToast(error, { type: "error", duration: 20000 });
      router.replace("/authen/verify-email");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isLoading]);

  return (
    <div className="verify-email-container">
      {success ? (
        <div>
          <Message
            type="success"
            header={tVerify("email_verified_heading")}
            showIcon
          >
            {tVerify("be_redirected_message")}{" "}
            <Timer
              className="fw-500"
              concise
              duration={5}
              showTimeOnly
              onFinish={navigateToLoginPage}
            />
            s
            <p className="text-muted mt-3">
              <Link href="/authen/sign-in">{tButton("click_here")}</Link>{" "}
              {tVerify("mannual_login_message")}
            </p>
          </Message>
        </div>
      ) : (
        <Loader size="md" content={tVerify("verifying")} />
      )}
    </div>
  );
}

export default VerifyEmail;
