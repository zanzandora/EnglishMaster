import React from 'react';
import { Tooltip, PlacesType, VariantType } from 'react-tooltip';

interface CustomTooltip {
  id?: string;
  anchorId: string;
  children: React.ReactNode;
  place?: PlacesType;
  className?: string;
  classNameArrow?: string;
  style?: React.CSSProperties;
  variant?: VariantType;
  float?: boolean;
  // Có thể mở rộng thêm các props khác nếu cần
}

const CustomTooltip: React.FC<CustomTooltip> = ({
  id,
  anchorId,
  children,
  place = 'top',
  className = 'z-[9999] ',
  classNameArrow,
  style = { fontSize: 13, lineHeight: 1.5 },
  variant = 'dark',
  float = false,
}) => {
  return (
    <Tooltip
      id={id}
      anchorId={anchorId}
      delayShow={100}
      float={float}
      delayHide={0}
      place={place}
      className={`custom-tooltip-grow ${className || ''}`}
      classNameArrow={classNameArrow}
      variant={variant}
      offset={20}
      style={style}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
