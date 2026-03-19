"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
}

export default function ScreenshotGallery({ images, title }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemStrideRef = useRef(0);
  const n = images.length;

  // Triple the array so we can scroll infinitely in both directions
  const looped = [...images, ...images, ...images];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Measure exact positions at scrollLeft=0 (before we touch anything)
    const containerLeft = el.getBoundingClientRect().left;
    const copy2First = el.children[n] as HTMLElement;
    const copy2Second = el.children[n + 1] as HTMLElement;

    // singleSetWidth = scroll distance for one full copy of images
    const singleSetWidth =
      copy2First.getBoundingClientRect().left - containerLeft;
    // itemStride = scroll distance per image (width + gap)
    const itemStride =
      copy2Second.getBoundingClientRect().left -
      copy2First.getBoundingClientRect().left;
    itemStrideRef.current = itemStride;

    // Start in the middle copy
    el.scrollLeft = singleSetWidth;

    const onScroll = () => {
      // Seamless infinite reset — jump by exactly one set width
      if (el.scrollLeft >= singleSetWidth * 2) {
        el.scrollLeft -= singleSetWidth;
      } else if (el.scrollLeft < 50) {
        el.scrollLeft += singleSetWidth;
      }

      // Active dot index (0 to n-1)
      const offset = el.scrollLeft - singleSetWidth;
      const idx = ((Math.round(offset / itemStride) % n) + n) % n;
      setActiveIndex(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    // Mouse drag scroll (desktop equivalent of touch scroll)
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX;
      scrollStart = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollStart - (e.pageX - startX);
    };
    const onMouseUp = () => {
      isDown = false;
      el.style.cursor = "";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [n]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * itemStrideRef.current, behavior: "smooth" });
  };

  return (
    <div className="relative mb-16">
      {/* Desktop arrows */}
      <div className="hidden md:flex justify-between mb-3">
        <button
          onClick={() => scroll(-1)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Prev
        </button>
        <button
          onClick={() => scroll(1)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          Next
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll strip */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-3 cursor-grab"
      >
        {looped.map((src, i) => (
          <div
            key={i}
            className="relative flex-none snap-start overflow-hidden rounded-2xl border border-zinc-100 shadow-sm bg-zinc-50
                       w-full h-[calc(100svh-6rem)] md:h-auto md:w-56 md:aspect-9/19.5"
          >
            <Image
              src={src}
              alt={`${title} screenshot ${(i % n) + 1}`}
              fill
              className="object-cover object-top"
              sizes="(min-width: 768px) 210px, 100vw"
            />
          </div>
        ))}
      </div>

      {/* Fade edges — always visible, signal more content in both directions */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-2 md:w-4 bg-linear-to-l from-[#fafafa] to-transparent" />
      <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-2 md:w-4 bg-linear-to-r from-[#fafafa] to-transparent" />

      {/* Dot indicators — mobile only */}
      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-4 bg-indigo-600" : "w-1.5 bg-zinc-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
