"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex items-center justify-items-center min-h-screen">
      <main className="relative flex flex-col min-h-screen w-full items-center">
        <div className="gradient-background absolute inset-0 w-full h-full" />
        <div className="relative z-10 flex h-screen w-full items-center justify-center flex-col">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="text-[300px] font-bold text-white -translate-y-20"
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

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="absolute h-[85vh] w-auto -translate-y-20"
          >
            <Image
              src="/header-cadre.png"
              alt="cadre"
              height={2500}
              width={2500}
              className="h-full w-auto"
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
