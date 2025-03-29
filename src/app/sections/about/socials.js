import Image from "next/image";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Socials() {
  const email = "your.email@example.com";

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(email);
  };

  return (
    <div className="absolute w-full h-full flex flex-col justify-between py-[5%] items-center top-0 left-0 bg-blue-500">
      <h2 className="text-[1.5em] sm:text-[2em]">Socials</h2>
      <motion.div
        className="h-[55%] w-[55%] sm:w-[50%] sm:h-[50%] flex flex-col justify-center bg-white rounded-2xl overflow-hidden"
        animate={{
          scale: [1, 1.1, 1, 1.1, 1],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image
          src="/memoji.png"
          alt="memoji"
          height={2500}
          width={2500}
          className="h-full w-auto object-cover"
          objectFit="contain"
        />
      </motion.div>

      <div className="flex gap-4 mt-4">
        <motion.a
          href="https://github.com/Jackson93150"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 md:p-3 bg-white rounded-full shadow-md"
          whileHover={{ scale: 1.2 }}
        >
          <FaGithub className="w-4 h-4 md:w-7 md:h-7" color="#181717" />
        </motion.a>

        <motion.a
          href="https://www.linkedin.com/in/jackson-anthonipillai-20a88a227/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 md:p-3 bg-white rounded-full shadow-md"
          whileHover={{ scale: 1.2 }}
        >
          <FaLinkedin className="w-4 h-4 md:w-7 md:h-7" color="#0077B5" />
        </motion.a>

        <motion.button
          onClick={copyEmailToClipboard}
          className="p-2 md:p-3 bg-white rounded-full shadow-md cursor-pointer"
          whileHover={{ scale: 1.2 }}
        >
          <FaEnvelope className="w-4 h-4 md:w-7 md:h-7" color="#D14836" />
        </motion.button>
      </div>
    </div>
  );
}
