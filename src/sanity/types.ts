export interface SanityImage {
  asset?: {
    _ref?: string;
    _type?: "reference";
  };
  alt?: string;
}

export interface HeroDocument {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  profileImage?: SanityImage;
  badges: string[];
}

export interface AboutDocument {
  heading: string;
  content: string[];
  hostName: string;
  role: string;
  experienceLabel: string;
  location: string;
}

export interface ServiceDocument {
  _id: string;
  title: string;
  icon?: string;
  displayOrder: number;
}

export interface SkillItem {
  name: string;
  level?: number;
  icon?: string;
}

export interface SkillDocument {
  _id: string;
  category: string;
  skills: SkillItem[];
  displayOrder: number;
}

export interface ExperienceDocument {
  _id: string;
  company: string;
  position: string;
  startYear: string;
  endYear: string;
  description: string;
  displayOrder: number;
}

export interface PortfolioDocument {
  _id: string;
  title: string;
  description?: string;
  image: SanityImage;
  category: string;
  tags: string[];
  displayOrder: number;
  featured: boolean;
}

export interface ContactDocument {
  email: string;
  phone: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
}
