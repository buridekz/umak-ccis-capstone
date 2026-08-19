import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <>
      <ReactLenis
        root
        options={{
          autoRaf: true,
          anchors: true,
          lerp: 0.1,
          duration: 1.05,
          allowNestedScroll: true,
          respectReducedMotion: true,
        }}
      />
      {children}
    </>
  );
}
