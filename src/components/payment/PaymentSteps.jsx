import React, { useEffect, useState } from "react";
import { Steps, Button, Form, Message } from "rsuite";
import { CourseIconList } from "../courses/CourseCard";
import NavLink from "../Navigation/NavLink";
import { Trans } from "next-i18next";

import { scrollTo } from "@/utils/domUtil";
import { formatCurrency } from "@/utils/stringUtils";
import Image from "next/image";
import Timer from "../quiz/Timer";
import { PRODUCT_TYPE } from "@/utils/constant";
import useLocale from "@/hooks/useLocale";
import { localeItems } from "@/config/localeConfig";

function PaymentSteps({
  product,
  productType,
  submitOrder = () => {},
  order,
  isLoading,
}) {
  const { product_info: productInfo } = product;

  const [currentStep, setCurrentStep] = useState(0);

  const { t: tButton } = useLocale(localeItems.button);
  const { t: tPayment } = useLocale(localeItems.payment);

  const caculatePrice = () => {
    // TODO: implement logic to format and apply voucher in pharse 3
    return formatCurrency(productInfo.price);
  };

  // handle finish step 1
  const handleFinishConfirmStep = () => {
    submitOrder();
  };

  const redirectToPaymentUrl = () => {
    window.location.href = order?.pay_url;
  };

  useEffect(() => {
    if (order?.id && currentStep === 0) {
      setCurrentStep((v) => v + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // step 1: confirm information
  const renderConfirmationStep = () => {
    return (
      <div className="d-flex flex-column justify-content-center p-3 py-5 p-md-5 rounded mx-md-5 bg-light">
        <h6 className="text-center text-muted text-uppercase mb-4">
          {tPayment("product_information")}
        </h6>
        <div className="mb-3">
          <div>
            <span className="text-muted fw-500">
              {productType === PRODUCT_TYPE.COURSE
                ? tPayment("course")
                : tPayment("source")}
              :
            </span>{" "}
            <NavLink
              href={`/${
                productType === PRODUCT_TYPE.COURSE
                  ? tPayment("courses")
                  : tPayment("sources")
              }/${product.id}`}
            >
              {product.name}
            </NavLink>
          </div>
          <small>
            <CourseIconList courseInfo={product} itemClassName="pe-4" />
          </small>
        </div>
        <Form>
          <Form.Group controlId="voucher-form">
            <Form.ControlLabel className="text-muted fw-500 py-2">
              {tPayment("apply_voucher")}
            </Form.ControlLabel>
            <Form.Control
              name="voucher"
              placeholder={tPayment("enter_your_voucher")}
              style={{ width: "200px" }}
            />
            <Button appearance="primary" className="ms-3">
              {tButton("apply")}
            </Button>
          </Form.Group>
        </Form>
        <div className="my-3 w-fit-content">
          <div className="py-3 text-center rounded">
            <div className="mb-3 text-muted">
              <span className=" fw-500">{tPayment("payment_method")}:</span>{" "}
              <span>{tPayment("vietqr_internet_banking")}</span>
            </div>
            <Image
              src="/images/payment/vietqr.png"
              width={128}
              height={41}
              alt="payment method"
            />
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 text-20">
            <span className="fw-500">{tPayment("total")}:</span>{" "}
            <span className="text-success">{caculatePrice()}</span>
          </p>
          <Button
            appearance="primary"
            color="green"
            onClick={handleFinishConfirmStep}
            disabled={isLoading}
            loading={isLoading}
          >
            {tButton("confirm")}
          </Button>
        </div>
      </div>
    );
  };

  // step 2: pay course
  const renderPaymentStep = () => {
    if (order?.id) {
      return (
        <div className="d-flex flex-column align-items-center">
          <Message type="success" className="text-center">
            <p>{tPayment("payment_tutorial_message")}</p>
            <div className="text-center mb-3">
              <Image
                src="/images/payment/vietqr.png"
                width={128}
                height={41}
                alt="payment method"
              />
            </div>
            <div className="d-flex justify-content-center mb-3">
              <Timer
                className="payment-timer text-20 rounded-circle m-2 p-3 bg-white"
                duration={5}
                onFinish={redirectToPaymentUrl}
                concise
                showTimeOnly
              />
            </div>
            <p className="mb-3">
              <Trans
                defaults={tPayment("click_link_to_pay_mannually")}
                components={[<a href={order.pay_url} key="payment_link" />]}
              />
            </p>
          </Message>
        </div>
      );
    }

    return <Message type="error">{tPayment("some_errors_occured")}</Message>;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderConfirmationStep();
      case 1:
        return renderPaymentStep();

      default:
        return null;
    }
  };

  useEffect(() => {
    scrollTo(0);
  }, [currentStep]);

  return (
    <div>
      <Steps current={currentStep}>
        <Steps.Item title={tPayment("confirmation")} />
        <Steps.Item title={tPayment("payment")} />
      </Steps>
      <div className="pt-4">{renderCurrentStep()}</div>
    </div>
  );
}

export default PaymentSteps;
