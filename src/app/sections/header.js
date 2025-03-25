import { motion } from "framer-motion";
import TiltImage from "../ui/tilt";

export default function Header() {
  return (
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
        className="text-[22vw] text-white -translate-y-20"
      >
        Portfolio
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        className="absolute bottom-20 md:bottom-10 uppercase text-white text-[3vw] md:text-[24px]"
      >
        hello i’m jackson and this is my story
      </motion.p>
      <TiltImage
        src="/header-cadre.png"
        alt="cadre"
        className="absolute h-auto w-[82vw] lg:h-[85vh] lg:w-auto -translate-y-20"
        height={2500}
        width={2500}
      />
    </div>
  );
}
