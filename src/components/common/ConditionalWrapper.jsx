import React from "react";

function ConditionalWrapper({
  condition,
  children,
  wrapper,
  wrapperProps = {},
}) {
  if (condition) {
    const Wrapper = wrapper;

    return typeof wrapper === "function" ? (
      wrapper(children)
    ) : (
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    );
  }

  return children;
}

export default ConditionalWrapper;
