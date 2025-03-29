import Squares from "@/app/ui/square";
import { InfiniteScroll } from "@/app/ui/infinite-horizontal";
import {
  FaReact,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaBlender,
} from "react-icons/fa";
import { TbBrandNextjs, TbBrandThreejs, TbBrandAws } from "react-icons/tb";
import {
  SiNestjs,
  SiPostgresql,
  SiMysql,
  SiGraphql,
  SiFirebase,
  SiFramer,
  SiScaleway,
  SiTypescript,
  SiJavascript,
  SiC,
  SiRust,
  SiAdobephotoshop,
  SiAlchemy,
} from "react-icons/si";

export default function Skills() {
  const items = [
    { icon: FaReact, name: "ReactJS" },
    { icon: TbBrandNextjs, name: "NextJS" },
    { icon: SiNestjs, name: "NestJS" },
    { icon: SiPostgresql, name: "PostgreSQL" },
    { icon: SiMysql, name: "MySQL" },
    { icon: FaReact, name: "React Native" },
    { icon: FaPython, name: "Python" },
    { icon: TbBrandThreejs, name: "ThreeJS" },
    { icon: SiGraphql, name: "GraphQL" },
    { icon: SiFirebase, name: "Firebase" },
    { icon: FaDocker, name: "Docker" },
    { icon: TbBrandAws, name: "AWS SDK" },
    { icon: SiFramer, name: "Framer Motion" },
    { icon: SiScaleway, name: "Scaleway" },
    { icon: FaBlender, name: "Blender" },
    { icon: SiAlchemy, name: "Alchemy" },
    { icon: SiAdobephotoshop, name: "Photoshop" },
    { icon: SiC, name: "C" },
    { icon: SiRust, name: "Rust" },
    { icon: FaGitAlt, name: "Git" },
    { icon: SiJavascript, name: "JavaScript" },
    { icon: SiTypescript, name: "TypeScript" },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="absolute w-full h-full top-0 left-0">
        <Squares />
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center gap-[5%] pt-[5%]">
        <h2 className="text-[2em]">Skills</h2>
        <div className="w-[100%] h-[70%] flex flex-col gap-[10%] justify-center">
          <InfiniteScroll items={items} direction="left" />
          <InfiniteScroll items={items} direction="right" />
        </div>
      </div>
    </div>
  );
}
