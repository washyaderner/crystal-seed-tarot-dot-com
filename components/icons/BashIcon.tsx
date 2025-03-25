import React from 'react';

interface BashIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const BashIcon: React.FC<BashIconProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Circle background */}
      <circle cx="12" cy="12" r="10" fill="none" />
      
      {/* B shape */}
      <path d="M9 8h4a2 2 0 0 1 0 4H9" strokeWidth="2" />
      <path d="M9 12h5a2 2 0 0 1 0 4H9V8" strokeWidth="2" />
    </svg>
  );
};

export default BashIcon; 