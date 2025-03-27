"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Header from "./sections/header";
import About from "./sections/about";

export default function Home() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <div className="flex items-center justify-items-center min-h-screen cursor-none">
      <motion.div
        className="z-50 fixed top-[-75px] left-[-75px] w-[150px] h-[150px] bg-white rounded-full pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          mixBlendMode: "soft-light",
          filter: "blur(20px)",
        }}
      />
      <main className="relative flex flex-col min-h-screen h-fit w-full items-center gap-16">
        <div className="gradient-background absolute inset-0 w-full h-full pointer-events-none" />
        <Header/>
        <About />
        <Header/>
      </main>
    </div>
  );
}
