import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blogCategories = defineCollection({
	loader: glob({ pattern: "*.json", base: "./src/data/blog-categories" }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
	}),
});

export const collections = { blogCategories };
