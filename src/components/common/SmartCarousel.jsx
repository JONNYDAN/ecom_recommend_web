import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Carousel, IconButton } from "rsuite";
import { useScreenSize } from "@/contexts/ScreenSizeContext";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";

// number of card items in each slide
const defaultConfig = {
  xs: 1,
  sm: 2,
  md: 3,
};

function SmartCarousel({
  cardItems = [],
  className = "",
  config = defaultConfig,
  carouselProps = {},
  children,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardList = useMemo(() => {
    if (children instanceof Array) {
      return children;
    }
    return cardItems || [];
  }, [children, cardItems]);

  const screenSize = useScreenSize();

  // base on screen size and the configuration, render the number of each items in each slide
  const carouselSetItems = useMemo(() => {
    const carouselConfig = { ...defaultConfig, ...config };
    let maxLength = carouselConfig.md;

    if (screenSize.isSmallerThan.sm) {
      maxLength = carouselConfig.xs;
    } else if (screenSize.isSmallerThan.md) {
      maxLength = carouselConfig.sm;
    }

    const items = [];
    let i = 0;
    let count = 0;

    while (i < cardList.length) {
      const setItems = [];
      for (let j = 0; j < maxLength && i < cardList.length; j++) {
        setItems.push(cardList[i++]);
      }

      const carouselElement = (
        <div
          key={count++}
          className="review-set-items d-flex justify-content-center gap-5"
        >
          {setItems}
        </div>
      );

      items.push(carouselElement);
    }

    return items;
  }, [
    cardList,
    screenSize.isSmallerThan.md,
    screenSize.isSmallerThan.sm,
    config,
  ]);

  useEffect(() => {
    // back to the first slide when breakpoint was changed
    setActiveIndex(0);
  }, [screenSize.breakpoint]);

  const goNext = () => {
    const max = carouselSetItems.length;
    setActiveIndex((v) => (v + 1) % max);
  };
  const goPrev = () => {
    const max = carouselSetItems.length;
    setActiveIndex((v) => (v + max - 1) % max);
  };

  return (
    <div className={className}>
      <div className="custom-carousel-container container">
        <Carousel
          className="bg-transparent"
          activeIndex={activeIndex}
          onSelect={(index) => {
            setActiveIndex(index);
          }}
          shape="bar"
          {...carouselProps}
        >
          {carouselSetItems}
        </Carousel>

        {carouselSetItems.length > 1 && (
          <>
            <IconButton
              className="carousel-action-button"
              circle
              icon={<ArrowLeftLineIcon />}
              onClick={goPrev}
            />
            <IconButton
              className="carousel-action-button right"
              circle
              icon={<ArrowRightLineIcon />}
              onClick={goNext}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default SmartCarousel;
