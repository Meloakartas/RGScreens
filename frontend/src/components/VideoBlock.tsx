import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractVideoStream } from '@/services/videoService';
import Hls from 'hls.js';

interface VideoBlockProps {
  id: number;
}

export function VideoBlock({ id }: VideoBlockProps) {
  const [url, setUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  const handleStart = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Extract the video stream URL
      const streamUrl = await extractVideoStream(url);

      if (!videoRef.current) return;

      // Cleanup previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Initialize HLS
      if (Hls.isSupported()) {
        hlsRef.current = new Hls({
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.withCredentials = true; // Include cookies
          },
          debug: false,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Network error:', data);
                hlsRef.current?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Media error:', data);
                hlsRef.current?.recoverMediaError();
                break;
              default:
                console.error('Fatal error:', data);
                hlsRef.current?.destroy();
                break;
            }
          }
        });

        hlsRef.current.loadSource(streamUrl);
        hlsRef.current.attachMedia(videoRef.current);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(console.error);
          setIsPlaying(true);
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // For Safari
        videoRef.current.src = streamUrl;
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        throw new Error('HLS is not supported in your browser');
      }
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
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            playsInline
          />
        </div>
      )}
    </div>
  );
} 