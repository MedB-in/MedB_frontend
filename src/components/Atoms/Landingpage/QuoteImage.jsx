import React from "react";

const QuoteImage = ({ src, className, alt }) => {
  return <img src={src} className={className} alt={alt} loading="lazy" />;
};

export default QuoteImage;
