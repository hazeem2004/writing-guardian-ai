import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextInput = ({ value, onChange, placeholder }: TextInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="text-input" className="text-sm font-medium">
        Input Text
      </Label>
      <Textarea
        id="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Paste your text here to analyze..."}
        className="min-h-[300px] resize-none font-mono text-sm transition-all focus:ring-2 focus:ring-primary"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{value.length} characters</span>
        <span>{value.split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
};
