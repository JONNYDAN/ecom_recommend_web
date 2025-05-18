import React from "react";

import clsx from "clsx";

function TextTruncated({ className, children, lines }) {
  return (
    <div
      className={clsx("text-truncate-container", className)}
      style={{ "--lines": lines }}
    >
      {children}
    </div>
  );
}

TextTruncated.defaultProps = {
  lines: 3,
};

export default TextTruncated;
