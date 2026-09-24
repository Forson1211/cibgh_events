import React from 'react';
import { cn } from '../../lib/utils';
import { EventStatus, AttendanceType } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'red' | 'charcoal' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'green',
  size = 'md',
  className,
}) => {
  const variantStyles = {
    green: 'bg-cib-green-50 text-cib-green-800 border-cib-green-200/60',
    gold: 'bg-cib-gold-50 text-cib-gold-700 border-cib-gold-200',
    red: 'bg-cib-red-50 text-cib-red-700 border-cib-red-200',
    charcoal: 'bg-cib-charcoal-100 text-cib-charcoal-800 border-cib-charcoal-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-cib-charcoal-700 border-slate-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export const EventStatusBadge: React.FC<{ status: EventStatus }> = ({ status }) => {
  switch (status) {
    case 'OPEN_FOR_REGISTRATION':
      return (
        <Badge variant="green">
          <span className="w-1.5 h-1.5 rounded-full bg-cib-green-600 animate-pulse"></span>
          Open for Registration
        </Badge>
      );
    case 'UPCOMING':
      return <Badge variant="gold">Upcoming</Badge>;
    case 'IN_PROGRESS':
      return (
        <Badge variant="gold">
          <span className="w-1.5 h-1.5 rounded-full bg-cib-gold-500 animate-ping"></span>
          In Progress
        </Badge>
      );
    case 'REGISTRATION_CLOSED':
      return <Badge variant="red">Registration Closed</Badge>;
    case 'COMPLETED':
      return <Badge variant="neutral">Completed</Badge>;
    case 'DRAFT':
      return <Badge variant="outline">Draft</Badge>;
    case 'CANCELLED':
      return <Badge variant="red">Cancelled</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const AttendanceTypeBadge: React.FC<{ type: AttendanceType }> = ({ type }) => {
  const labels = {
    PHYSICAL: 'In-Person',
    VIRTUAL: 'Virtual',
    HYBRID: 'Hybrid (In-Person & Online)',
  };
  return (
    <Badge variant="outline" size="sm" className="font-medium text-slate-600 bg-white">
      {labels[type] || type}
    </Badge>
  );
};
