import { useState } from 'react';
import Avatar from './Avatar';

interface User {
  name: string;
  email: string;
  color?: string;
  joinedAt: number;
}

interface UserListProps {
  users: Record<string, User>;
  currentUserId: string;
  onEditProfile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  choices?: Record<string, string>;
  allChosen?: boolean;
  revealed?: boolean;
}

export default function UserList({
  users,
  currentUserId,
  onEditProfile,
  isCollapsed: externalCollapsed,
  onToggleCollapse,
  choices = {},
  allChosen = false,
  revealed = false,
}: UserListProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setIsCollapsed = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  // Sort users: current user first, then others alphabetically by name
  const userList = Object.entries(users).sort((a, b) => {
    if (a[0] === currentUserId) return -1;
    if (b[0] === currentUserId) return 1;
    return a[1].name.localeCompare(b[1].name);
  });

  const participantCount = userList.length;

  // Determine voting status
  const votingHasBegun = Object.keys(choices).some(uid => choices[uid] !== undefined);
  const votingHasEnded = allChosen || revealed;

  // Helper function to get user styling
  const getUserStyling = (userId: string) => {
    const isCurrentUser = userId === currentUserId;
    const hasVoted = choices[userId] !== undefined;
    
    // Determine opacity
    let opacity = 1;
    if (!votingHasEnded && votingHasBegun) {
      opacity = hasVoted ? 1 : 0.5;
    }
    
    // Determine border color
    // Green border takes precedence for voted users during active voting
    let borderClass = 'border-gray-200';
    if (hasVoted && !votingHasEnded && votingHasBegun) {
      borderClass = 'border-green-500';
    } else if (isCurrentUser && (!votingHasBegun || votingHasEnded)) {
      // Blue border for current user only when not in active voting state
      borderClass = 'border-blue-500';
    }
    
    return { opacity, borderClass, hasVoted, isCurrentUser };
  };

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
                const { opacity, borderClass, hasVoted, isCurrentUser } = getUserStyling(userId);
                return (
                  <div key={userId} className="relative">
                    <Avatar
                      name={user.name}
                      email={user.email}
                      userId={userId}
                      color={user.color}
                      size={40}
                      borderClass={borderClass}
                      ringClass={isCurrentUser ? 'ring-2 ring-blue-200' : ''}
                      style={{ opacity }}
                      title={user.name + (isCurrentUser ? ' (You)' : '') + (hasVoted ? ' ✓ Voted' : '')}
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
              const { opacity, borderClass, hasVoted, isCurrentUser } = getUserStyling(userId);
              return (
                <div key={userId} className="relative">
                  <Avatar
                    name={user.name}
                    email={user.email}
                    userId={userId}
                    size={40}
                    borderClass={borderClass}
                    ringClass={isCurrentUser ? 'ring-2 ring-blue-200' : ''}
                    style={{ opacity }}
                    title={user.name + (isCurrentUser ? ' (You)' : '') + (hasVoted ? ' ✓ Voted' : '')}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {userList.map(([userId, user]) => {
            const { opacity, borderClass, isCurrentUser } = getUserStyling(userId);
            
            return (
              <div
                key={userId}
                className={`
                  flex items-center gap-3 p-2 rounded-lg transition-colors
                  ${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
                style={{ opacity }}
              >
                <Avatar
                  name={user.name}
                  email={user.email}
                  userId={userId}
                  color={user.color}
                  size={40}
                  borderClass={borderClass}
                  className="flex-shrink-0"
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

