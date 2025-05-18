import React, { memo, useEffect, useState } from "react";
import { IconButton } from "rsuite";
import ArrowUpLineIcon from "@rsuite/icons/ArrowUpLine";
import { scrollTo } from "@/utils/domUtil";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Add a scroll event listener to track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to scroll to the top when the button is clicked
  const scrollToTop = () => {
    scrollTo(0);
  };

  return (
    <IconButton
      className={`scroll-to-top-button ${isVisible ? "show" : ""}`}
      circle
      size="lg"
      icon={<ArrowUpLineIcon />}
      onClick={scrollToTop}
    />
  );
};

export default memo(ScrollToTopButton);
