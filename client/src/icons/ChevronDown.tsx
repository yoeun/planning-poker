interface ChevronDownProps {
  className?: string;
  strokeWidth?: number;
}

export default function ChevronDown({ className = 'w-5 h-5', strokeWidth = 2 }: ChevronDownProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

