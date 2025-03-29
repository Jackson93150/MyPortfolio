import { motion } from "framer-motion";

const Timeline = () => {
  const events = [
    {
      year: 2016,
      title: "Lycée Eugénie Cotton",
      subtitle: "Bac STD2A",
    },
    {
      year: 2019,
      title: "Université Paris 8",
      subtitle: "Licence",
    },
    {
      year: 2023,
      title: "SupDeVinci",
      subtitle: "Master",
    },
  ];

  return (
    <div className="flex flex-col pl-[5%]">
      <div className="relative border-l-4 border-blue-500 pl-[10%]">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className="relative flex items-start mb-[5%]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }} 
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: index * 1,
            }}
          >
            <div className="absolute -left-4 w-[1em] h-[1em] bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm" />
            <div className="ml-[5%] flex flex-col w-full items-start">
              <h3 className="text-[60%] whitespace-nowrap font-semibold lg:text-[70%] 2xl:text-[90%]">{event.title}</h3>
              <p className="text-white/90 text-[50%]">{event.subtitle}</p>
              <span className="text-[60%] text-white/60 font-medium">{event.year}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
