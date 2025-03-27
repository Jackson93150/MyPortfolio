import Image from "next/image";
import PixelCard from "@/app/ui/pixelcard";

export default function Experience() {
  return (
    <div className="w-full h-full flex justify-center">
      <PixelCard variant="pink">
        <Image
          src="/info.png"
          alt="info"
          width={2500}
          height={2500}
          objectFit="contain"
          className="z-20"
        />
      </PixelCard>
    </div>
  );
}
