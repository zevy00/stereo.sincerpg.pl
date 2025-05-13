
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/services/converterService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Play } from "lucide-react";

const ApiDocs = () => {
  return (
    <div className="min-h-screen w-full converter-container flex flex-col items-center p-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mr-4 border-converter-green/30 text-converter-green hover:bg-converter-green/10">
              <ArrowLeft size={16} className="mr-2" /> Back to Converter
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-converter-green to-converter-light-green bg-clip-text text-transparent font-['Roboto_Condensed']">
            API Documentation
          </h1>
        </div>

        <Card className="mb-6 border-converter-green/20 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-converter-green">Overview</CardTitle>
            <CardDescription>
              This API allows you to convert YouTube videos into streamable audio format compatible with MTA:SA's playSound function.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white mb-2">Base URL</h3>
                <code className="bg-black/30 p-2 rounded block text-white">{API_URL}</code>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Authentication</h3>
                <p className="text-gray-300">No authentication is required to use this API.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="check" className="w-full">
          <TabsList className="mb-4 bg-black/30 border border-converter-green/10">
            <TabsTrigger value="check">Check Endpoint</TabsTrigger>
            <TabsTrigger value="convert">Convert Endpoint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="check">
            <Card className="border-converter-green/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center">
                  <CheckCircle size={18} className="text-converter-green mr-2" />
                  <CardTitle className="text-xl text-white">Check Endpoint</CardTitle>
                </div>
                <CardDescription>
                  Check if a YouTube video has already been converted
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">URL</h3>
                  <code className="bg-black/30 p-2 rounded block text-white">GET {API_URL}/check?url=YOUTUBE_URL</code>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Parameters</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-converter-green/20">
                        <th className="text-left py-2 px-1 text-converter-green">Name</th>
                        <th className="text-left py-2 px-1 text-converter-green">Type</th>
                        <th className="text-left py-2 px-1 text-converter-green">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-1 text-white">url</td>
                        <td className="py-2 px-1 text-gray-400">string</td>
                        <td className="py-2 px-1 text-gray-300">The YouTube URL to check</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Response Format</h3>
                  <pre className="bg-black/30 p-3 rounded text-gray-200 text-sm overflow-auto">
{`{
  "exists": true,
  "song": {
    "id": "unique-song-id",
    "title": "Song Title",
    "streamUrl": "http://${window.location.hostname}/stream/unique-song-id"
  }
}`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Example Request</h3>
                  <code className="bg-black/30 p-2 rounded block text-white text-sm overflow-auto mb-2">GET {API_URL}/check?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
                
                  <h3 className="font-medium text-white mb-2 mt-4">Example Response</h3>
                  <pre className="bg-black/30 p-3 rounded text-gray-200 text-sm overflow-auto">
{`{
  "exists": true,
  "song": {
    "id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "streamUrl": "http://${window.location.hostname}/stream/dQw4w9WgXcQ"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="convert">
            <Card className="border-converter-green/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center">
                  <Play size={18} className="text-converter-green mr-2" />
                  <CardTitle className="text-xl text-white">Convert Endpoint</CardTitle>
                </div>
                <CardDescription>
                  Convert a YouTube video to MTA:SA compatible format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">URL</h3>
                  <code className="bg-black/30 p-2 rounded block text-white">POST {API_URL}/convert</code>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Request Body</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-converter-green/20">
                        <th className="text-left py-2 px-1 text-converter-green">Name</th>
                        <th className="text-left py-2 px-1 text-converter-green">Type</th>
                        <th className="text-left py-2 px-1 text-converter-green">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-1 text-white">url</td>
                        <td className="py-2 px-1 text-gray-400">string</td>
                        <td className="py-2 px-1 text-gray-300">The YouTube URL to convert</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Response Format</h3>
                  <pre className="bg-black/30 p-3 rounded text-gray-200 text-sm overflow-auto">
{`{
  "success": true,
  "song": {
    "id": "unique-song-id",
    "title": "Song Title",
    "streamUrl": "http://${window.location.hostname}/stream/unique-song-id"
  }
}`}
                  </pre>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Example Request</h3>
                  <pre className="bg-black/30 p-3 rounded text-gray-200 text-sm overflow-auto mb-2">
{`POST ${API_URL}/convert
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}`}
                  </pre>
                
                  <h3 className="font-medium text-white mb-2 mt-4">Example Response</h3>
                  <pre className="bg-black/30 p-3 rounded text-gray-200 text-sm overflow-auto">
{`{
  "success": true,
  "song": {
    "id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up",
    "streamUrl": "http://${window.location.hostname}/stream/dQw4w9WgXcQ"
  }
}`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-2">MTA:SA Usage</h3>
                  <pre className="bg-black/30 p-3 rounded text-gray-200 text-sm overflow-auto">
{`-- In MTA:SA Script
local sound = playSound("http://${window.location.hostname}/stream/dQw4w9WgXcQ")
if sound then
    setSoundVolume(sound, 1.0) -- Set volume
end`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Created for easy integration with MTA:SA scripting.</p>
        </footer>
      </div>
    </div>
  );
};

export default ApiDocs;
