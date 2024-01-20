import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMongodb,
  SiHtml5,
  SiCss3,
  SiAmazonaws,
  SiSupabase,
  SiFirebase,
  SiRedux,
  SiGit,
  SiDocker,
  SiBootstrap,
  SiMui,
  SiPrisma,
  SiFlutter,
  SiHeroku,
  SiTailwindcss,
} from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";

export const skills = [
  {
    icon: SiTypescript,
    text: "TypeScript",
  },
  {
    icon: SiJavascript,
    text: "JavaScript",
  },
  {
    icon: SiReact,
    text: "React",
  },
  {
    icon: SiNextdotjs,
    text: "Next",
  },
  {
    icon: SiTailwindcss,
    text: "Tailwind",
  },
  {
    icon: SiRedux,
    text: "Redux",
  },
  {
    icon: SiFlutter,
    text: "Flutter",
  },
  {
    icon: SiHtml5,
    text: "HTML5",
  },
  {
    icon: SiCss3,
    text: "CSS3",
  },
  {
    icon: SiNodedotjs,
    text: "Node",
  },
  {
    icon: SiExpress,
    text: "Express",
  },
  {
    icon: SiPython,
    text: "Python",
  },
  {
    icon: BiLogoPostgresql,
    text: "PostgreSQL",
  },
  {
    icon: SiMongodb,
    text: "MongoDB",
  },
  {
    icon: SiAmazonaws,
    text: "AWS",
  },
  {
    icon: SiHeroku,
    text: "Heroku",
  },
  {
    icon: SiSupabase,
    text: "Supabase",
  },
  {
    icon: SiFirebase,
    text: "Firebase",
  },
  {
    icon: SiGit,
    text: "Git",
  },
  {
    icon: SiDocker,
    text: "Docker",
  },
  {
    icon: SiPrisma,
    text: "Prisma",
  },
  {
    icon: SiBootstrap,
    text: "Bootstrap",
  },
  {
    icon: SiMui,
    text: "MUI",
  },
];

export interface Project {
  title: string;
  description: string;
  link: string;
}

export const projects: Project[] = [
  {
    title: "Raise The Stakes",
    description: "RaiseTheStakes is a decentralized application (DApp) built on the Ethereum blockchain that allows users to participate in a competitive gaming environment where they can stake tokens, earn rewards, and improve their rankings. This DApp leverages the power of smart contracts to ensure transparency, security, and fairness in the gaming ecosystem. 🔑 Key Features Player Data Management: The DApp allows users to create player profiles and manage their gaming data, including rankings, reward percentages, stakes, and items.Staking Mechanism: Users can stake a certain amount of tokens to participate in games and competitions, increasing their chances of winning rewards. Ranking System: A robust ranking system is in place to determine players' standings within the gaming community. Players can strive to improve their rankings over time. Reward Distribution: The DApp automatically calculates and distributes rewards to players based on their performance and staked amounts.Transparency: All gaming-related data and transactions are recorded on the Ethereum blockchain, ensuring transparency and preventing manipulation.",
    link: "https://github.com/",
  },
];

export interface WorkExperience {
  company: string;
  logo: string;
  position: string;
  description: string;
  years: string;
}

export const workExperiences: WorkExperience[] = [
  {
    company: "Raise The Stakes",
    logo: "/company-logo.png",
    position: "Role at Company 3",
    description: "Brief description of your experience at Company 3.",
    years: "May 2022 - August 2024",
  },
];
export const aboutYou = {
  name: "Minty Swap",
  description:
    "👋 The RaiseTheStakes game contract is a suitable for games or applications where players can participate, earn rewards, and interact with their in-game assets",
  yearsOfExperience: "",
  location: "West Coast, USA",
  email: "email@example.com",
};

export const logoText = "@mintyswap";

export const marketingHeadlines = {
  mainHeadline: "📜 RaiseTheStakes DApp.",
  subHeadline: "🚀 Project",
};

export const websiteMetadata = {
  title: "Your Name | Designation",
  description: "👋 Hey, Random Person here. Welcome to my portflio/blog.",
};
