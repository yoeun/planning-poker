interface CloseIconProps {
  className?: string;
  strokeWidth?: number;
}

export default function CloseIcon({ className = 'w-6 h-6', strokeWidth = 2 }: CloseIconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

