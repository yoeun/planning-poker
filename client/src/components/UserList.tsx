import { useState } from 'react';
import { getGravatarUrl } from '../utils/gravatar';

interface User {
  name: string;
  email: string;
  joinedAt: number;
}

interface UserListProps {
  users: Record<string, User>;
  currentUserId: string;
  onEditProfile: () => void;
}

export default function UserList({
  users,
  currentUserId,
  onEditProfile,
}: UserListProps) {
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);

  // Sort users: current user first, then others by join time
  const userList = Object.entries(users).sort((a, b) => {
    if (a[0] === currentUserId) return -1;
    if (b[0] === currentUserId) return 1;
    return a[1].joinedAt - b[1].joinedAt;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <div className="flex flex-wrap gap-3 justify-center">
        {userList.map(([userId, user]) => {
          const isCurrentUser = userId === currentUserId;
          const isHovered = hoveredUserId === userId;
          
          return (
            <div
              key={userId}
              className="relative"
              onMouseEnter={() => setHoveredUserId(userId)}
              onMouseLeave={() => setHoveredUserId(null)}
            >
              <button
                onClick={isCurrentUser ? onEditProfile : undefined}
                className={`
                  relative w-12 h-12 rounded-full border-2 transition-all
                  ${isCurrentUser 
                    ? 'border-blue-500 hover:border-blue-600 hover:scale-110 cursor-pointer ring-2 ring-blue-200' 
                    : 'border-white hover:scale-110 cursor-default'
                  }
                  ${isHovered ? 'z-10' : ''}
                `}
                title={isCurrentUser ? 'Click to edit your profile' : undefined}
              >
                <img
                  src={getGravatarUrl(user.email, 48)}
                  alt={user.name}
                  className="w-full h-full rounded-full"
                />
                {isCurrentUser && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </button>
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-20">
                  <div className="font-medium">{user.name}</div>
                  {user.email && (
                    <div className="text-xs text-gray-300 mt-1">{user.email}</div>
                  )}
                  {isCurrentUser && (
                    <div className="text-xs text-blue-300 mt-1">(You - Click to edit)</div>
                  )}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

