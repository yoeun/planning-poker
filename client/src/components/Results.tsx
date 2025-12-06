import { useState, useEffect } from 'react';
import { getGravatarUrl } from '../utils/gravatar';

interface User {
  name: string;
  email: string;
  joinedAt: number;
}

interface ResultsProps {
  users: Record<string, User>;
  choices: Record<string, string>;
  currentUserId: string;
  onMakeChoice: (choice: string) => void;
  pointOptions: string[];
}

export default function Results({
  users,
  choices,
  currentUserId,
  onMakeChoice,
  pointOptions,
}: ResultsProps) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    // Reset reveal state when choices change
    setRevealed(new Set());
    setAllRevealed(false);

    // Animate reveal with staggered timing
    const userIds = Object.keys(choices);
    if (userIds.length === 0) return;

    const revealInterval = setInterval(() => {
      setRevealed((prev) => {
        const next = new Set(prev);
        const unrevealed = userIds.find((id) => !next.has(id));
        if (unrevealed) {
          next.add(unrevealed);
          return next;
        } else {
          setAllRevealed(true);
          clearInterval(revealInterval);
          return next;
        }
      });
    }, 150);

    return () => clearInterval(revealInterval);
  }, [choices]);

  const userList = Object.entries(users).sort((a, b) => a[1].joinedAt - b[1].joinedAt);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Results</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {userList.map(([userId, user], index) => {
          const choice = choices[userId];
          const isRevealed = revealed.has(userId) || allRevealed;
          const isCurrentUser = userId === currentUserId;

          return (
            <div
              key={userId}
              className={`
                relative rounded-xl border-2 p-4 transition-all duration-500
                ${isCurrentUser
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-200'
                }
                ${isRevealed ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-3'}
              `}
              style={{
                transitionDelay: isRevealed ? '0ms' : `${index * 150}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getGravatarUrl(user.email, 40)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {user.name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-blue-600">(You)</span>
                    )}
                  </div>
                </div>
              </div>
              <div
                className={`
                  text-center py-4 rounded-lg font-bold text-2xl transition-all
                  ${isRevealed
                    ? 'bg-white border-2 border-gray-300 shadow-md'
                    : 'bg-gray-200 border-2 border-gray-400'
                  }
                `}
              >
                {isRevealed ? choice || '—' : '?'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Change Your Choice</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {pointOptions.map((option) => {
            const isSelected = choices[currentUserId] === option;
            return (
              <button
                key={option}
                onClick={() => onMakeChoice(option)}
                className={`
                  aspect-square rounded-xl border-2 transition-all transform hover:scale-105
                  ${isSelected
                    ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md'
                  }
                  font-bold text-lg
                `}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

