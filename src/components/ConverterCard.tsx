
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LinkIcon, ArrowRight } from "lucide-react";

const ConverterCard = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [mtaUrl, setMtaUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  // Function to extract YouTube video ID
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleConvert = () => {
    setIsConverting(true);
    
    // Validate the URL
    const videoId = extractVideoId(youtubeUrl);
    
    if (!videoId) {
      toast.error("Please enter a valid YouTube URL");
      setIsConverting(false);
      return;
    }

    // Simulate a processing delay for better UX
    setTimeout(() => {
      // Create MTA:SA stereo link format: mtasa://127.0.0.1?audio=https://www.youtube.com/watch?v=[VIDEO_ID]
      const mtaLink = `mtasa://127.0.0.1?audio=https://www.youtube.com/watch?v=${videoId}`;
      setMtaUrl(mtaLink);
      setIsConverting(false);
      toast.success("Successfully converted!");
    }, 800);
  };

  const handleCopyLink = () => {
    if (mtaUrl) {
      navigator.clipboard.writeText(mtaUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-converter-green/20 bg-white/70 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-converter-green to-converter-dark-green bg-clip-text text-transparent">
          YouTube → MTA:SA Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="youtube-url" className="text-sm font-medium text-gray-700">
            YouTube URL
          </label>
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="border-converter-green/30 focus:ring-converter-green focus:border-converter-green"
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

        {mtaUrl && (
          <div className="pt-2 animate-slide-up">
            <div className="space-y-2">
              <label htmlFor="mta-url" className="text-sm font-medium text-gray-700">
                MTA:SA Stereo Link
              </label>
              <div className="relative">
                <Input
                  id="mta-url"
                  value={mtaUrl}
                  readOnly
                  className="pr-10 bg-converter-green/10 border-converter-green/30"
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-converter-dark-green transition-colors"
                  onClick={handleCopyLink}
                  title="Copy to clipboard"
                >
                  <LinkIcon size={18} />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Paste this link in your MTA:SA client to play this track.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConverterCard;
