export default function getVideoUrl() {
  return `/api/proxy_video?ts=${Date.now()}`;
}
