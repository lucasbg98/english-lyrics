const CORS_PROXIES = [
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url: string) => `https://proxy.cors.sh/${url}`,
];

export async function searchYoutubeVideo(
  trackName: string,
  artistName: string
): Promise<string | null> {
  const query = encodeURIComponent(`${trackName} ${artistName}`);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;

  for (const buildProxy of CORS_PROXIES) {
    try {
      const proxyUrl = buildProxy(youtubeUrl);
      const res = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(10000),
        headers: { 'Accept': 'text/html' },
      });
      if (!res.ok) continue;
      const html = await res.text();
      const videoId = extractVideoId(html);
      if (videoId) return videoId;
    } catch {
      continue;
    }
  }

  return null;
}

function extractVideoId(html: string): string | null {
  const decoded = html.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );

  const match = decoded.match(/"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/);
  return match ? match[1] : null;
}

export function buildEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
