const gridItems = [
  { name: "NEST", id: 1, size: "col-span-1 row-span-2" },
  { name: "GIT", id: 2, size: "col-span-2 row-span-2" },
  { name: "JS/TS", id: 3, size: "md:col-span-2 row-span-3 col-span-3" },
  { name: "GSAP", id: 4, size: "col-span-1 row-span-2" },
  { name: "C", id: 5, size: "md:col-span-1 md:row-span-1" },
  { name: "RUST", id: 6, size: "md:col-span-1 md:row-span-1" },
  { name: "MOTION", id: 7, size: "col-span-1 row-span-2" },
  { name: "TAILWIND", id: 8, size: "col-span-1 row-span-2" },
  { name: "REACT", id: 9, size: "col-span-1 row-span-3" },
  { name: "NEXT", id: 10, size: "col-span-1 row-span-3" },
  { name: "POSTGRES", id: 11, size: "col-span-1 row-span-2" },
  { name: "MYSQL", id: 12, size: "col-span-1 row-span-2" },
  { name: "GRAPHQL", id: 13, size: "col-span-1 row-span-2" },
  { name: "DOCKER", id: 14, size: "col-span-1 row-span-2" },
  { name: "FIREBASE", id: 15, size: "md:col-span-2 row-span-1" },
  { name: "THREEJS", id: 16, size: "md:col-span-1 md:row-span-3 row-span-2" },
  { name: "REACT NATIVE", id: 17, size: "md:col-span-2 md:row-span-3 col-span-2 row-span-2" },
  { name: "N8N", id: 18, size: "col-span-1 md:row-span-3 row-span-4" },
  { name: "AWS SDK", id: 19, size: "col-span-1 row-span-3" },
  { name: "ALCHEMY", id: 20, size: "col-span-1 row-span-3" },
];

export default function BentoGrid() {
  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-5 grid-rows-8 md:grid-rows-7 gap-12 md:gap-2 m-4">
      <div className="col-start-1 row-start-1 md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-2 bg-gray-300 rounded-3xl p-10">0</div>
      <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1 md:col-span-2 md:row-span-2 bg-gray-300 rounded-3xl p-10">1</div>
      <div className="col-start-1 row-start-3 md:col-start-4 md:row-start-1 md:col-span-2 md:row-span-4 bg-gray-300 rounded-3xl p-10">2</div>
      <div className="col-start-1 row-start-4 md:col-start-1 md:row-start-3 md:col-span-1 md:row-span-2 bg-gray-300 rounded-3xl p-10">3</div>
      <div className="col-start-1 row-start-5 md:col-start-2 md:row-start-3 md:col-span-1 md:row-span-2 bg-gray-300 rounded-3xl p-10">4</div>
      <div className="col-start-1 row-start-6 md:col-start-3 md:row-start-3 md:col-span-1 md:row-span-2 bg-gray-300 rounded-3xl p-10">5</div>
      <div className="col-start-1 row-start-7 md:col-start-1 md:row-start-5 md:col-span-2 md:row-span-3 bg-gray-300 rounded-3xl p-10">6</div>
      <div className="col-start-1 row-start-8 md:col-start-3 md:row-start-5 md:col-span-2 md:row-span-3 bg-gray-300 rounded-3xl p-10">7</div>
      <div className="hidden md:block md:col-start-5 md:row-start-5 md:col-span-1 md:row-span-3 bg-gray-300 rounded-3xl p-10">8</div>
    </div>
  );
}
