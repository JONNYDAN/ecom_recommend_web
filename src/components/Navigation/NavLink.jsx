import React from "react";
import Link from "next/link";

const NavLink = ({ href, as, ...rest }, ref) => (
  <Link href={href} as={as} ref={ref} {...rest} />
);

export default React.forwardRef(NavLink);
