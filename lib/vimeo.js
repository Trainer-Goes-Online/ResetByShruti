/* ============================================================================
   VIMEO — server-side thumbnail fetch (SERVER ONLY)
   ----------------------------------------------------------------------------
   The hero VSL is a click-to-load facade: we show the video's OWN Vimeo
   thumbnail with our branded play button and NO Vimeo chrome, then swap in the
   real player (with controls) only on click. To render the thumbnail without
   loading the Vimeo player, we resolve its image URL via Vimeo's public oEmbed
   endpoint at build/request time (cached a day). Public/unlisted videos work;
   if the fetch fails the facade falls back to a plain branded poster.
   ========================================================================== */

/** Extract the numeric video id from a player or canonical Vimeo URL. */
export function vimeoId(url) {
  if (!url) return null;
  const m = url.match(/\/video\/(\d+)/) || url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

/** Resolve the Vimeo thumbnail image URL, or null on any failure. */
export async function getVimeoPoster(url) {
  const id = vimeoId(url);
  if (!id) return null;
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}`)}&width=1280`,
      { next: { revalidate: 86400 } },   // cache the poster for a day
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.thumbnail_url || null;
  } catch {
    return null;
  }
}
