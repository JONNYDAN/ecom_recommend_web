import React from "react";
import { Breadcrumb as RBreadcrumb } from "rsuite";
import NavLink from "./NavLink";
import useLocale from "@/hooks/useLocale";
import { localeItems } from "@/config/localeConfig";

export const breadcrumbItems = {
  home: "home",
  courses: "courses",
  posts: "posts",
  products: "products",
};

function Breadcrumb({ items = [], itemClassName = "", as = NavLink }) {
  const { t: tHeader } = useLocale(localeItems.header);
  console.log("Breadcrumb -> items", items);
  return (
    <RBreadcrumb>
      {items.length > 0 &&
        items.map(({ url, name, isActive }, index) => (
          <RBreadcrumb.Item
            key={index}
            className={itemClassName}
            href={url}
            active={isActive}
            as={as}
          >
            {tHeader(name)}
          </RBreadcrumb.Item>
        ))}
    </RBreadcrumb>
  );
}

export default React.memo(Breadcrumb);
