import Modal from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonStyle?: 'default' | 'danger';
  showCloseButton?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonStyle = 'default',
  showCloseButton = false,
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmButtonClass =
    confirmButtonStyle === 'danger'
      ? 'flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition'
      : 'flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header showCloseButton={showCloseButton} onClose={onClose}>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </Modal.Header>
      <Modal.Body>
        <p className="text-gray-600">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
          >
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={confirmButtonClass}>
            {confirmText}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

