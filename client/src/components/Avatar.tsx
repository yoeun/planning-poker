import { useState } from 'react';
import { getGravatarUrl } from '../utils/gravatar';
import { getInitials } from '../utils/initials';

interface AvatarProps {
  name: string;
  email: string;
  userId: string;
  size?: number;
  className?: string;
  title?: string;
  borderClass?: string;
  ringClass?: string;
  style?: React.CSSProperties;
}

export default function Avatar({ 
  name, 
  email, 
  userId,
  size = 40, 
  className = '', 
  title,
  borderClass = '',
  ringClass = '',
  style = {}
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const initials = getInitials(name);
  const gravatarUrl = getGravatarUrl(email, size);
  
  // Check if email is empty or invalid - show initials immediately
  const shouldShowInitials = !email || !email.trim() || imageError;
  
  // Generate a background color based on userId (for consistency across sessions)
  const getBackgroundColor = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
  };

  const bgColor = getBackgroundColor(userId);
  const combinedClassName = `rounded-full border-2 flex items-center justify-center text-white font-semibold transition-all ${borderClass} ${ringClass} ${className}`.trim();

  if (shouldShowInitials) {
    return (
      <div
        className={combinedClassName}
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor,
          fontSize: size * 0.4,
          ...style,
        }}
        title={title || name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size, ...style }}>
      <img
        src={gravatarUrl}
        alt={name}
        className={`rounded-full border-2 transition-all ${borderClass} ${ringClass} ${className}`.trim()}
        style={{ width: size, height: size }}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        title={title || name}
      />
      {!imageLoaded && !imageError && (
        <div
          className={`absolute inset-0 rounded-full flex items-center justify-center text-white font-semibold border-2 ${borderClass}`}
          style={{
            backgroundColor: bgColor,
            fontSize: size * 0.4,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

