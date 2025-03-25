"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import Image from "next/image";

const ROTATION_RANGE = 15; // Adjust this for the amount of tilt (less is more subtle)
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;
const PERSPECTIVE = 1200; // Distance of the camera, affects the depth perception

const TiltImage = ({ src, alt, className, height, width }) => {
  const ref = useRef(null);

  const x = useMotionValue(0); // X-axis motion value for tilt
  const y = useMotionValue(0); // Y-axis motion value for tilt

  // Use spring to smoothen the transition for more natural movement
  const xSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Create a transform string for CSS
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position as a percentage
    const mouseX = (e.clientX - rect.left) / width;
    const mouseY = (e.clientY - rect.top) / height;

    // Calculate the tilt (rotation) on the X and Y axis
    const rX = (mouseY - 0.5) * -ROTATION_RANGE; // Subtracting 0.5 centers the movement
    const rY = (mouseX - 0.5) * ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    // Reset tilt to center when the mouse leaves the image
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
        perspective: PERSPECTIVE, // Adding perspective for depth effect
      }}
      className={className}
    >
      {/* Apply Bounce Entrance Effect */}
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
