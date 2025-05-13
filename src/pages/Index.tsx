
import React from "react";
import ConverterCard from "@/components/ConverterCard";

const Index = () => {
  return (
    <div className="min-h-screen w-full converter-container flex flex-col items-center justify-center p-4">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-converter-green to-converter-light-green bg-clip-text text-transparent font-['Roboto_Condensed']">
          YT → MTA:SA Converter
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Convert YouTube music into MTA:SA stereo links
        </p>
      </header>
      
      <ConverterCard />
      
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Simply paste a YouTube URL and get a ready-to-use MTA:SA stereo link.</p>
      </footer>
    </div>
  );
};

export default Index;
