import { useMemo } from 'react';
import { getGravatarUrl } from '../utils/gravatar';

interface User {
  name: string;
  email: string;
  joinedAt: number;
}

interface VotingCardsProps {
  choices: Record<string, string>;
  currentUserId: string;
  currentUserChoice: string | undefined;
  allChosen: boolean;
  totalUsers: number;
  onMakeChoice: (choice: string) => void;
  onReveal: () => void;
  pointOptions: string[];
  users?: Record<string, User>;
  revealed?: boolean;
}

export default function VotingCards({
  choices,
  currentUserId,
  currentUserChoice,
  allChosen,
  totalUsers,
  onMakeChoice,
  onReveal,
  pointOptions,
  users,
  revealed = false,
}: VotingCardsProps) {
  const hasChosen = currentUserChoice !== undefined;
  const chosenCount = Object.keys(choices).filter(uid => choices[uid] !== undefined).length;

  // Group users by their choice
  const usersByChoice = useMemo(() => {
    const grouped: Record<string, Array<[string, User]>> = {};
    
    // Initialize all point options
    pointOptions.forEach(option => {
      grouped[option] = [];
    });
    
    // Group users by their choice (works even if users not provided, just counts choices)
    if (users) {
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
    } else {
      // If users not provided, just count choices
      Object.entries(choices).forEach(([userId, choice]) => {
        if (choice && grouped[choice]) {
          grouped[choice].push([userId, {} as User]);
        }
      });
    }
    
    return grouped;
  }, [users, choices, pointOptions]);

  // Find the option with the most votes and check if it has majority (only when revealed)
  const mostVotedOption = useMemo(() => {
    if (!revealed) return '';
    
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
  }, [usersByChoice, pointOptions, revealed]);

  const isUserChoiceDifferent = currentUserChoice && currentUserChoice !== mostVotedOption;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {revealed ? 'Results' : 'Select Your Estimate'}
        </h2>
        {!revealed && (
          <>
            <p className="text-gray-600 text-sm">
              {hasChosen ? (
                <span className="text-green-600 font-medium">✓ You've made your choice</span>
              ) : (
                'Choose a point value below'
              )}
            </p>
            {!allChosen && (
              <p className="text-gray-500 text-xs mt-1">
                {chosenCount} of {totalUsers} participants have chosen
              </p>
            )}
          </>
        )}
        {revealed && (
          <p className="text-gray-600 text-sm">
            Results are revealed. You can change your choice below.
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {pointOptions.map((option) => {
          const isSelected = currentUserChoice === option;
          const usersForChoice = usersByChoice[option] || [];
          const voteCount = usersForChoice.length;
          const isMostVoted = revealed && option === mostVotedOption;
          const shouldHighlightYellow = revealed && isSelected && isUserChoiceDifferent;

          return (
            <div key={option} className="flex flex-col items-center gap-2">
              <button
                onClick={() => onMakeChoice(option)}
                className={`
                  w-full aspect-square rounded-xl border-2 transition-all transform hover:scale-105
                  ${revealed && isMostVoted
                    ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105'
                    : revealed && shouldHighlightYellow
                    ? 'bg-yellow-100 border-yellow-400 text-gray-900 shadow-md scale-105'
                    : revealed && voteCount === 0
                    ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                    : isSelected && !revealed
                    ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md'
                  }
                  font-bold text-lg
                `}
              >
                {option}
              </button>
              
              {/* Vote count */}
              {voteCount > 0 && (
                <div className="text-xs font-semibold text-gray-600">
                  {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                </div>
              )}
              
              {/* Avatar column - only show when revealed, hidden on mobile */}
              {revealed && (
                <div className="hidden md:flex flex-col items-center gap-1.5 min-h-[40px] w-full">
                  {usersForChoice.map(([userId, user]) => {
                    const isCurrentUser = userId === currentUserId;
                    return (
                      <img
                        key={userId}
                        src={getGravatarUrl(user.email, 32)}
                        alt={user.name}
                        className={`
                          w-8 h-8 rounded-full border-2 shadow-sm transition-all
                          ${isCurrentUser
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-white'
                          }
                        `}
                        title={user.name + (isCurrentUser ? ' (You)' : '')}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!revealed && (
        <div className="pt-6 border-t border-gray-200">
          {allChosen ? (
            <p className="text-gray-600 text-sm mb-4 text-center">
              All participants have made their choices!
            </p>
          ) : (
            <p className="text-amber-600 text-sm mb-4 text-center">
              {chosenCount} of {totalUsers} participants have chosen. You can reveal choices manually.
            </p>
          )}
          <button
            onClick={onReveal}
            className={`w-full font-semibold py-3 px-4 rounded-lg shadow-md transition ${
              allChosen
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            Reveal All Choices
          </button>
        </div>
      )}
    </div>
  );
}

