import Image from "next/image";
import PixelCard from "@/app/ui/pixelcard";
import Timeline from "@/app/ui/timeline";

export default function Education() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="absolute w-full h-full top-0 left-0">
        <PixelCard variant="blue"></PixelCard>
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center gap-[5%] pt-[5%]">
        <h2 className="text-[2em]">Education</h2>
        <div className="w-[100%] h-[70%] flex flex-col justify-center">
          <Timeline />
        </div>
      </div>
    </div>
  );
}
