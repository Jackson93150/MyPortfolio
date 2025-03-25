"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import TiltImage from "./ui/tilt";

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
      <main className="relative flex flex-col min-h-screen w-full items-center">
        <div className="gradient-background absolute inset-0 w-full h-full pointer-events-none" />
        <div className="relative z-10 flex h-screen w-full items-center justify-center flex-col">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="text-[300px] text-white -translate-y-20"
          >
            Portfolio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="absolute bottom-10 uppercase text-white text-[24px]"
          >
            hello i’m jackson and this is my story
          </motion.p>
          <TiltImage
            src="/header-cadre.png"
            alt="cadre"
            className="absolute h-[85vh] w-auto -translate-y-20"
            height={2500}
            width={2500}
          />
        </div>
      </main>
    </div>
  );
}
