
import React from "react";
import { History, Music } from "lucide-react";
import type { ConvertedSong } from "@/services/converterService";

interface ConversionHistoryProps {
  recentConversions: ConvertedSong[];
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  onSelectFromHistory: (song: ConvertedSong) => void;
}

const ConversionHistory: React.FC<ConversionHistoryProps> = ({
  recentConversions,
  showHistory,
  setShowHistory,
  onSelectFromHistory
}) => {
  return (
    <div className="pt-2">
      <button 
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center text-sm text-gray-400 hover:text-converter-green transition-colors"
      >
        <History size={16} className="mr-1" /> 
        {showHistory ? "Hide history" : "Show conversion history"}
      </button>
      
      {showHistory && recentConversions.length > 0 && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-converter-green scrollbar-track-black/20 pr-1">
          {recentConversions.map((song) => (
            <div 
              key={song.id}
              className="flex items-center p-2 rounded bg-black/30 hover:bg-black/40 cursor-pointer border border-converter-green/10 transition-colors"
              onClick={() => onSelectFromHistory(song)}
            >
              <Music size={18} className="mr-2 text-converter-green" />
              <div className="overflow-hidden">
                <p className="text-sm text-white truncate">{song.title || "Unknown track"}</p>
                <p className="text-xs text-gray-500 truncate">{new Date(song.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversionHistory;
