import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  const sentenceVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative z-10 flex flex-col md:flex-row h-auto min-h-screen w-full items-center justify-center md:justify-between px-4 md:px-16 py-10 md:py-20">
      <motion.div
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
        <Image
          src="/about.png"
          alt="about"
          height={2960}
          width={2000}
          className="h-auto w-[82vw] md:h-[60vh] lg:h-[80vh] md:w-auto"
        />
      </motion.div>

      <motion.p
        variants={sentenceVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center text-white text-[clamp(16px, 2.5vw, 22px)] leading-relaxed w-full md:w-1/2 mt-10 md:mt-0 px-4 md:px-8"
      >
        {`My name is Jackson, and I am 23 years old. I am a junior developer and currently studying at Sup De Vinci. Ever since I was a child, I have been passionate about design, art, and technology. I initially pursued design studies but eventually realized that computer science suited me much better. My goal is to become a proficient full-stack developer. In my free time, I enjoy reading manga, playing video games, taking photos and challenging myself through physical training.`
          .split(" ")
          .map((word, index) => (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mr-1"
            >
              {word}
            </motion.span>
          ))}
      </motion.p>
    </div>
  );
}
