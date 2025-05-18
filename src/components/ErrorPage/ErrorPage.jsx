import React from "react";
import * as errors from "@/images/errors";
import Image from "next/image";

const ErrorPage = ({ code = 404, children }) => (
  <div className="container error-page">
    <div className="item">
      <Image src={errors[`Error${code}Img`]} alt={`Error${code}Img`} />
      <div className="text">
        <h1 className="error-page-code">{code}</h1>
        {children}
      </div>
    </div>
  </div>
);

export default ErrorPage;
