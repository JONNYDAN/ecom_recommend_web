import React, { createContext, useContext, useState, useEffect } from "react";

const ScreenSizeContext = createContext();

export const useScreenSize = () => {
  return useContext(ScreenSizeContext);
};

const breakpoints = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600,
};

export const ScreenSizeProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    breakpoint: "xs",
    isIdentified: false,
    isXs: true,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
    isGreaterThan: {},
    isSmallerThan: {
      xs: true,
      sm: true,
      md: true,
      lg: true,
      xl: true,
    },
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let currentBreakpoint = "xs";
      let isGreaterThan = {};
      let isSmallerThan = {};

      Object.keys(breakpoints).forEach((breakpoint) => {
        if (width >= breakpoints[breakpoint]) {
          currentBreakpoint = breakpoint;
        }

        isGreaterThan[breakpoint] = width >= breakpoints[breakpoint];
        isSmallerThan[breakpoint] = width <= breakpoints[breakpoint];
      });

      setScreenSize({
        width,
        breakpoint: currentBreakpoint,
        isIdentified: true,
        isXs: currentBreakpoint === "xs",
        isSm: currentBreakpoint === "sm",
        isMd: currentBreakpoint === "md",
        isLg: currentBreakpoint === "lg",
        isXl: currentBreakpoint === "xl",
        isGreaterThan,
        isSmallerThan,
        isMobile: isSmallerThan.md,
        isDesktop: isGreaterThan.lg,
      });
    };

    handleResize(); // Call the function immediately to set the initial screen size

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ScreenSizeContext.Provider value={screenSize}>
      {children}
    </ScreenSizeContext.Provider>
  );
};
