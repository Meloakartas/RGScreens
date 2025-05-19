import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractVideoStream } from '@/services/videoService';

interface VideoBlockProps {
  id: number;
}

export function VideoBlock({ }: VideoBlockProps) {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const streamUrl = await extractVideoStream(url);
      setVideoUrl(streamUrl);
      setIsPlaying(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start video');
      console.error('Error starting video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full border rounded-lg p-4 bg-background">
      {!isPlaying ? (
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter France TV URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button 
            onClick={handleStart}
            disabled={isLoading || !url}
          >
            {isLoading ? 'Loading...' : 'Start'}
          </Button>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      ) : (
        <div className="w-full h-full">
          <video
            className="w-full h-full"
            controls
            src={videoUrl}
            autoPlay
          />
        </div>
      )}
    </div>
  );
} 