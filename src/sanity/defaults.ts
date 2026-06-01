import type {
  AboutDocument,
  ContactDocument,
  ExperienceDocument,
  HeroDocument,
  ServiceDocument,
  SkillDocument,
} from "./types";

export const defaultHero: HeroDocument = {
  name: "Bodem Divya Kiran",
  title: "Graphic Story Teller & UX",
  subtitle: "Welcome to Kiran's Visual Playground",
  description:
    "Design feeling flat? Let me bring it to life!\n\nI'm a Graphic and UI/UX Designer with over 4 years of experience crafting visuals that don't just look good - but feel right.\n\nFrom sleek interfaces to scroll-stopping creatives, I help brands make bold impressions and deliver seamless user experiences.\n\nWhat I do:\n\n- UI/UX Design for Web & Mobile\n- Website & App Design (Wireframes to High-Fidelity)\n- Logo Design & Visual Elements\n- Social Media Creatives\n- Landing Pages & Marketing Collateral\n- Prototyping (Figma)\n- Graphic Design using Adobe Photoshop, Illustrator & InDesign\n\nWhether you're building a product or refreshing your brand's look, let's connect and bring your vision to life - pixel by pixel.",
  badges: ["Senior Designer", "UI/UX Enthusiast", "4+ Years Experience"],
};

export const defaultAbout: AboutDocument = {
  heading: "Welcome to my Visual Neighborhood.",
  content: [
    "Imagine a place where design meets clarity. That's what I strive for in every project.",
    "I specialize in building robust brand identities and intuitive UI/UX systems.",
  ],
  hostName: "Bodem Divya Kiran",
  role: "Sr. Designer",
  experienceLabel: "04_Years",
  location: "Visakhapatnam, Global Reach. Available Remote.",
};

export const defaultServices: ServiceDocument[] = [
  "Logo Design",
  "Mockups",
  "Brochures",
  "Pamphlets",
  "Website Design",
  "App UI Design",
  "Product Branding",
  "Social Media Creatives",
].map((title, index) => ({
  _id: `default-service-${index}`,
  title,
  displayOrder: index,
}));

export const defaultSkills: SkillDocument[] = [
  ["UI/UX", ["UI/UX Design", "User Research", "Interaction Design"]],
  ["Graphic Design", ["Typography & Layout", "Catalog Design", "Social Media Design"]],
  ["Branding", ["Brand Identity", "Logo Design", "Product Branding"]],
  ["Prototyping", ["Wireframing", "High Fidelity UI", "Figma Prototypes"]],
  ["Marketing Design", ["Campaign Design", "Brochures", "Marketing Collateral"]],
  ["Tools", ["Photoshop", "Illustrator", "InDesign", "Figma", "Premiere Pro", "After Effects"]],
].map(([category, skills], index) => ({
  _id: `default-skill-${index}`,
  category: category as string,
  displayOrder: index,
  skills: (skills as string[]).map((name, skillIndex) => ({
    name,
    level: Math.max(78, 98 - skillIndex * 3),
    icon: name.slice(0, 2),
  })),
}));

export const defaultExperience: ExperienceDocument[] = [
  {
    _id: "default-wnds",
    company: "WNDS",
    position: "Sr. Graphic & UX Designer",
    startYear: "2026",
    endYear: "Present",
    description:
      "Transferred from Nexii IT Labs following company restructuring/rebranding.\n\nLed branding, marketing, and product design initiatives for the company. Oversaw creative direction, social media campaigns, and brand consistency across all digital and marketing assets.\n\nDesigned and delivered end-to-end UX/UI experiences for BharatCV.ai and HiringHeroes.ai including user research, wireframing, prototyping, interaction design, and high fidelity UI design. Ensured scalable and user-centric product experiences.",
    displayOrder: 0,
  },
  {
    _id: "default-nexii",
    company: "Nexii IT Labs",
    position: "Sr. Graphic & UX Designer",
    startYear: "2025",
    endYear: "2026",
    description:
      "Led branding and marketing creative direction, designed complete UX/UI experiences for BharatCV.ai and HiringHeroes.ai, managed social media campaigns, and maintained design consistency across digital products and marketing assets.",
    displayOrder: 1,
  },
  {
    _id: "default-riki",
    company: "RIKI Global Trading Pvt Ltd",
    position: "Graphic Designer",
    startYear: "2023",
    endYear: "2024",
    description:
      "Designed branding, marketing, and promotional materials. Created product catalogs, brochures, posters, ad creatives, social media campaigns, and website designs. Managed brand identity updates, logo enhancements, and HITEX exhibition stall designs.",
    displayOrder: 2,
  },
  {
    _id: "default-cg-creed",
    company: "CG Creed Animation",
    position: "Graphic Designer",
    startYear: "2021",
    endYear: "2022",
    description: "Created graphics, layouts, and branding assets.",
    displayOrder: 3,
  },
];

export const defaultContact: ContactDocument = {
  email: "bodemkiran098@gmail.com",
  phone: "+91 7032698038",
  linkedin: "https://linkedin.com/in/bodem-divya-kiran",
  behance: "https://behance.net",
  dribbble: "https://dribbble.com",
};
