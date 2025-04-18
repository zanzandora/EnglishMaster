import React from 'react';

export interface MobileCardField {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface ReusableMobileCardProps {
  avatar?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  fields: MobileCardField[];
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // Có thể mở rộng thêm props nếu cần
}

const ReusableMobileCard: React.FC<ReusableMobileCardProps> = ({
  avatar,
  title,
  subtitle,
  fields,
  actions,
  className = '',
  style,
}) => (
  <div
    className={`flex flex-col bg-white rounded-lg shadow p-4 mb-4 ${className}`}
    style={style}
  >
    <div className='flex items-center gap-4 mb-2'>
      {avatar && (
        <img
          src={avatar}
          alt=''
          width={48}
          height={48}
          className='w-12 h-12 rounded-full object-cover'
        />
      )}
      <div className='flex flex-col'>
        <h3 className='font-semibold text-base'>{title}</h3>
        {subtitle && <p className='text-xs text-gray-500'>{subtitle}</p>}
      </div>
    </div>
    <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mb-2'>
      {fields.map((field, idx) => (
        <div key={idx}>
          <span className='font-medium'>{field.label}: </span>
          {field.value}
        </div>
      ))}
    </div>
    {actions && <div className='flex items-center gap-2 mt-2'>{actions}</div>}
  </div>
);

export default ReusableMobileCard;
