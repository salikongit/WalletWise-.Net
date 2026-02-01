const SuccessMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-success-50 border border-success-200 text-success-800 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-success-600 hover:text-success-800 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;




