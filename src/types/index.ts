export type ProjectCategory =
  | "AI/ML"
  | "Web"
  | "Blockchain"
  | "Automation"
  | "Data Visualization";

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  categories: ProjectCategory[];
  links: {
    github?: string;
    demo?: string;
    news?: string;
  };
  image?: string;
  featured?: boolean;
  year: number;
  achievement?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string[];
  techStack: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startYear: number;
  endYear: number;
  description?: string[];
}

export interface Award {
  title: string;
  organization: string;
  year: number;
  description?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}
