import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LinkIcon, ArrowRight, Music, History } from "lucide-react";

// Adres API konwersji - zmień na swój adres serwera
const API_URL = "https://your-conversion-api.com/api";

interface ConvertedSong {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

const ConverterCard = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [mtaUrl, setMtaUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [recentConversions, setRecentConversions] = useState<ConvertedSong[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Funkcja do wyodrębniania identyfikatora filmu YouTube
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Załaduj historię konwersji z localStorage przy inicjalizacji
  React.useEffect(() => {
    const savedHistory = localStorage.getItem("mta_conversions");
    if (savedHistory) {
      try {
        setRecentConversions(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load conversion history", e);
      }
    }
  }, []);

  // Zapisz historię do localStorage przy każdej zmianie
  React.useEffect(() => {
    if (recentConversions.length > 0) {
      localStorage.setItem("mta_conversions", JSON.stringify(recentConversions));
    }
  }, [recentConversions]);

  const handleConvert = async () => {
    setIsConverting(true);
    
    // Walidacja URL
    const videoId = extractVideoId(youtubeUrl);
    
    if (!videoId) {
      toast.error("Please enter a valid YouTube URL");
      setIsConverting(false);
      return;
    }

    try {
      // Sprawdź, czy ta piosenka jest już w historii konwersji
      const existingConversion = recentConversions.find(song => 
        song.url.includes(videoId)
      );

      if (existingConversion) {
        // Piosenka już istnieje, użyj zapisanego URL
        setMtaUrl(existingConversion.url);
        toast.success("Found in your history!");
        setIsConverting(false);
        return;
      }

      // Najpierw sprawdź, czy utwór jest już skonwertowany na serwerze
      const checkResponse = await fetch(`${API_URL}/check?url=${encodeURIComponent(youtubeUrl)}`);
      const checkData = await checkResponse.json();

      if (checkData.exists && checkData.song) {
        // Piosenka już istnieje na serwerze, użyj jej
        const convertedSong = checkData.song;
        
        setMtaUrl(convertedSong.streamUrl);
        
        // Dodaj do historii konwersji
        const newSong: ConvertedSong = {
          id: convertedSong.id,
          title: convertedSong.title,
          url: convertedSong.streamUrl,
          createdAt: new Date().toISOString()
        };
        
        setRecentConversions(prev => [newSong, ...prev.slice(0, 9)]);
        toast.success("Found on server!");
        setIsConverting(false);
        return;
      }

      // Piosenka nie istnieje, skonwertuj ją
      toast.info("Converting your track...", { duration: 5000 });
      
      const response = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtubeUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Conversion failed");
      }

      const data = await response.json();
      
      // Ustaw nowy URL MTA:SA (bezpośredni link do pliku audio)
      setMtaUrl(data.song.streamUrl);
      
      // Dodaj do historii konwersji
      const newSong: ConvertedSong = {
        id: data.song.id,
        title: data.song.title,
        url: data.song.streamUrl,
        createdAt: new Date().toISOString()
      };
      
      setRecentConversions(prev => [newSong, ...prev.slice(0, 9)]);
      toast.success("Successfully converted!");
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to convert YouTube URL");
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyLink = () => {
    if (mtaUrl) {
      navigator.clipboard.writeText(mtaUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const selectFromHistory = (song: ConvertedSong) => {
    setMtaUrl(song.url);
    toast.success(`Loaded: ${song.title}`);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-converter-green/20 bg-black/40 backdrop-blur-sm">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-converter-green to-converter-light-green bg-clip-text text-transparent">
          YouTube → MTA:SA Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {mtaUrl && (
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
        )}

        {/* Historia konwersji */}
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
                  onClick={() => selectFromHistory(song)}
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
      </CardContent>
    </Card>
  );
};

export default ConverterCard;
