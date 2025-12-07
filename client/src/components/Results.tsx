import { useState, useEffect, useMemo } from 'react';
import Avatar from './Avatar';

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

  // Group users by their choice
  const usersByChoice = useMemo(() => {
    const grouped: Record<string, Array<[string, User]>> = {};
    
    // Initialize all point options
    pointOptions.forEach(option => {
      grouped[option] = [];
    });
    
    // Group users by their choice
    Object.entries(users).forEach(([userId, user]) => {
      const choice = choices[userId];
      if (choice && grouped[choice]) {
        grouped[choice].push([userId, user]);
      }
    });
    
    // Sort users within each group by join time
    Object.keys(grouped).forEach(choice => {
      grouped[choice].sort((a, b) => a[1].joinedAt - b[1].joinedAt);
    });
    
    return grouped;
  }, [users, choices, pointOptions]);

  // Find the option with the most votes and check if it has majority
  const mostVotedOption = useMemo(() => {
    let maxVotes = 0;
    let mostVoted = '';
    let totalVotes = 0;
    
    pointOptions.forEach(option => {
      const voteCount = (usersByChoice[option] || []).length;
      totalVotes += voteCount;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        mostVoted = option;
      }
    });
    
    // Only return the most voted option if it has majority (more than 50%)
    if (maxVotes > 0 && totalVotes > 0 && maxVotes > totalVotes / 2) {
      return mostVoted;
    }
    
    return '';
  }, [usersByChoice, pointOptions]);

  const currentUserChoice = choices[currentUserId];
  const isUserChoiceDifferent = currentUserChoice && currentUserChoice !== mostVotedOption;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Results</h2>

      {/* Point cards with avatars below */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {pointOptions.map((option) => {
          const usersForChoice = usersByChoice[option] || [];
          const voteCount = usersForChoice.length;
          const isMostVoted = option === mostVotedOption;
          const isUserChoice = option === currentUserChoice;
          const shouldHighlightYellow = isUserChoice && isUserChoiceDifferent;

          return (
            <div
              key={option}
              className="flex flex-col items-center gap-3"
            >
              {/* Point Card */}
              <div
                className={`
                  aspect-square w-20 rounded-xl border-2 transition-all transform
                  flex items-center justify-center font-bold text-2xl
                  ${isMostVoted
                    ? 'bg-green-600 border-green-700 text-white shadow-lg scale-105'
                    : shouldHighlightYellow
                    ? 'bg-yellow-100 border-yellow-400 text-gray-900 shadow-md scale-105'
                    : voteCount > 0
                    ? 'bg-green-50 border-green-300 text-gray-900 shadow-md'
                    : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                  }
                `}
              >
                {option}
              </div>

              {/* Vote count badge */}
              {voteCount > 0 && (
                <div className="text-xs font-semibold text-gray-600">
                  {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                </div>
              )}

              {/* Avatar column - hidden on mobile */}
              <div className="hidden md:flex flex-col items-center gap-2 min-h-[60px]">
                {usersForChoice.map(([userId, user], index) => {
                  const isRevealed = revealed.has(userId) || allRevealed;
                  const isCurrentUser = userId === currentUserId;

                  return (
                    <div
                      key={userId}
                      className={`
                        transition-all duration-300
                        ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                      `}
                      style={{
                        transitionDelay: isRevealed ? '0ms' : `${index * 150}ms`,
                      }}
                      title={user.name + (isCurrentUser ? ' (You)' : '')}
                    >
                      <Avatar
                        name={user.name}
                        email={user.email}
                        size={40}
                        borderClass={isCurrentUser ? 'border-blue-500' : 'border-white'}
                        ringClass={isCurrentUser ? 'ring-2 ring-blue-200' : ''}
                        className="shadow-sm hover:scale-110"
                      />
                    </div>
                  );
                })}
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

