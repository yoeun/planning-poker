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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function UserList({
  users,
  currentUserId,
  onEditProfile,
  isCollapsed: externalCollapsed,
  onToggleCollapse,
}: UserListProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setIsCollapsed = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  // Sort users: current user first, then others by join time
  const userList = Object.entries(users).sort((a, b) => {
    if (a[0] === currentUserId) return -1;
    if (b[0] === currentUserId) return 1;
    return a[1].joinedAt - b[1].joinedAt;
  });

  const participantCount = userList.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      {!isCollapsed && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Participants ({participantCount})
          </h3>
          <button
            onClick={setIsCollapsed}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Collapse participants list"
          >
            <svg
              className="w-5 h-5 transition-transform rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
      
      {isCollapsed ? (
        <>
          {/* Mobile: Single row of avatars with toggle button */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Participants ({participantCount})
              </h3>
              <button
                onClick={setIsCollapsed}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Expand participants list"
              >
                <svg
                  className="w-5 h-5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {userList.map(([userId, user]) => {
                const isCurrentUser = userId === currentUserId;
                return (
                  <div key={userId} className="relative">
                    <img
                      src={getGravatarUrl(user.email, 40)}
                      alt={user.name}
                      className={`
                        w-10 h-10 rounded-full border-2
                        ${isCurrentUser ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                      `}
                      title={user.name + (isCurrentUser ? ' (You)' : '')}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: Vertical list of avatars with toggle button */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <button
              onClick={setIsCollapsed}
              className="text-gray-500 hover:text-gray-700 transition-colors mb-1"
              title="Expand participants list"
            >
              <svg
                className="w-5 h-5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {userList.map(([userId, user]) => {
              const isCurrentUser = userId === currentUserId;
              return (
                <div key={userId} className="relative">
                  <img
                    src={getGravatarUrl(user.email, 40)}
                    alt={user.name}
                    className={`
                      w-10 h-10 rounded-full border-2
                      ${isCurrentUser ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                    `}
                    title={user.name + (isCurrentUser ? ' (You)' : '')}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {userList.map(([userId, user]) => {
            const isCurrentUser = userId === currentUserId;
            
            return (
              <div
                key={userId}
                className={`
                  flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
              >
                <img
                  src={getGravatarUrl(user.email, 40)}
                  alt={user.name}
                  className={`
                    w-10 h-10 rounded-full border-2 flex-shrink-0
                    ${isCurrentUser ? 'border-blue-500' : 'border-gray-200'}
                  `}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-blue-600">(You)</span>
                    )}
                  </div>
                  {user.email && (
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  )}
                </div>
                {isCurrentUser && (
                  <button
                    onClick={onEditProfile}
                    className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors flex-shrink-0"
                    title="Edit your profile"
                  >
                    Edit
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

