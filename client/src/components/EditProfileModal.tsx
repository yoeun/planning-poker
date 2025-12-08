import { useState, useEffect } from 'react';
import Modal from './Modal';
import Checkmark from '../icons/Checkmark';
import CloseIcon from '../icons/CloseIcon';

// Predefined color palette (16 colors)
const COLOR_PALETTE = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#84CC16', // lime
  '#22C55E', // green
  '#10B981', // emerald
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#D946EF', // fuchsia
  '#EC4899', // pink
  '#F43F5E', // rose
];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  initialEmail: string;
  initialColor?: string;
  onSave: (name: string, email: string, color?: string) => void;
  error?: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialName,
  initialEmail,
  initialColor = '',
  onSave,
  error: externalError,
}: EditProfileModalProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [color, setColor] = useState(initialColor);
  const [error, setError] = useState('');

  // Update state when initial values change
  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
    setColor(initialColor || '');
  }, [initialName, initialEmail, initialColor]);

  // Update error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const handleClose = () => {
    setError('');
    // Reset to initial values
    setName(initialName);
    setEmail(initialEmail);
    setColor(initialColor || '');
    onClose();
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Normalize color: ensure it starts with # if provided
    let normalizedColor = color.trim();
    if (normalizedColor && !normalizedColor.startsWith('#')) {
      normalizedColor = '#' + normalizedColor;
    }

    // Validate hex color format if provided
    if (normalizedColor && normalizedColor !== '#') {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexRegex.test(normalizedColor)) {
        setError('Please enter a valid hex color code (e.g., #FF5733 or FF5733)');
        return;
      }
    }

    onSave(name.trim(), email.trim(), normalizedColor || undefined);
  };

  const displayError = error || externalError;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header showCloseButton={true} onClose={handleClose}>
        <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {displayError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {displayError}
            </div>
          )}
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="your.email@example.com"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Used for Gravatar avatar</p>
          </div>
          <div>
            <label htmlFor="edit-color" className="block text-sm font-medium text-gray-700 mb-2">
              Color (optional)
            </label>
            <div className="space-y-3">
              <div className="grid grid-cols-8 gap-2">
                {COLOR_PALETTE.map((paletteColor) => {
                  const isSelected = color && color.replace('#', '').toUpperCase() === paletteColor.replace('#', '').toUpperCase();
                  return (
                    <button
                      key={paletteColor}
                      type="button"
                      onClick={() => {
                        setColor(paletteColor);
                        setError('');
                      }}
                      className={`
                        w-10 h-10 rounded-lg border-2 transition-all hover:scale-110
                        ${isSelected ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300 hover:border-gray-400'}
                      `}
                      style={{ backgroundColor: paletteColor }}
                      title={paletteColor}
                    >
                      {isSelected && (
                        <Checkmark className="w-5 h-5 mx-auto text-white drop-shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-color"
                  type="text"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
                  placeholder="#FF5733 or FF5733"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave();
                    }
                  }}
                />
                {(() => {
                  const normalizedColor = color.trim();
                  if (!normalizedColor) return null;
                  const colorWithHash = normalizedColor.startsWith('#') ? normalizedColor : '#' + normalizedColor;
                  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                  const isValid = hexRegex.test(colorWithHash);
                  return (
                    <div
                      className={`w-10 h-10 rounded-lg border-2 flex-shrink-0 ${
                        isValid ? 'border-gray-300' : 'border-red-300'
                      }`}
                      style={{ backgroundColor: isValid ? colorWithHash : 'transparent' }}
                      title={isValid ? 'Preview' : 'Invalid color'}
                    >
                      {!isValid && normalizedColor && (
                        <CloseIcon className="w-5 h-5 mx-auto mt-2 text-red-400" strokeWidth={2} />
                      )}
                    </div>
                  );
                })()}
              </div>
              <p className="text-xs text-gray-500">Choose a color from the grid or enter a custom hex code</p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Save
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

