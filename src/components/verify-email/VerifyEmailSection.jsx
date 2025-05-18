import React, { useState } from "react";
import { IconButton, Message } from "rsuite";
import useMessage from "@/hooks/useMessage";
import { authService } from "@/services";
import Timer from "../quiz/Timer";
import useToggle from "@/hooks/useToggle";
import { MdOutlineCheckCircle } from "react-icons/md";

function VerifyEmailSection({ email }) {
  const [isLoading, setIsLoading] = useState(false);
  const [sentRequest, toggleSentRequest] = useToggle(false);

  const { showToast } = useMessage();

  const requestVerifyEmail = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);

    const { success, error } = await authService.requestVerifyEmail({
      email,
    });
    setIsLoading(false);

    if (success) {
      toggleSentRequest();

      // show notification then redirect user to login page after 3s
      showToast(
        "Please check your email and click on the verification link to complete the process."
      );
    } else {
      showToast(error || "Some errors occured. Please try again!", {
        type: "error",
      });
    }
  };

  return (
    <Message type={sentRequest ? "info" : "warning"} showIcon className="mb-3">
      {sentRequest ? (
        <div>
          <p className="text-muted mb-0">
            <span className="fw-500">
              Please check your email and click on the verification link to
              complete the process.
            </span>
            <br />
            You can request to send the email again after{" "}
            <Timer duration={60} showTimeOnly onFinish={toggleSentRequest} />
          </p>
        </div>
      ) : (
        <div>
          <span className="fw-500">Your email is not verified!</span>{" "}
          <IconButton
            appearance="primary"
            color="green"
            className="ms-3"
            size="sm"
            icon={<MdOutlineCheckCircle />}
            placement="right"
            disabled={isLoading || sentRequest}
            loading={isLoading}
            onClick={requestVerifyEmail}
          >
            Verify now
          </IconButton>
        </div>
      )}
    </Message>
  );
}

export default VerifyEmailSection;
