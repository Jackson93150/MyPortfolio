import Image from "next/image";
import RotatingText from "@/app/ui/rotatingtext";

export default function PictureCard() {
  return (
    <div className="w-full h-full flex justify-center pt-10">
      <Image
        src="/info.png"
        alt="info"
        layout="fill"
        objectFit="cover"
        className="absolute"
      />
      <div className="absolute inset-0 bg-black/10 backdrop-blur-lg border border-white/20 rounded-lg opacity-30" />
      <div className="absolute bottom-0 w-full h-[100%] bg-gradient-to-t from-black via-transparent to-transparent shadow-[0_16px_40px_rgba(0,0,0,0.5)]" />
      <div className="absolute top-0 w-full h-[100%] bg-gradient-to-b from-black via-transparent to-transparent shadow-[0_-16px_40px_rgba(0,0,0,0.7)] opacity-40" />
      <div className="absolute bottom-0 left-0 p-5 flex flex-col items-baseline">
        <span className="tracking-normal font-semibold text-4xl">Jackson</span>
        <RotatingText
          texts={["23 Years Old", "Fullstack Developer"]}
          mainClassName="text-white tracking-normal font-light overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
      </div>
    </div>
  );
}
