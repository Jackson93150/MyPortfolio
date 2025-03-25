"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import Image from "next/image";

const ROTATION_RANGE = 15;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;
const PERSPECTIVE = 1200;

const TiltImage = ({ src, alt, height, width }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 20 });

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    const rX = (mouseY - 0.5) * -ROTATION_RANGE; 
    const rY = (mouseX - 0.5) * ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: PERSPECTIVE,
      }}
       className="absolute w-[85vw] md:h-[60vw] md:w-auto -translate-y-20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.5,
        }}
        className="h-full w-auto"
      >
        <motion.div
          style={{
            transform,
          }}
          className="h-full w-auto"
        >
          <Image
            src={src}
            alt={alt}
            height={height}
            width={width}
            className="h-full w-auto"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TiltImage;
