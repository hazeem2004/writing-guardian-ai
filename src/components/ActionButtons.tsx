import { Button } from "@/components/ui/button";
import { Wand2, Search, Eraser } from "lucide-react";

interface ActionButtonsProps {
  onHumanize: () => void;
  onDetect: () => void;
  onRemove: () => void;
  disabled?: boolean;
}

export const ActionButtons = ({ onHumanize, onDetect, onRemove, disabled }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onHumanize}
        disabled={disabled}
        className="flex-1 min-w-[150px] bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        Humanize
      </Button>
      <Button
        onClick={onDetect}
        disabled={disabled}
        variant="outline"
        className="flex-1 min-w-[150px]"
      >
        <Search className="mr-2 h-4 w-4" />
        Detect Plagiarism
      </Button>
      <Button
        onClick={onRemove}
        disabled={disabled}
        variant="secondary"
        className="flex-1 min-w-[150px]"
      >
        <Eraser className="mr-2 h-4 w-4" />
        Remove Plagiarism
      </Button>
    </div>
  );
};
