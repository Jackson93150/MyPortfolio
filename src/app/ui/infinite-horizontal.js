export const InfiniteScroll = ({ items, direction = "left" }) => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden mask-gradient">
      <ul
        className={`flex items-center [&_li]:mx-6 [&_img]:max-w-none ${
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        }`}
      >
        {items.map((item, index) => (
          <li key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <item.icon />
            </div>
            <span className="text-[70%]">{item.name}</span>
          </li>
        ))}
      </ul>

      {/* Duplicate list for seamless animation */}
      <ul
        className={`flex items-center [&_li]:mx-6 [&_img]:max-w-none ${
          direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
        }`}
        aria-hidden="true"
      >
        {items.map((item, index) => (
          <li key={index} className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <item.icon />
            </div>
            <span className="text-[70%]">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
