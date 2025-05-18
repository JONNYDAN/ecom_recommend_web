import Image from "next/image";
import React from "react";
import { Button, Col, Row } from "rsuite";
import NavLink from "../Navigation/NavLink";
import { useTranslation } from "next-i18next";
import { localeItems } from "@/config/localeConfig";

function ExamSimulator() {
  const { t: tHome } = useTranslation(localeItems.home);
  const { t: tButton } = useTranslation(localeItems.button);

  return (
    <div className="container py-5">
      <Row className="d-flex flex-wrap align-items-center">
        <Col xs={24} md={12}>
          <Image
            src="/images/sections/online-test.svg"
            alt="Exam simulator"
            width="400"
            height="400"
            className="mx-auto"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "400px",
              display: "block",
            }}
          />
        </Col>
        <Col
          xs={24}
          md={12}
          className="py-3 d-flex flex-column align-items-center "
        >
          <h2 className="mb-3">{tHome("exam_simulator")}</h2>
          <p className="lead mb-3">{tHome("exam_description")}</p>
          <Button
            size="lg"
            appearance="ghost"
            className="rounded-pill px-4 w-fit-content px-4 py-3 text-18 border-3"
            as={NavLink}
            href="/courses"
          >
            {tButton("try_it_now")}
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ExamSimulator;
