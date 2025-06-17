import BentoCard from "./bentoCard";

export default function BentoGrid() {
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-5 grid-rows-8 md:grid-rows-7 gap-12 md:gap-2 m-4">
      <div className="col-start-1 row-start-1 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-2 bg-gray-300 rounded-3xl">
        <BentoCard
          title="Dijkstra"
          description="Shortest path in transit network"
          mediaUrl="/london.png"
          mediaType="image"
          scale="105"
        />
      </div>
      <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:col-span-2 md:row-span-2 bg-gray-300 rounded-3xl">
        <BentoCard
          title="RetroRunner"
          description="Platform game featuring levels, animations via sprite sheets, built with JS Canvas."
          mediaUrl="/retrorunner.mp4"
          mediaType="video"
        />
      </div>
      <div className="col-start-1 row-start-3 md:col-start-4 md:row-start-1 md:col-span-2 md:row-span-4 bg-gray-300 rounded-3xl">
        <BentoCard
          title="Lootopia"
          description="Multiplayer treasure hunt web game with real-time ranking and interactive 3D elements"
          mediaUrl="/lootopia.mp4"
          mediaType="video"
          scale="125"
        />
      </div>
      <div className="col-start-1 row-start-4 md:col-start-1 md:row-start-3 md:col-span-2 md:row-span-2 bg-gray-300 rounded-3xl">
        <BentoCard
          title="Portfolio"
          description="An interactive portfolio about myself, built with modern animation libraries"
          mediaUrl="/portfolio.png"
          mediaType="image"
          scale="105"
        />
      </div>
      <div className="col-start-1 row-start-5 md:col-start-3 md:row-start-3 md:col-span-1 md:row-span-2 bg-gray-300 rounded-3xl">
        <BentoCard
          title="LeagueStats"
          description="A League of Legends stats app"
          mediaUrl="/stats.png"
          mediaType="image"
          scale="100"
        />
      </div>
      <div className="col-start-1 row-start-6 md:col-start-1 md:row-start-5 md:col-span-2 md:row-span-3 bg-gray-300 rounded-3xl">
        <BentoCard
          title="BabyGrow"
          description="An application designed to manage and monitor a baby’s health"
          mediaUrl="/babygrow.png"
          mediaType="image"
          scale="100"
        />
      </div>
      <div className="col-start-1 row-start-7 md:col-start-3 md:row-start-5 md:col-span-3 md:row-span-3 bg-gray-300 rounded-3xl">
        <BentoCard
          title="Instamint"
          description="NFT marketplace platform allowing users to create, buy, and sell NFTs directly between
each other"
          mediaUrl="/instamint.mp4"
          mediaType="video"
        />
      </div>
    </div>
  );
}
