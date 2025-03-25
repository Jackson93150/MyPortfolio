import { motion } from "framer-motion";
import Image from "next/image";
import InfiniteScroll from "../ui/infinitescroll";
import BentoGrid from "../ui/bentogrid";

const items = [
  { content: "Text Item 1" },
  { content: <p>Paragraph Item 2</p> },
  { content: "Text Item 3" },
  { content: <p>Paragraph Item 4</p> },
  { content: "Text Item 5" },
  { content: <p>Paragraph Item 6</p> },
  { content: "Text Item 7" },
  { content: <p>Paragraph Item 8</p> },
  { content: "Text Item 9" },
  { content: <p>Paragraph Item 10</p> },
  { content: "Text Item 11" },
  { content: <p>Paragraph Item 12</p> },
  { content: "Text Item 13" },
  { content: <p>Paragraph Item 14</p> },
];

export default function Skills() {
  return (
    <div className="relative z-10 flex flex-col h-auto min-h-screen w-full items-center gap-16 px-4 md:px-16 py-10 md:py-20">
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
        My Skills
      </motion.h2>
      <div className="flex relative w-[80vw] h-[65vh] rounded-lg text-white">
        <BentoGrid />
      </div>
    </div>
  );
}
