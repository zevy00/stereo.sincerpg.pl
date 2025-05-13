
import React from "react";
import { Input } from "@/components/ui/input";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ConversionResultProps {
  mtaUrl: string;
}

const ConversionResult: React.FC<ConversionResultProps> = ({ mtaUrl }) => {
  if (!mtaUrl) return null;

  const handleCopyLink = () => {
    if (mtaUrl) {
      navigator.clipboard.writeText(mtaUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div className="pt-2 animate-slide-up">
      <div className="space-y-2">
        <label htmlFor="mta-url" className="text-sm font-medium text-gray-300">
          MTA:SA Stereo Link
        </label>
        <div className="relative">
          <Input
            id="mta-url"
            value={mtaUrl}
            readOnly
            className="pr-10 bg-black/10 border-converter-green/30 text-white"
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-converter-green transition-colors"
            onClick={handleCopyLink}
            title="Copy to clipboard"
          >
            <LinkIcon size={18} />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Copy this link and use it with playSound() in MTA:SA.
      </p>
    </div>
  );
};

export default ConversionResult;
