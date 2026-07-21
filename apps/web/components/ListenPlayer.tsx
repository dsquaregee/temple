'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  formatTime,
  stepIndex,
  type ListenItem,
  type Locale,
  type UiStrings,
} from '@temple/core';

// The Listen tab as an in-place player. The narrated temples become a playlist:
// tapping one starts playback in a sticky "now playing" bar without leaving the
// tab, and prev/next step through the set (wrapping, auto-advancing on end).
//
// Progressive enhancement: every row is a real link to the temple story, so
// no-JS clients and crawlers still reach the full page (and its prose, the
// accessible transcript). The play button is a separate control that only does
// anything once this hydrates — it never replaces the link.
export function ListenPlayer({
  locale,
  ui,
  ready,
  upcoming,
}: {
  locale: Locale;
  ui: UiStrings;
  ready: ListenItem[];
  upcoming: ListenItem[];
}) {
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Whether the pending source change should auto-play (a user gesture just
  // selected a track), versus a passive load.
  const autoPlay = useRef(false);

  const current = index == null ? null : ready[index] ?? null;

  const select = useCallback((i: number) => {
    autoPlay.current = true;
    setElapsed(0);
    setDuration(0);
    setIndex(i);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => {
        if (i == null) return i;
        autoPlay.current = true;
        setElapsed(0);
        setDuration(0);
        return stepIndex(i, delta, ready.length);
      });
    },
    [ready.length],
  );

  // When the selected track changes, (re)load the element and play if the
  // change came from a user gesture.
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !current) return;
    el.load();
    if (autoPlay.current) {
      autoPlay.current = false;
      el.play().catch(() => setPlaying(false));
    }
    // Keying on the track id: a new source needs a fresh load/play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  }, []);

  const onSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const to = Number(e.target.value);
    el.currentTime = to;
    setElapsed(to);
  }, []);

  const templeHref = (id: string) => `/${locale}/temples/${id}/`;
  const isCurrent = (i: number) => index === i;

  return (
    <>
      <div className="grid">
        {ready.map((tp, i) => (
          <div key={tp.id} className={`card${isCurrent(i) ? ' is-playing' : ''}`}>
            <div className="listenrow">
              <a className="listenrow__main" href={templeHref(tp.id)}>
                <h2>{tp.name}</h2>
                <div className="native">{tp.nativeName}</div>
              </a>
              <button
                type="button"
                className="badge ready playbtn"
                aria-label={`${isCurrent(i) && playing ? ui.listen.pause : ui.listen.play}: ${tp.name}`}
                aria-pressed={isCurrent(i) && playing}
                onClick={() => (isCurrent(i) ? toggle() : select(i))}
              >
                {isCurrent(i) && playing ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        ))}

        {upcoming.map((tp) => (
          <a key={tp.id} className="card" href={templeHref(tp.id)}>
            <div className="listenrow">
              <div className="listenrow__main">
                <h2>{tp.name}</h2>
                <div className="native">{tp.nativeName}</div>
              </div>
              <span className="badge" aria-hidden="true">
                ···
              </span>
            </div>
          </a>
        ))}
      </div>

      {current && (
        <>
          {/* Keeps the last row clear of the fixed bar. */}
          <div className="listenbar-spacer" aria-hidden="true" />
          <div className="listenbar" role="region" aria-label={ui.listen.nowPlaying}>
            <div className="listenbar__inner">
              <div className="listenbar__title">
                <div className="k">{ui.listen.nowPlaying}</div>
                <div className="n">
                  {current.name}
                  <span className="native"> · {current.nativeName}</span>
                </div>
              </div>

              <div className="listenbar__controls">
                <button
                  type="button"
                  className="tbtn"
                  aria-label={ui.listen.previous}
                  onClick={() => step(-1)}
                  disabled={ready.length < 2}
                >
                  ⏮
                </button>
                <button
                  type="button"
                  className="tbtn tbtn--play"
                  aria-label={playing ? ui.listen.pause : ui.listen.play}
                  aria-pressed={playing}
                  onClick={toggle}
                >
                  {playing ? '⏸' : '▶'}
                </button>
                <button
                  type="button"
                  className="tbtn"
                  aria-label={ui.listen.next}
                  onClick={() => step(1)}
                  disabled={ready.length < 2}
                >
                  ⏭
                </button>
              </div>

              <div className="listenbar__seek">
                <span className="listenbar__time">{formatTime(elapsed)}</span>
                <input
                  type="range"
                  min={0}
                  max={Number.isFinite(duration) && duration > 0 ? duration : 0}
                  step={1}
                  value={Math.min(elapsed, duration || 0)}
                  onChange={onSeek}
                  aria-label={ui.listen.nowPlaying}
                />
                <span className="listenbar__time">{formatTime(duration)}</span>
              </div>

              <a className="listenbar__link" href={templeHref(current.id)}>
                {ui.listen.readStory}
              </a>
            </div>

            <audio
              ref={audioRef}
              preload="none"
              src={current.audio?.storyUrl}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onEnded={() => step(1)}
            />
          </div>
        </>
      )}
    </>
  );
}
