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
  currentUserName: string;
  currentUserEmail: string;
  onUpdateUser: (name: string, email: string) => void;
}

export default function UserList({
  users,
  currentUserId,
  currentUserName,
  currentUserEmail,
  onUpdateUser,
}: UserListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUserName);
  const [email, setEmail] = useState(currentUserEmail);

  const handleSave = () => {
    onUpdateUser(name, email);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(currentUserName);
    setEmail(currentUserEmail);
    setIsEditing(false);
  };

  const userList = Object.entries(users).sort((a, b) => a[1].joinedAt - b[1].joinedAt);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Participants</h2>
      
      {isEditing ? (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="mb-4 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition"
        >
          Edit Your Profile
        </button>
      )}

      <div className="space-y-2">
        {userList.map(([userId, user]) => (
          <div
            key={userId}
            className={`flex items-center gap-3 p-3 rounded-lg border transition ${
              userId === currentUserId
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <img
              src={getGravatarUrl(user.email, 40)}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {user.name}
                {userId === currentUserId && (
                  <span className="ml-2 text-xs text-blue-600">(You)</span>
                )}
              </div>
              {user.email && (
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

