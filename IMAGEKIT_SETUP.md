# ImageKit.io Gallery Setup Guide

## Overview

This component fetches portfolio images directly from ImageKit's Media Library without any backend database. Simply drag-and-drop images into the `/portfolio` folder in your ImageKit dashboard, and they appear automatically on the website.

---

## Step 1: Create an ImageKit Account

1. Go to [imagekit.io](https://imagekit.io) and sign up
2. Create a new project or use the default one

---

## Step 2: Get Your ImageKit Credentials

### Find Your Public Key:

1. Log in to ImageKit Dashboard
2. Go to **Settings** → **API Keys**
3. Copy the **Public Key** (looks like: `public_...`)

### Find Your URL Endpoint:

1. Go to **Settings** → **URL Endpoint**
2. Copy the full endpoint (format: `https://ik.imagekit.io/YOUR_ID/`)

---

## Step 3: Update the Component

Open `src/components/ImageKitGallery.tsx` and replace the placeholder values:

```javascript
const IMAGEKIT_CONFIG = {
  publicKey: "YOUR_PUBLIC_KEY_HERE", // ← Replace with your public key
  urlEndpoint: "https://ik.imagekit.io/YOUR_IMAGEKIT_ID/", // ← Replace with your URL endpoint
  authenticationEndpoint: "/api/auth",
};
```

**Example (after replacement):**

```javascript
const IMAGEKIT_CONFIG = {
  publicKey: "public_1a2b3c4d5e6f7g8h9i0j",
  urlEndpoint: "https://ik.imagekit.io/myportfolio/",
  authenticationEndpoint: "/api/auth",
};
```

---

## Step 4: Create the `/portfolio` Folder in ImageKit

1. Log in to ImageKit Dashboard
2. Click **Media Library**
3. Click the **+** button to create a new folder
4. Name it exactly: **`portfolio`** (lowercase)
5. Click **Create**

---

## Step 5: Upload Images with Naming Convention

In the `/portfolio` folder, upload images using this naming pattern:

```
Category - Project Title.jpg
```

**Examples:**

- `Branding - Skanda Studio Visuals.jpg`
- `UI UX - Vaahanaa Automobile App.png`
- `Motion - Animated Logo Intro.mp4` (or any supported format)
- `Web Design - E-commerce Platform.png`

### Naming Convention Breakdown:

- **Before the dash**: Becomes the category badge (e.g., "Branding", "UI UX")
- **After the dash**: Becomes the project title (e.g., "Skanda Studio Visuals")
- **Fallback**: If no dash is found, file name becomes the title and category defaults to "Gallery"

---

## Step 6: Use the Component

Replace your existing Portfolio component in `src/App.tsx` or wherever you use it:

```jsx
import ImageKitGallery from "./components/ImageKitGallery";

export default function App() {
  return (
    <>
      {/* Other sections */}
      <ImageKitGallery />
      {/* Other sections */}
    </>
  );
}
```

---

## Features

✅ **Zero Backend** - No database, no API calls, no backend code  
✅ **Automatic Syncing** - Drag-drop images in ImageKit, they appear on site instantly  
✅ **Smart Categories** - Extracts categories from filenames automatically  
✅ **Responsive Images** - ImageKit transforms & optimizes images on-the-fly  
✅ **Loading States** - Beautiful skeleton loader & error handling  
✅ **Lightbox Modal** - Click images to view full-size  
✅ **Filter Tabs** - Dynamic category filtering

---

## Troubleshooting

### Images Not Loading?

1. ✓ Check your `publicKey` and `urlEndpoint` are correctly pasted
2. ✓ Confirm the `/portfolio` folder exists in ImageKit
3. ✓ Ensure images are uploaded to `/portfolio` folder, not root
4. ✓ Open browser console (F12) to check for error messages

### No Categories Appearing?

- Ensure file names follow the convention: `Category - Title.jpg`
- If not using the convention, all images default to "Gallery" category

### Images Load Slowly?

- ImageKit automatically optimizes images, but you can adjust quality in the component
- Look for the `transformation` object in the `ik.url()` call to fine-tune

### Want to Change the Limit (50 images)?

Edit this line in the component:

```javascript
limit: 50, // Change to your desired number
```

---

## Component Props & Customization

The component is self-contained and doesn't require props, but you can modify:

- **Image limit**: Change `limit: 50` to fetch more/fewer images
- **Sort order**: Change `DESC_CREATED` to `DESC_MODIFIED` or other options
- **Image quality**: Adjust `quality: 85` (0-100) in the transformation
- **Folder path**: Change `path: "/portfolio"` to fetch from a different folder

---

## Next Steps

1. ✓ Paste your credentials in the component
2. ✓ Create `/portfolio` folder in ImageKit
3. ✓ Upload test images with naming convention
4. ✓ Run your dev server and watch images appear!

---

## Support

For ImageKit SDK docs: https://docs.imagekit.io/  
For issues: Check browser console (F12) for error messages
