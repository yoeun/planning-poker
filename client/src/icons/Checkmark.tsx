interface CheckmarkProps {
  className?: string;
  strokeWidth?: number;
}

export default function Checkmark({ className = 'w-5 h-5', strokeWidth = 3 }: CheckmarkProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M5 13l4 4L19 7" />
    </svg>
  );
}

