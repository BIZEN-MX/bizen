import React from 'react';

interface BizcoinIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const BizcoinIcon: React.FC<BizcoinIconProps> = ({ size = 20, className, style }) => {
  return (
    <img 
      src="/bizcoin.png" 
      alt="bz" 
      width={size} 
      height={size} 
      className={className}
      style={{ 
        display: 'inline-block', 
        verticalAlign: 'middle', 
        objectFit: 'contain',
        flexShrink: 0,
        ...style 
      }} 
    />
  );
};

export default BizcoinIcon;
