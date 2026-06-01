import { createImageUrlBuilder } from "@sanity/image-url";

import { sanityClient } from "./client";
import type { SanityImage } from "./types";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(image: SanityImage) {
  return builder.image(image);
}

export function optimizedImageUrl(
  image: SanityImage | undefined,
  width: number,
  height?: number,
) {
  if (!image?.asset?._ref) return "";
  const source = urlFor(image).width(width).auto("format").quality(85);
  return height ? source.height(height).fit("max").url() : source.url();
}
