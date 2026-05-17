import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		categoryId: z.string(),
		heroImage: z.string().optional(),
		heroImageAlt: z.string().optional(),
		draft: z.boolean().optional(),
	}),
});

const blogCategories = defineCollection({
	loader: glob({ pattern: "*.json", base: "./src/data/blog-categories" }),
	schema: z.object({
		name: z.string(),
		description: z.string(),
	}),
});

export const collections = { blog, blogCategories };
