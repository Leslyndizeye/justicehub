import { useEffect, useRef, useState } from 'react';

/** Pace incoming tokens for a smooth reveal; historical messages show immediately. */
export function useProgressiveText(text: string, animate: boolean) {
  const [visible, setVisible] = useState(animate ? '' : text);
  const count = useRef(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      count.current = text.length;
      setVisible(text);
      return;
    }
    if (count.current > text.length) count.current = text.length;
    let frame: number;
    let last = performance.now();
    const reveal = (now: number) => {
      const remaining = text.length - count.current;
      const speed = Math.max(0.18, remaining / 700);
      const step = Math.max(1, Math.floor(Math.min(now - last, 80) * speed));
      let next = Math.min(text.length, count.current + step);
      // Do not split a UTF-16 surrogate pair (for example an emoji).
      if (next < text.length && /[\uD800-\uDBFF]/.test(text[next - 1])) next++;
      count.current = next;
      setVisible(text.slice(0, next));
      last = now;
      if (next < text.length) frame = requestAnimationFrame(reveal);
    };
    frame = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frame);
  }, [text, animate]);

  return animate ? visible : text;
}
