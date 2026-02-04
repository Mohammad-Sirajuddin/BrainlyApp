import { AddContentDialog } from "./AddContentDialog";

interface CreateContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContentAdded: () => void;
  showAlert?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export function CreateContentDialog({
  isOpen,
  onClose,
  onContentAdded,
  showAlert,
}: CreateContentDialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close dialog when clicking on the backdrop (not the dialog itself)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-800/60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="relative">
        <AddContentDialog 
          onClose={onClose} 
          onContentAdded={onContentAdded}
          showAlert={showAlert}
        />
      </div>
    </div>
  );
}
