import React from "react";
import Link from "next/link";
import { Stack } from "rsuite";
import Image from "next/image";

const Brand = (props) => {
  return (
    <Stack className="brand" {...props} as={Link} href="/">
      {/* <Image
        src="/images/logo-96.png"
        alt="BAOOStore JSC logo"
        width={32}
        height={32}
      /> */}
      <span style={{ marginLeft: 14 }}>BAOOStore JSC</span>
    </Stack>
  );
};

export default Brand;
