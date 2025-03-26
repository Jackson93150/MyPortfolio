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
    <div className="flex h-[80vh] w-[90vw] md:h-[60vh] md:w-[80vw] items-center justify-center">
      <div className="grid h-full w-full gap-4 p-2 md:grid-cols-6 md:grid-rows-8 grid-cols-3 grid-rows-14 rounded-lg">
        {gridItems.map((item) => (
          <div
            key={item.id}
            className={`bg-gray-200 rounded-3xl shadow-md flex items-center justify-center text-xl font-bold ${item.size}`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
