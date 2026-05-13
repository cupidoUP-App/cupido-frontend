import React from 'react';
import { Button } from '@ui/button';
import { TrashIcon, CheckIcon, ArrowRightIcon } from '@radix-ui/react-icons';

/** Propiedades del componente ActionButtons. */
interface ActionButtonsProps {
  /** Indica si hay archivos disponibles para las acciones. */
  hasFiles: boolean;
  /** Callback para guardar las fotos. */
  onSave: () => void;
  /** Callback para eliminar todas las fotos. */
  onDeleteAll: () => void;
  /** Callback para continuar al siguiente paso. */
  onContinue: () => void;
  /** Indica si actualmente se está guardando. */
  isSaving: boolean;
}

/**
 * Componente de botones de acción para la gestión de fotos.
 * Proporciona botones para eliminar todo, guardar y continuar,
 * inhabilitándolos según el estado de carga y disponibilidad de archivos.
 */

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
