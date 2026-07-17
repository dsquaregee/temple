import type { Temple, UiStrings } from '@temple/core';

// Narrated-video card on a temple page: the temple's story told over real
// photographs. Renders only when the temple has a video — unlike audio there
// is no "coming soon" state, since video is supplementary to the narrated
// audio and page prose. preload="none" + poster keeps it off the critical
// path (the poster is the already-cached hero photo).
export function VideoStory({ temple, ui }: { temple: Temple; ui: UiStrings }) {
  if (!temple.video) return null;
  return (
    <div className="callout video">
      <div className="k">▶ {ui.labels.videoStory}</div>
      <video
        className="video__player"
        controls
        preload="none"
        playsInline
        poster={temple.video.posterUrl}
        src={temple.video.url}
      />
      {temple.video.credit && <div className="n">{temple.video.credit}</div>}
    </div>
  );
}
