export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  siteTitle,
  logo,
  metaDescription,
  navLinks
}`;

export const homePageHeroQuery = `*[_type == "pageHome"][0]{
  _id,
  _type,
  heroTitle,
  heroSubtitle,
  cta
}`;

export const allFeaturesQuery = `*[_type == "feature"] | order(title asc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  description,
  icon,
  category
}`;

export const featuredFeaturesQuery = `*[_type == "feature" && defined(category)] | order(_createdAt desc) [0...6] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  description,
  icon,
  category
}`;

export const allPricingTiersQuery = `*[_type == "pricingTier"] | order(monthlyPrice asc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  monthlyPrice,
  yearlyPrice,
  features,
  buttonLabel,
  popular
}`;

export const allTestimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  company,
  quote,
  avatar,
  rating
}`;

export const featuredTestimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc) [0...3] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  company,
  quote,
  avatar,
  rating
}`;

export const allIntegrationsQuery = `*[_type == "integration"] | order(sortOrder asc, name asc) {
  _id,
  _type,
  name,
  href,
  logo,
  sortOrder
}`;

export const authorBySlugQuery = `*[_type == "author" && slug.current == $slug][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  slug,
  photo,
  bio
}`;

export const allAuthorsQuery = `*[_type == "author"] | order(name asc) {
  _id,
  _type,
  name,
  slug,
  photo,
  bio
}`;

export const blogPostsQuery = `*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  tags
}`;

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug && defined(publishedAt)][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  content,
  tags
}`;

// Includes drafts (no publishedAt filter) for preview mode.
export const blogPostBySlugPreviewQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  content,
  tags
}`;

// Includes drafts for preview mode.
export const blogPostsPaginatedPreviewQuery = `*[_type == "blogPost"] | order(_updatedAt desc, publishedAt desc) [$start...$end] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  tags
}`;

export const blogPostsPaginatedQuery = `*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) [$start...$end] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  tags
}`;

export const blogPostsByTagQuery = `*[_type == "blogPost" && defined(publishedAt) && $tag in tags] | order(publishedAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  tags
}`;

// Matches title, portable-text children, and tags.
export const blogPostsSearchQuery = `*[_type == "blogPost" && defined(publishedAt) && (
  title match $searchTerm ||
  excerpt match $searchTerm ||
  pt::text(content) match $searchTerm ||
  $searchTerm in tags
)] | order(publishedAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "author": author->{
    _id,
    name,
    slug,
    photo,
    bio
  },
  publishedAt,
  updatedAt,
  coverImage,
  excerpt,
  tags
}`;

export const blogPostsSearchCountQuery = `count(*[_type == "blogPost" && defined(publishedAt) && (
  title match $searchTerm ||
  excerpt match $searchTerm ||
  pt::text(content) match $searchTerm ||
  $searchTerm in tags
)])`;

export const allBlogTagsQuery = `array::unique(*[_type == "blogPost" && defined(publishedAt)].tags[] | order(@ asc))`;

export const blogPostCountQuery = `count(*[_type == "blogPost" && defined(publishedAt)])`;

// Admin list/detail: includes drafts and unpublished docs.
export const allBlogPostsAdminQuery = `*[_type == "blogPost"] | order(_updatedAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  "authorName": author->name,
  publishedAt,
  excerpt,
  tags
}`;

export const blogPostByIdAdminQuery = `*[_type == "blogPost" && _id == $id][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  author,
  publishedAt,
  updatedAt,
  excerpt,
  content,
  tags
}`;

export const allCaseStudiesQuery = `*[_type == "caseStudy"] | order(_createdAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  client,
  summary,
  logo,
  image,
  body,
  outcomes
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  client,
  summary,
  logo,
  image,
  body,
  outcomes
}`;

export const allCaseStudySlugsQuery = `*[_type == "caseStudy" && defined(slug.current)]{
  "slug": slug.current
}`;

export const caseStudyByIdQuery = `*[_type == "caseStudy" && _id == $id][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  client,
  summary,
  logo,
  image,
  body,
  outcomes
}`;

export const allDocPagesQuery = `*[_type == "docPage"] | order(category asc, order asc, title asc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  category,
  order,
  content,
  "parent": parent->{
    _id,
    title,
    slug
  }
}`;

export const docPageBySlugQuery = `*[_type == "docPage" && slug.current == $slug][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  category,
  order,
  content,
  "parent": parent->{
    _id,
    title,
    slug
  }
}`;

export const docPagesByCategoryQuery = `*[_type == "docPage" && category == $category] | order(order asc, title asc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  category,
  order,
  "parent": parent->{
    _id,
    title,
    slug
  }
}`;

export const docsSearchQuery = `*[_type == "docPage" && (
  title match $searchTerm ||
  pt::text(content) match $searchTerm ||
  category match $searchTerm
)] | order(category asc, title asc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  category,
  order,
  content,
  "parent": parent->{
    _id,
    title,
    slug
  }
}`;

export const docsSearchCountQuery = `count(*[_type == "docPage" && (
  title match $searchTerm ||
  pt::text(content) match $searchTerm ||
  category match $searchTerm
)])`;

export const docNavigationQuery = `*[_type == "docPage"] | order(category asc, order asc, title asc) {
  _id,
  title,
  slug,
  category,
  order,
  "parent": parent->{
    _id,
    title,
    slug
  }
}`;

// Slugs + updatedAt for dynamic sitemap entries.
export const sitemapEntriesQuery = `{
  "blogPosts": *[_type == "blogPost" && defined(publishedAt)]{
    "slug": slug.current,
    "updatedAt": coalesce(updatedAt, publishedAt, _updatedAt)
  },
  "docPages": *[_type == "docPage"]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  },
  "caseStudies": *[_type == "caseStudy" && defined(slug.current)]{
    "slug": slug.current,
    "updatedAt": _updatedAt
  }
}`;

export const allBlogSlugsQuery = `*[_type == "blogPost" && defined(publishedAt)]{
  "slug": slug.current
}`;

export const allDocSlugsQuery = `*[_type == "docPage"]{
  "slug": slug.current
}`;

export const allContactSubmissionsQuery = `*[_type == "contactSubmission"] | order(submittedAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  email,
  company,
  message,
  submittedAt,
  status
}`;

export const contactSubmissionByIdQuery = `*[_type == "contactSubmission" && _id == $id][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  email,
  company,
  message,
  submittedAt,
  status
}`;

export const contactSubmissionsByStatusQuery = `*[_type == "contactSubmission" && status == $status] | order(submittedAt desc) {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  name,
  email,
  company,
  message,
  submittedAt,
  status
}`;

export const docPageBySlugPreviewQuery = `*[_type == "docPage" && slug.current == $slug][0] {
  _id,
  _type,
  _createdAt,
  _updatedAt,
  title,
  slug,
  category,
  order,
  content,
  "parent": parent->{
    _id,
    title,
    slug
  }
}`;
