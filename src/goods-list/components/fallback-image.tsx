import React, { useState, useRef } from 'react';

const getSmallImageSrc = (src: string) => {
  let strArray = src.split('.');
  strArray[strArray.length - 2] += '_150x150';
  return strArray.join('.');
};

export default function ImgWithFallback({ src, style = {} }) {
  const Img = useRef<HTMLImageElement>(null);
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        ref={Img}
        style={style}
        src={getSmallImageSrc(src)}
        alt=""
        onError={() => {
          if (Img.current) {
            setImgError(true);
            Img.current.src = src;
          }
        }}
      />
    );
  } else {
    return (
      <img style={style} alt="" src={src} />
    );
  }
}
