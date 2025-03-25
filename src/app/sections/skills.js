import { motion } from "framer-motion";
import Image from "next/image";

export default function Skills() {
  return (
    <div className="relative z-10 flex flex-col md:flex-row h-auto min-h-screen w-full items-center justify-center md:justify-between px-4 md:px-16 py-10 md:py-20">
      <motion.h2
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.3,
        }}
        className="z-10 w-[50vw] flex justify-center"
      >
        My Skills
      </motion.h2>
    </div>
  );
}
