import React, { memo, useEffect, useState } from "react";
import Image from "next/image";

function SafeImage({ src, width, height, alt, placeholderSrc, ...props }) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleImageError = () => {
    setImageSrc(placeholderSrc || "/images/placeholder-img.jpg");
  };

  useEffect(() => {
    // update src when prop is updated
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      width={width}
      height={height}
      alt={alt}
      {...props}
      onError={handleImageError}
    />
  );
}

export default memo(SafeImage);
