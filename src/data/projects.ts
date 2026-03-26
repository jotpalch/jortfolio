import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "aiot-poker-table",
    title: "AIoT Texas Hold'em Smart Table",
    description:
      "An IoT smart table for Texas Hold'em poker that uses YOLOv5 object recognition to identify cards and calculates win rates using Monte Carlo simulations. Features a Flask-based GUI for real-time game analysis.",
    techStack: ["C/C++", "Python", "YOLOv5", "Flask", "Docker", "Git"],
    categories: ["AI/ML", "Automation"],
    links: {
      demo: "http://pokerimg.jotpac.com/",
      github: "https://github.com/jotpalch/AIoT-Texas-hold-em-Smart-Table",
    },
    featured: true,
    year: 2022,
  },
  {
    id: "fps-aiming-ai",
    title: "First-Person Shooter Game Aiming AI",
    description:
      "An AI system that imitates human aiming behavior in FPS games to avoid anti-cheating detection. Achieved a 50% kill rate increase and 35% headshot improvement using TensorFlow-based models.",
    techStack: ["Python", "TensorFlow", "Pyautogui"],
    categories: ["AI/ML"],
    links: {
      github: "https://github.com/jotpalch/AI_Aiming",
    },
    featured: false,
    year: 2022,
  },
  {
    id: "cnn-transformer-gan",
    title: "Substitute CNN Model with Transformer in GAN",
    description:
      "Research project replacing CNN components in GANs with Transformer architecture using self-attention mechanisms, resulting in enhanced model performance for image generation tasks.",
    techStack: ["Python", "Transformer", "GAN"],
    categories: ["AI/ML"],
    links: {
      github: "https://github.com/jotpalch/AI_Capstone_Project",
    },
    featured: false,
    year: 2022,
  },
  {
    id: "line-fresh-bot",
    title: "Shopping Area Gamify O2O Marketing LINE Bot",
    description:
      "A LINE bot for gamified online-to-offline marketing in shopping areas. Uses TensorFlow for attraction recognition with 88% accuracy. Won Special Jury Prize at LINE FRESH 2021 (Top 6).",
    techStack: ["Python", "TensorFlow", "LINE API"],
    categories: ["AI/ML", "Automation"],
    links: {
      news: "https://linecorp.com/tw/pr/news/tw/2021/4031",
    },
    achievement: "LINE FRESH Special Jury Prize (Top 6)",
    featured: true,
    year: 2021,
  },
  {
    id: "watches-recognition",
    title: "Watches Recognition AI",
    description:
      "A machine learning system that classifies watch brands and models with 84% accuracy. Includes automated photo scraping using Selenium for training data collection.",
    techStack: ["Python", "TensorFlow", "Selenium"],
    categories: ["AI/ML"],
    links: {
      github: "https://github.com/jotpalch/Machine-Learning-Project",
    },
    featured: false,
    year: 2021,
  },
  {
    id: "facebook-auction-bot",
    title: "Facebook Second-Hand Auction Group Notifier LINE Bot",
    description:
      "A LINE bot that monitors Facebook second-hand auction groups and sends real-time notifications using NLP for keyword matching. Built in 48 hours and won 1st Prize at Meichu Hackathon 2021.",
    techStack: ["Python", "Selenium", "Flask", "MySQL", "NLP"],
    categories: ["Automation", "Web"],
    links: {
      github: "https://github.com/jotpalch/meichuhackathon2021",
    },
    achievement: "1st Prize, Meichu Hackathon 2021",
    featured: true,
    year: 2021,
  },
  {
    id: "ptt-macshop-tracker",
    title: "PTT Macshop Tracker",
    description:
      "A chatbot that tracks new posts on PTT's MacShop board in real-time, providing notification subscriptions for users interested in Mac product deals.",
    techStack: ["Ruby", "Chatbot"],
    categories: ["Automation"],
    links: {
      github: "https://github.com/jotpalch/ptt_macshop_alertor",
    },
    featured: false,
    year: 2021,
  },
  {
    id: "student-id-chrome-ext",
    title: "Student ID Matching Chrome Extension",
    description:
      "A Chrome extension for NCTU CS students that matches student IDs to names, streamlining identification in university systems.",
    techStack: ["JavaScript", "Chrome API"],
    categories: ["Automation"],
    links: {
      github:
        "https://github.com/jotpalch/ChromeExtension_NCTUCS12_IDMatcher",
    },
    featured: false,
    year: 2020,
  },
  {
    id: "taipei-safety-viz",
    title: "Public Safety Analysis and Visualization in Taipei",
    description:
      "An interactive data visualization website showing crime rates and emergency service distribution across Taipei using D3.js. Features interactive maps and charts for public safety analysis.",
    techStack: ["D3.js", "HTML", "JavaScript"],
    categories: ["Data Visualization", "Web"],
    links: {
      demo: "https://taipeipublicsafetyvisualizationwebsite.jotpac.com/",
      github:
        "https://github.com/jotpalch/Taipei-Public-Safety-Visualization-Website",
    },
    featured: false,
    year: 2021,
  },
  {
    id: "csunion-booksales",
    title: "CSUNION Booksales Automation System",
    description:
      "An automation system for the CS student union's book sales that uses barcode scanning with Pyzbar for automated ISBN recording. Reduced processing time by 85%.",
    techStack: ["Python", "Pyzbar", "Selenium", "Markdown"],
    categories: ["Automation"],
    links: {
      github: "https://github.com/jotpalch/CSUNION_booksales",
    },
    featured: false,
    year: 2020,
  },
  {
    id: "nycu-hs-website",
    title: "NYCU HS Official Website",
    description:
      "The official website for NYCU High School, built with Next.js and Markdown-based content management for easy updates by school staff.",
    techStack: ["Next.js", "Markdown"],
    categories: ["Web"],
    links: {
      demo: "https://hs.nycu.edu.tw/",
    },
    featured: false,
    year: 2024,
  },
  {
    id: "nycu-scoring-system",
    title: "NYCU College Application Scoring System",
    description:
      "A full-stack scoring system for NYCU college applications, reducing the scoring period by 60%. Built with Flask backend and SQLite database, deployed behind Nginx.",
    techStack: ["Python", "Flask", "SQLite", "Nginx"],
    categories: ["Web"],
    links: {},
    featured: false,
    year: 2024,
  },
  {
    id: "nycu-cs-hs-website",
    title: "NYCU CS Website for High School Students",
    description:
      "A responsive website introducing NYCU's CS department to prospective high school students. Achieved a 177% Google PageSpeed improvement (53 to 94) with Vue.js and Tailwind CSS.",
    techStack: ["Vue.js", "Tailwind CSS"],
    categories: ["Web"],
    links: {
      demo: "https://highschool.nctucsunion.me/",
      github: "https://github.com/jotpalch/cs_website",
    },
    featured: false,
    year: 2022,
  },
  {
    id: "blockchain-physio-app",
    title: "Physiological Data Authentication Blockchain App",
    description:
      "A blockchain application for authenticating physiological data using Hyperledger Fabric. Features a React.js frontend and Node.js backend for secure data management.",
    techStack: ["React.js", "Node.js", "Hyperledger Fabric"],
    categories: ["Blockchain", "Web"],
    links: {
      github:
        "https://github.com/jotpalch/PhysiologicalDataBlockchainApp",
    },
    featured: false,
    year: 2022,
  },
  {
    id: "vanity-address-generator",
    title: "Vanity Address Generator",
    description:
      "A tool for generating customizable cryptocurrency addresses with BIP39 mnemonic phrase support. Allows users to create vanity addresses with specific prefixes or patterns.",
    techStack: ["Node.js", "BIP39"],
    categories: ["Blockchain"],
    links: {
      demo: "https://vag.jotpac.com/",
      github: "https://github.com/jotpalch/0816065-bdaf-lab2",
    },
    featured: false,
    year: 2022,
  },
];
