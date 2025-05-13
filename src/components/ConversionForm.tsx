
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { extractVideoId, checkExistingSong, convertYoutubeUrl } from "@/services/converterService";
import type { ConvertedSong } from "@/services/converterService";

interface ConversionFormProps {
  onConversionSuccess: (mtaUrl: string, newSong: ConvertedSong) => void;
  recentConversions: ConvertedSong[];
}

const ConversionForm: React.FC<ConversionFormProps> = ({ onConversionSuccess, recentConversions }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    setIsConverting(true);
    
    // Validate URL
    const videoId = extractVideoId(youtubeUrl);
    
    if (!videoId) {
      toast.error("Please enter a valid YouTube URL");
      setIsConverting(false);
      return;
    }

    try {
      // Check if this song is already in history
      const existingConversion = recentConversions.find(song => 
        song.url.includes(videoId)
      );

      if (existingConversion) {
        onConversionSuccess(existingConversion.url, existingConversion);
        toast.success("Found in your history!");
        setIsConverting(false);
        return;
      }

      // Check if the song is already converted on server
      const checkData = await checkExistingSong(youtubeUrl);

      if (checkData.exists && checkData.song) {
        const convertedSong = checkData.song;
        
        const newSong: ConvertedSong = {
          id: convertedSong.id,
          title: convertedSong.title,
          url: convertedSong.streamUrl,
          createdAt: new Date().toISOString()
        };
        
        onConversionSuccess(convertedSong.streamUrl, newSong);
        toast.success("Found on server!");
        setIsConverting(false);
        return;
      }

      // Song doesn't exist, convert it
      toast.info("Converting your track...", { duration: 5000 });
      
      const data = await convertYoutubeUrl(youtubeUrl);
      
      // Create new song entry
      const newSong: ConvertedSong = {
        id: data.song.id,
        title: data.song.title,
        url: data.song.streamUrl,
        createdAt: new Date().toISOString()
      };
      
      onConversionSuccess(data.song.streamUrl, newSong);
      toast.success("Successfully converted!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to convert YouTube URL");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="youtube-url" className="text-sm font-medium text-gray-300">
          YouTube URL
        </label>
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          className="border-converter-green/30 focus:ring-converter-green focus:border-converter-green bg-black/20 text-white"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          disabled={isConverting}
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleConvert}
          className="bg-converter-green hover:bg-converter-dark-green text-black font-medium transition-all transform active:scale-95 w-[150px]"
          disabled={isConverting || !youtubeUrl}
        >
          {isConverting ? (
            <span className="flex items-center animate-pulse-green">Converting...</span>
          ) : (
            <span className="flex items-center">
              Convert <ArrowRight size={16} className="ml-2" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConversionForm;
