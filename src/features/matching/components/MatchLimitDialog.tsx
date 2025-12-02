import React from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/shared/components/ui/dialog";

interface MatchLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timeUntilReset: string;
}

const MatchLimitDialog: React.FC<MatchLimitDialogProps> = ({
  open,
  onOpenChange,
  timeUntilReset,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-lg p-6 w-[350px] text-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">
            ¡Wow! Ya diste todos tus "Me Gusta" de hoy.
          </h2>
          <p className="text-gray-600">
            Vuelve a intentarlo en{" "}
            <span className="font-bold">{timeUntilReset}</span> y sigue
            conectando con nuevas personas. 💫
          </p>
          <DialogClose className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
            Entendido
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchLimitDialog;
