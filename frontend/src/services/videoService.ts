const PROXY_URL = '/api/proxy'; // This will be handled by our backend

export async function extractVideoStream(url: string): Promise<string> {
  try {
    // First, we need to fetch the page content
    const response = await fetch(url, {
      credentials: 'include', // Include cookies for authentication
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.france.tv/',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const html = await response.text();

    // Look for the video stream URL in the page
    const pageContent = html.toLowerCase();
    
    // Look for HLS stream URL with the specific pattern
    const hlsMatch = pageContent.match(/(https:\/\/live-event\.ftven\.fr\/[^"'\s]+\.m3u8)/);
    if (hlsMatch) {
      // Proxy the stream URL through our backend
      return `${PROXY_URL}?url=${encodeURIComponent(hlsMatch[1])}`;
    }

    // Look for DASH stream URL
    const dashMatch = pageContent.match(/(https:\/\/live-event\.ftven\.fr\/[^"'\s]+\.mpd)/);
    if (dashMatch) {
      // Proxy the stream URL through our backend
      return `${PROXY_URL}?url=${encodeURIComponent(dashMatch[1])}`;
    }

    throw new Error('No video stream found');
  } catch (error) {
    console.error('Error extracting video stream:', error);
    throw error;
  }
}

// Helper function to extract video URL from network requests
export function extractVideoUrlFromNetwork(url: string): string | null {
  if (url.includes('live-event.ftven.fr')) {
    if (url.includes('.m3u8')) {
      return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    }
    if (url.includes('.mpd')) {
      return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    }
    if (url.includes('.ts')) {
      return `${PROXY_URL}?url=${encodeURIComponent(url)}`;
    }
  }
  return null;
} 