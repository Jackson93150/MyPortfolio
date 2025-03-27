import { motion } from "framer-motion";
import Image from "next/image";

export default function Experience() {
  return (
    <div className="absolute w-full h-full flex flex-col justify-between py-[5%] items-center top-0 left-0 bg-blue-500">
      <h2 className="text-[1.5em] sm:text-[2em]">Experience</h2>
      <div className="h-[50%] w-[50%] sm:w-[45%] sm:h-[45%] flex flex-col justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            repeatDelay: 2,
            type: "spring",
            stiffness: 20,
            damping: 5, 
            duration: 1.5,
          }}
          className="z-10 pointer-events-none"
        >
          <Image
            src="/avicenne.svg"
            alt="info"
            width={2500}
            height={2500}
            objectFit="contain"
          />
        </motion.div>
        <span className="text-[45%] sm:text-[60%]">Avicenne Studio</span>
      </div>
      <span className="text-[1.2em] sm:text-[1.5em]">2022 - Now</span>
    </div>
  );
}
