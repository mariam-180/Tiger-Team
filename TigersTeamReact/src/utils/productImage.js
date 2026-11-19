export function getProductImageUrl(imageUrl, fallbackImage) {
  if (!imageUrl) return fallbackImage;

  let normalizedUrl = imageUrl;
  if (/^https?:\/\//i.test(normalizedUrl)) {
    try {
      normalizedUrl = new URL(normalizedUrl).pathname;
    } catch (error) {
      return fallbackImage;
    }
  }

  if (normalizedUrl.startsWith('static/')) {
    normalizedUrl = `/${normalizedUrl}`;
  }
  normalizedUrl = normalizedUrl.replace(/^\/static\/static\//, '/static/');

  return normalizedUrl.startsWith('/') ? normalizedUrl : fallbackImage;
}
