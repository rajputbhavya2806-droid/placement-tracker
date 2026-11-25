import React from 'react';
import { getInitials } from '../../utils/formatters';

export function CompanyAvatar({ name, initials, brandColor = 'from-indigo-600 to-blue-600', size = 'md' }) {
  const sizes = {
    sm: 'h-9 w-9 text-xs rounded-xl',
    md: 'h-11 w-11 text-sm rounded-xl',
    lg: 'h-14 w-14 text-base rounded-2xl',
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br font-bold text-white shadow-sm ${brandColor} ${sizes[size] || sizes.md}`}
    >
      {initials || getInitials(name)}
    </div>
  );
}

