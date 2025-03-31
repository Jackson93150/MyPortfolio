import { motion } from "framer-motion";
import BentoGrid from "../ui/bentogrid";

export default function Project() {
  return (
    <div className="relative z-10 flex flex-col min-h-screen h-fit gap-16 justify-center items-center">
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
        className="text-white text-[5vw]"
      >
        Projects
      </motion.h2>
      <div className="flex w-[95vw] h-[250vh] md:h-[95vh] pb-10">
        <BentoGrid />
      </div>
    </div>
  );
}
