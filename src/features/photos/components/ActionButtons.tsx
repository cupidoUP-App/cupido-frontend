import React from 'react';
import { Button } from '@/components/ui/button'; // Shadcn/ui button
import { TrashIcon, CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons';

interface ActionButtonsProps {
  hasFiles: boolean;
  onSave: () => void;
  onDeleteAll: () => void;
  onContinue: () => void;
  isSaving: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  hasFiles,
  onSave,
  onDeleteAll,
  onContinue,
  isSaving,
}) => {
  return (
    <div className="flex justify-end space-x-4 mt-8">
      <Button
        variant="outline"
        onClick={onDeleteAll}
        disabled={!hasFiles || isSaving}
        className="flex items-center gap-2"
      >
        <TrashIcon className="h-4 w-4" />
        delete all
      </Button>
      <Button
        onClick={onSave}
        disabled={!hasFiles || isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? 'saving...' : 'save'}
        {isSaving ? null : <CheckIcon className="h-4 w-4" />} 
      </Button>
      <Button
        onClick={onContinue}
        disabled={!hasFiles || isSaving} // Assuming continue requires at least one file
        className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
      >
        continue
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionButtons;
