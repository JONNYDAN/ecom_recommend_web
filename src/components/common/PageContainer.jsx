import React, { memo } from "react";
import MetaData from "../shared/MetaData";
import clsx from "clsx";
import { isEqual } from "lodash-es";

function PageContainer({ metaData, className, children }) {
  return (
    <>
      <MetaData {...metaData} />
      <main className={clsx("page-container", className)}>{children}</main>
    </>
  );
}

export default memo(PageContainer, isEqual);
