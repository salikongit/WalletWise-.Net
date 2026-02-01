const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded-lg mb-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-danger-600 hover:text-danger-800 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;




