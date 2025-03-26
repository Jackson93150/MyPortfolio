import Image from "next/image";

export default function PictureCard() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src="/info.png"
        alt="info"
        fill
        className="h-full w-auto"
      />
    </div>
  );
}
