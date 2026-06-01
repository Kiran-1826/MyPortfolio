import groq from "groq";

export const heroQuery = groq`*[_type == "hero"][0]{
  name, title, subtitle, description, profileImage, badges
}`;
export const aboutQuery = groq`*[_type == "about"][0]{
  heading, content, hostName, role, experienceLabel, location
}`;
export const servicesQuery = groq`*[_type == "service"] | order(displayOrder asc){
  _id, title, icon, displayOrder
}`;
export const skillsQuery = groq`*[_type == "skillCategory"] | order(displayOrder asc){
  _id, category, skills[]{name, level, icon}, displayOrder
}`;
export const experienceQuery = groq`*[_type == "experience"] | order(displayOrder asc){
  _id, company, position, startYear, endYear, description, displayOrder
}`;
export const portfolioQuery = groq`*[_type == "portfolioItem"] | order(displayOrder asc){
  _id, title, description, image, category, tags, displayOrder, featured
}`;
export const contactQuery = groq`*[_type == "contact"][0]{
  email, phone, linkedin, behance, dribbble
}`;
