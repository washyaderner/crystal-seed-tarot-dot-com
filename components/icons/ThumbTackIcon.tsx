import React from 'react';

interface ThumbTackIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const ThumbTackIcon: React.FC<ThumbTackIconProps> = ({ className, ...props }) => {
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
      
      {/* T shape */}
      <path d="M8 8h8M12 8v8" strokeWidth="2.5" />
    </svg>
  );
};

export default ThumbTackIcon; 