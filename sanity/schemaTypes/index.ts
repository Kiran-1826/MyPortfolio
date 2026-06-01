import { defineArrayMember, defineField, defineType } from "sanity";

const portfolioCategories = [
  "UI Design",
  "Website Design",
  "Mobile App Design",
  "Branding",
  "Logos",
  "Social Media",
  "Brochures",
  "Marketing Creatives",
];

const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 18, validation: (rule) => rule.required() }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative Text", type: "string" })],
    }),
    defineField({ name: "badges", title: "Badges", type: "array", of: [defineArrayMember({ type: "string" })] }),
  ],
});

const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "content", title: "Content Paragraphs", type: "array", of: [defineArrayMember({ type: "text" })], validation: (rule) => rule.required() }),
    defineField({ name: "hostName", title: "Host Name", type: "string" }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "experienceLabel", title: "Experience Label", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
  ],
});

const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "icon", title: "Icon Label", type: "string" }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Display Order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }],
});

const skillCategory = defineType({
  name: "skillCategory",
  title: "Skill Category",
  type: "document",
  fields: [
    defineField({ name: "category", title: "Category", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      of: [defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "level", title: "Level (%)", type: "number", validation: (rule) => rule.min(0).max(100) }),
          defineField({ name: "icon", title: "Short Icon Label", type: "string" }),
        ],
      })],
    }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 0 }),
  ],
});

const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "company", title: "Company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "position", title: "Position", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "startYear", title: "Start Year", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "endYear", title: "End Year", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 8, validation: (rule) => rule.required() }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 0 }),
  ],
});

const portfolioItem = defineType({
  name: "portfolioItem",
  title: "Portfolio Item",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, validation: (rule) => rule.required() }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: portfolioCategories }, validation: (rule) => rule.required() }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 0 }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
  ],
});

const contact = defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  fields: [
    defineField({ name: "email", title: "Email", type: "string", validation: (rule) => rule.required().email() }),
    defineField({ name: "phone", title: "Phone", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
    defineField({ name: "behance", title: "Behance", type: "url" }),
    defineField({ name: "dribbble", title: "Dribbble", type: "url" }),
  ],
});

export const schemaTypes = [hero, about, service, skillCategory, experience, portfolioItem, contact];
