import { Experience } from "@/types";

export const experienceData: Experience[] = [
  {
    id: "nvidia",
    company: "NVIDIA",
    role: "System Software Engineer",
    location: "Taipei, Taiwan",
    startDate: "Dec 2025",
    description: [
      "Linux driver development and system software engineering",
      "Building agentic AI applications and workflows",
    ],
    techStack: ["C/C++", "Linux", "Driver Development", "Agentic AI"],
  },
  {
    id: "intel-2",
    company: "Intel",
    role: "Platform FW and AI Application Engineer Intern",
    location: "Taipei, Taiwan",
    startDate: "Jul 2024",
    endDate: "Nov 2025",
    description: [
      "Automated and enhanced large language model with RAG deployments on enterprise servers",
      "Refined server BMC firmware, focusing on efficiency and system stability",
    ],
    techStack: ["LLM", "RAG", "Server BMC", "Firmware Optimization", "CI/CD"],
  },
  {
    id: "asml",
    company: "ASML",
    role: "Software Engineer Intern",
    location: "Hsinchu, Taiwan",
    startDate: "Oct 2023",
    endDate: "May 2024",
    description: [
      "Automated data-collection tool designing for saving 884 labor hours/year",
      "Machine learning based DUV issue classifier developing with TensorFlow, reducing time costs by 60%",
    ],
    techStack: ["Python", "PowerBI", "Selenium", "Machine Learning"],
  },
  {
    id: "realtek",
    company: "Realtek",
    role: "Software Engineer Intern (by project)",
    location: "Hsinchu, Taiwan",
    startDate: "Mar 2023",
    endDate: "Jun 2023",
    description: [
      "Conducted research in Python-based Natural Language Processing solutions",
      "Dockerized and optimized original programs and assisted in initiating CI/CD infra development",
    ],
    techStack: ["Python", "MSSQL", "Docker", "Git", "CI/CD", "Llama", "Hugging Face", "Elasticsearch"],
  },
  {
    id: "intel-1",
    company: "Intel",
    role: "Software Engineer Intern",
    location: "Taipei, Taiwan",
    startDate: "Jul 2022",
    endDate: "Sep 2023",
    description: [
      "Created a streamlined firmware stress testing tool that cuts time usage by 70%",
      "Designed firmware update tool for security updates using Git and GitHub",
    ],
    techStack: ["Python", "PowerShell", "Git", "Automation Engineering", "Firmware Testing"],
  },
];
