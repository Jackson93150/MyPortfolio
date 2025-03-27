import Image from "next/image";
import PixelCard from "@/app/ui/pixelcard";

export default function Experience() {
  return (
    <div className="w-full h-full flex flex-col items-center ">
      <PixelCard variant="blue" className="z-20"></PixelCard>
      <div className="absolute w-full h-full flex flex-col justify-between items-center py-8">
        <h2 className="text-[2.2em]">Experience</h2>
        <div className="w-[50%] h-[50%] flex flex-col justify-center">
          <Image
            src="/avicenne.svg"
            alt="info"
            width={2500}
            height={2500}
            objectFit="contain"
            className="z-10 pointer-events-none"
          />
          <span>Avicenne Studio</span>
        </div>
        <span className="text-[1.5em]">2022 - Now</span>
      </div>
    </div>
  );
}
