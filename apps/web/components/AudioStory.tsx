import type { Temple, UiStrings } from '@temple/core';

function minutes(sec: number): string {
  const m = Math.round(sec / 60);
  return `${m} min`;
}

// Narrated-story card on a temple page. When the temple has audio it renders a
// native player; otherwise it shows the "coming soon" state. Either way the
// full prose on the page is the transcript / accessible alternative, satisfying
// the "audio alternative for every long-form text" accessibility rule.
export function AudioStory({ temple, ui }: { temple: Temple; ui: UiStrings }) {
  if (!temple.audio) {
    return (
      <div className="callout">
        <div className="k">♪ {ui.tabs.listen}</div>
        <div className="n">{ui.labels.listenComingSoon}</div>
      </div>
    );
  }
  return (
    <div className="callout audio">
      <div className="k">♪ {ui.tabs.listen}</div>
      <audio
        className="audio__player"
        controls
        preload="none"
        src={temple.audio.storyUrl}
      >
        {ui.labels.listenComingSoon}
      </audio>
      <div className="n">{minutes(temple.audio.durationSec)}</div>
    </div>
  );
}
