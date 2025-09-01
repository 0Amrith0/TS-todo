import React from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md" }) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-spinner ${sizeClass}`} />;
};

export default LoadingSpinner;