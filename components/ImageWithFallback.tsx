
import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithFallback: React.FC<Props> = ({ src, alt, className = "" }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-slate-200 flex items-center justify-center overflow-hidden ${className}`}>
        <span className="text-slate-400 text-xs">Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};
