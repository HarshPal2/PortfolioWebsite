'use client';
// Swipeable project carousel for the reading version: arrows, dots and arrow keys.
import { Children, isValidElement, useCallback, useEffect, useRef, useState } from 'react';

export default function ProjectDeck({ children }) {
  const trackRef = useRef(null);
  const [cur, setCur] = useState(0);
  const count = Children.toArray(children).filter(isValidElement).length;

  const slides = () => (trackRef.current ? Array.from(trackRef.current.children) : []);

  const go = useCallback((i) => {
    const track = trackRef.current;
    const list = slides();
    if (!track || !list.length) return;
    i = Math.max(0, Math.min(list.length - 1, i));
    track.scrollTo({ left: list[i].offsetLeft - track.firstElementChild.offsetLeft, behavior: 'smooth' });
  }, []);

  const sync = useCallback(() => {
    const track = trackRef.current;
    const list = slides();
    if (!track || !list.length) return;
    let best = 0, d = 1e9;
    list.forEach((s, i) => {
      const k = Math.abs(s.offsetLeft - track.firstElementChild.offsetLeft - track.scrollLeft);
      if (k < d) { d = k; best = i; }
    });
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) best = list.length - 1;
    setCur(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const onScroll = () => window.requestAnimationFrame(sync);
    track.addEventListener('scroll', onScroll, { passive: true });
    sync();
    return () => track.removeEventListener('scroll', onScroll);
  }, [sync]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
  };

  return (
    <div className="deck" role="region" aria-roledescription="carousel" aria-label="Projects">
      <ul className="track" id="track" tabIndex="0" ref={trackRef} onKeyDown={onKeyDown}>
        {children}
      </ul>{' '}
      <div className="deck-ui">
        <button className="arrow" id="prev" type="button" aria-label="Previous project" disabled={cur === 0} onClick={() => go(cur - 1)}>
          ←
        </button>{' '}
        <div className="dots" id="dots" role="tablist" aria-label="Choose project">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} type="button" className="dot" role="tab" aria-label={`Project ${i + 1}`}
              aria-selected={i === cur ? 'true' : 'false'} onClick={() => go(i)} />
          ))}
        </div>{' '}
        <button className="arrow" id="next" type="button" aria-label="Next project" disabled={cur === count - 1} onClick={() => go(cur + 1)}>
          →
        </button>
      </div>
    </div>
  );
}
