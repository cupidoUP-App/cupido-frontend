import React from "react";
import { Dialog, DialogContent } from "@ui/dialog";

interface MatchOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MatchOptionsDialog: React.FC<MatchOptionsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-lg p-0 w-[300px] overflow-hidden ">
        <div className="flex flex-col w-full pt-8">
          <button
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all hover:scale-105 hover:font-medium"
          >
            Bloquear
          </button>
          <div className="flex justify-center w-full">
            <div className="w-[95%] h-[1px] bg-black/20"></div>
          </div>
          <button
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all hover:scale-105 hover:font-medium"
          >
            Bloquear y reportar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchOptionsDialog;
