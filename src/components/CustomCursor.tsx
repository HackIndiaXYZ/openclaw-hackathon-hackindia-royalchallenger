"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const cursorX = useSpring(0, { stiffness: 1000, damping: 50 });
  const cursorY = useSpring(0, { stiffness: 1000, damping: 50 });
  const ringX = useSpring(0, { stiffness: 150, damping: 15 });
  const ringY = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    // Only show custom cursor on desktop
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    // Track hoverable elements
    const addHoverListeners = () => {
      const hoverables = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, label'
      );
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => setHovered(true));
        el.addEventListener("mouseleave", () => setHovered(false));
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    addHoverListeners();

    // Re-add listeners when DOM changes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    // Set cursor: none only on desktop
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.textContent =
      "a, button, input, textarea, select, label, [role='button'] { cursor: none !important; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      document.body.style.cursor = "";
      style.remove();
    };
  }, [cursorX, cursorY, ringX, ringY]);

  if (!visible) return null;

  return (
    <>
      {/* Dot — instant follow */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          width: 8,
          height: 8,
          backgroundColor: "#00D4FF",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Ring — spring follow */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          border: hovered ? "1.5px solid #ffffff" : "1.5px solid #00D4FF",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          translateX: "-50%",
          translateY: "-50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{
          width: hovered ? 48 : 32,
          height: hovered ? 48 : 32,
          borderColor: hovered
            ? "rgba(255,255,255,0.8)"
            : "rgba(0,212,255,0.5)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {hovered && (
          <span
            style={{
              fontSize: "8px",
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "#ffffff",
              letterSpacing: "0.15em",
              userSelect: "none",
            }}
          >
            CLICK
          </span>
        )}
      </motion.div>
    </>
  );
}
