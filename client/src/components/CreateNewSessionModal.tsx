import Modal from './Modal';

interface CreateNewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEndSessionAndCreateNew: () => void;
  onKeepSessionAndCreateNew: () => void;
}

export default function CreateNewSessionModal({
  isOpen,
  onClose,
  onEndSessionAndCreateNew,
  onKeepSessionAndCreateNew,
}: CreateNewSessionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header showCloseButton={true} onClose={onClose}>
        <h3 className="text-xl font-bold text-gray-900">Create New Session</h3>
      </Modal.Header>
      <Modal.Body>
        <p className="text-gray-600">
          Would you like to end the current session? Ending it will disconnect all other participants.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-col gap-3">
          <button
            onClick={onEndSessionAndCreateNew}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Yes
          </button>
          <button
            onClick={onKeepSessionAndCreateNew}
            className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
          >
            No, keep current session
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

