
// API address
export const API_URL = "http://83.168.107.134:3001";

export interface ConvertedSong {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
}

// Function to extract YouTube video ID
export const extractVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Check if a song is already converted on the server
export const checkExistingSong = async (youtubeUrl: string) => {
  const response = await fetch(`${API_URL}/check?url=${encodeURIComponent(youtubeUrl)}`);
  return await response.json();
};

// Convert a YouTube URL to MTA:SA format
export const convertYoutubeUrl = async (youtubeUrl: string) => {
  const response = await fetch(`${API_URL}/convert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: youtubeUrl })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Conversion failed");
  }

  return await response.json();
};

// Local storage handling for conversion history
export const loadConversionHistory = (): ConvertedSong[] => {
  const savedHistory = localStorage.getItem("mta_conversions");
  if (savedHistory) {
    try {
      return JSON.parse(savedHistory);
    } catch (e) {
      console.error("Failed to load conversion history", e);
      return [];
    }
  }
  return [];
};

export const saveConversionHistory = (conversions: ConvertedSong[]) => {
  if (conversions.length > 0) {
    localStorage.setItem("mta_conversions", JSON.stringify(conversions));
  }
};
