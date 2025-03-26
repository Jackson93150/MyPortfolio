import { motion } from "framer-motion";
import Image from "next/image";
import GridMotion from "../ui/gridmotion";
import PictureCard from "./about/picture-card";

const items = [
  "Socials",
  "Skills",
  "Education",
  "Experience",
  "Passions",
  <PictureCard key="jsx-item-7" />,
  "Socials",
  "Skills",
  "Education",
  "Experience",
  "Passions",
  <PictureCard key="jsx-item-7" />,
  "Socials",
  "Skills",
  "Education",
  "Experience",
  "Passions",
  <PictureCard key="jsx-item-7" />,
  "Socials",
  "Skills",
  "Education",
  "Experience",
  "Passions",
  <PictureCard key="jsx-item-7" />,
  "Socials",
  "Skills",
  "Education",
  "Experience",
  "Passions",
  <PictureCard key="jsx-item-7" />,
];

export default function About2() {
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
        About Me
      </motion.h2>
      <div className="flex w-[95vw] h-[95vh]">
        <GridMotion items={items} />
      </div>
    </div>
  );
}
