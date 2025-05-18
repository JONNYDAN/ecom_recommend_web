import { getRawText } from "@/utils/stringUtils";
import clsx from "clsx";
import React from "react";

function RichText({ className, content, textOnly, as }) {
  const Element = as || "div";

  const classNames = clsx("richtext-container", className);

  if (textOnly) {
    const textContent = getRawText(content);
    return <Element className={classNames}>{textContent}</Element>;
  }

  const innerHtml = {
    __html: content,
  };
  return (
    <Element
      className={classNames}
      dangerouslySetInnerHTML={innerHtml}
    ></Element>
  );
}

export default React.memo(RichText);
