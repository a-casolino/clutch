import React from 'react';

function ClutchSvg({
  src,
  ...props
}, ref) {
  if (React.isValidElement(src)) {
    return React.cloneElement(src, { ...props, ref });
  }

  return null;
}

export default React.forwardRef(ClutchSvg);