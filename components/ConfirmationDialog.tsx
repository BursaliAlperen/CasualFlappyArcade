import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 font-arcade"
      onClick={onClose} // Close on backdrop click
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-sm text-center border-2 border-yellow-400"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <h3 className="text-2xl text-yellow-300 mb-4">{title}</h3>
        <div className="text-slate-200 mb-6">{children}</div>
        <div className="flex justify-around gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border-b-4 border-gray-800 hover:bg-gray-700 transition-all transform hover:scale-105 active:border-b-0 active:translate-y-1"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-cyan-500 text-slate-900 rounded-lg border-b-4 border-cyan-700 hover:bg-cyan-600 transition-all transform hover:scale-105 active:border-b-0 active:translate-y-1"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
