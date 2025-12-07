import { useMemo } from 'react';
import Avatar from './Avatar';

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
  onReset?: () => void;
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
  onReset,
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

  // Find the option with the most votes (only when revealed)
  const mostVotedOption = useMemo(() => {
    if (!revealed) return '';
    
    let maxVotes = 0;
    let mostVoted = '';
    
    pointOptions.forEach(option => {
      const voteCount = (usersByChoice[option] || []).length;
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        mostVoted = option;
      }
    });
    
    // Return the most voted option if it has at least one vote
    return maxVotes > 0 ? mostVoted : '';
  }, [usersByChoice, pointOptions, revealed]);

  const isUserChoiceDifferent = currentUserChoice && currentUserChoice !== mostVotedOption;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {revealed ? 'Results' : 'Select Your Estimate'}
        </h2>
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
                    ? 'bg-green-600 border-green-700 text-white shadow-lg scale-105'
                    : revealed && shouldHighlightYellow
                    ? 'bg-yellow-100 border-yellow-400 text-gray-900 shadow-md scale-105'
                    : revealed && voteCount === 0
                    ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                    : isSelected && !revealed
                    ? 'bg-blue-600 border-blue-700 text-white shadow-lg scale-105'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:shadow-md'
                  }
                  font-bold text-2xl
                `}
              >
                {option}
              </button>
              
              {/* Vote count - only show after reveal */}
              {revealed && voteCount > 0 && (
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
                      <Avatar
                        key={userId}
                        name={user.name}
                        email={user.email}
                        userId={userId}
                        size={32}
                        borderClass={isCurrentUser ? 'border-blue-500' : 'border-white'}
                        ringClass={isCurrentUser ? 'ring-2 ring-blue-200' : ''}
                        className="shadow-sm"
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

      {revealed && onReset && (
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={onReset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

