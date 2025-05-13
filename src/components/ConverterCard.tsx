
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConvertedSong, loadConversionHistory, saveConversionHistory } from "@/services/converterService";
import ConversionForm from "./ConversionForm";
import ConversionResult from "./ConversionResult";
import ConversionHistory from "./ConversionHistory";
import { toast } from "sonner";

const ConverterCard = () => {
  const [mtaUrl, setMtaUrl] = useState("");
  const [recentConversions, setRecentConversions] = useState<ConvertedSong[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load conversion history from localStorage on initialization
  useEffect(() => {
    const savedHistory = loadConversionHistory();
    if (savedHistory.length > 0) {
      setRecentConversions(savedHistory);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    saveConversionHistory(recentConversions);
  }, [recentConversions]);

  const handleConversionSuccess = (url: string, newSong: ConvertedSong) => {
    setMtaUrl(url);
    setRecentConversions(prev => [newSong, ...prev.slice(0, 9)]);
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
        <ConversionForm 
          onConversionSuccess={handleConversionSuccess}
          recentConversions={recentConversions}
        />

        {mtaUrl && <ConversionResult mtaUrl={mtaUrl} />}

        <ConversionHistory 
          recentConversions={recentConversions}
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          onSelectFromHistory={selectFromHistory}
        />
      </CardContent>
    </Card>
  );
};

export default ConverterCard;
