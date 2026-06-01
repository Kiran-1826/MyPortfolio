# Sanity CMS Migration Guide

## What Changed

The portfolio UI still uses the existing React sections, Tailwind classes, animations, responsive breakpoints, and lightbox. Content now comes from Sanity through `src/sanity/hooks.ts`.

The old live gallery fetched tagged Cloudinary images. Portfolio images are now uploaded as Sanity assets from Portfolio Item documents. The former `/admin` route links editors to Sanity Studio.

## Setup

1. Create a Sanity project at `https://www.sanity.io/manage`.
2. Copy `.env.example` to `.env.local` and replace `your-project-id`.
3. Run `npm install`.
4. Run `npm run content:import` once to import the starter documents.
5. Run `npm run studio` to open Studio at `http://localhost:3333`.
6. Run `npm run dev` to open the portfolio.

For deployment, add the same `VITE_SANITY_*` environment values to the hosting provider. Set `VITE_SANITY_STUDIO_URL` to the deployed Studio URL if Studio is hosted separately.

## Editor Workflow

- Edit **Hero** to update name, title, intro copy, badges, and profile image.
- Edit **About** for the about heading, supporting paragraphs, role, experience label, and location.
- Create or reorder **Service** documents by changing `displayOrder`.
- Create **Skill Category** documents and add unlimited nested skills. Keep one category named `Tools` for the tool grid.
- Create or reorder **Experience** documents using `displayOrder`.
- Create **Portfolio Item** documents to upload work images, assign categories, tags, order, and featured status.
- Edit **Contact** for email, phone, LinkedIn, Behance, and Dribbble.
- Publish changed documents before checking the live portfolio.

## Existing Content Audit

- `Hero.tsx`: previously contained hero heading, badges, and intro copy.
- `About.tsx`: previously contained profile image URL, biography, service summary, role, and location.
- `Experience.tsx`: previously contained a local experience array.
- `SkillsTools.tsx`: previously contained local skills and tools arrays.
- `Contact.tsx`: previously contained local contact and social links.
- `ImageKitGallery.tsx`: previously fetched Cloudinary resources tagged `portfolio`.
- `Portfolio.tsx`: unused legacy URL-paste gallery, now a compatibility export.
- `AdminUpload.tsx`: previously uploaded directly to Cloudinary, now hands off to Sanity Studio.

## Verification Checklist

- Confirm the profile photo is uploaded and published in Hero.
- Confirm all portfolio images load from Sanity, lazy-load in the grid, and open in the lightbox.
- Click each portfolio category and confirm filtering is instant.
- Compare dark and light themes at mobile, tablet, and desktop widths.
- Confirm the hero, about, experience, skills, services, and contact edits appear after publish.
- Run `npm run lint`, `npm run build`, and `npm run studio:build`.
