import { defineField, defineType } from "sanity";

export default defineType({
  name: "pageHome",
  type: "document",
  title: "Home Page",
  fields: [
    defineField({
      name: "heroTitle",
      type: "string",
      title: "Hero Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      type: "text",
      title: "Hero Subtitle",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta",
      type: "string",
      title: "CTA Label",
      description: "Primary hero button label (links to /features)",
    }),
    defineField({
      name: "features",
      type: "array",
      title: "Featured Features",
      of: [{ type: "reference", to: [{ type: "feature" }] }],
    }),
    defineField({
      name: "testimonials",
      type: "array",
      title: "Featured Testimonials",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),
  ],
  preview: {
    select: {
      title: "heroTitle",
      subtitle: "heroSubtitle",
    },
  },
});
