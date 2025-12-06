interface VotingCardsProps {
  choices: Record<string, string>;
  currentUserId: string;
  currentUserChoice: string | undefined;
  allChosen: boolean;
  totalUsers: number;
  onMakeChoice: (choice: string) => void;
  onReveal: () => void;
  pointOptions: string[];
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
}: VotingCardsProps) {
  const hasChosen = currentUserChoice !== undefined;
  const chosenCount = Object.keys(choices).filter(uid => choices[uid] !== undefined).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Estimate</h2>
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
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {pointOptions.map((option) => {
          const isSelected = currentUserChoice === option;
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
    </div>
  );
}

