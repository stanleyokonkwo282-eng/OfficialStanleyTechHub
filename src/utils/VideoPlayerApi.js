function getYouTubeId(url, title) {
  if (!url) return null;
  try {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
  } catch {
    // ignore
  }
  return null;
}

function getVimeoId(url) {
  if (!url) return null;
  try {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

function isDirectVideo(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function getVideoProvider(url) {
  if (getYouTubeId(url)) return "youtube";
  if (getVimeoId(url)) return "vimeo";
  if (isDirectVideo(url)) return "direct";
  return "unknown";
}

export { getYouTubeId, getVimeoId, isDirectVideo, getVideoProvider };
export default { getYouTubeId, getVimeoId, isDirectVideo, getVideoProvider };
