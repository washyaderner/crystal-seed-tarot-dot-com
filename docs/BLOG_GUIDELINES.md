# Crystal Seed Tarot Blog Guidelines

## Blog Post Structure
All blog posts on the Crystal Seed Tarot website follow a standardized format to ensure consistency across the site.

### Required Fields
- **Title**: The title of your blog post. Should be clear and descriptive.
- **Slug**: Auto-generated from the title, but can be customized if needed. Used in the URL.
- **Content**: The main body content of your post, written in Markdown format.
- **Excerpt**: A short summary of your post. If not provided, one will be generated automatically.

### Optional Fields
- **Featured Image**: The main image for your post.
- **Publish Date**: When the post should be published. If not specified, uses the creation date.
- **Author Information**: Name and avatar of the author.

## Image Guidelines

### Image Naming Convention
If you're uploading images for your blog posts, please follow this naming convention:
```
/images/Blog-Your-Title-With-Dashes.webp
```

For example, if your blog post is titled "Better Practices for Your Practice", name your image:
```
/images/Blog-Better-Practices-For-Your-Practice.webp
```

### Image Formats
- Primary format: WebP (preferred for better performance)
- Fallback format: JPG

### Image Dimensions
- **Aspect Ratio**: 16:9 (widescreen)
- **Recommended Resolution**: 1200x675 pixels
- **Maximum File Size**: 500KB

## Styling Standards

All blog posts use consistent styling:
- **Title**: Large, bold font (text-4xl/text-5xl)
- **Image Container**: Rounded corners with slight padding
- **Card Style**: Semi-transparent dark background with blur effect
- **Text Colors**: White for main content, purple accents for dates and links

## Markdown Support

The blog supports standard Markdown plus:
- **Headers**: # for main headers, ## for subheaders, etc.
- **Lists**: Both ordered and unordered lists
- **Links**: [Text](URL) format
- **Images**: ![Alt text](image-url) format
- **Bold & Italic**: **bold** and *italic*
- **Code Blocks**: ```language code``` format
- **HTML**: Raw HTML is supported when needed

## SEO Guidelines

Every blog post on Crystal Seed Tarot comes with built-in SEO enhancements:

### Meta Tags
Each blog post automatically generates the following SEO meta tags:
- **Title**: The post title + site name
- **Description**: Clean excerpt of 160 characters
- **Keywords**: Auto-generated from post title and standard tarot terms
- **Canonical URL**: Proper URL structure to prevent duplicate content issues
- **OpenGraph**: Enhanced sharing on Facebook, LinkedIn, etc.
- **Twitter Card**: Enhanced sharing on Twitter
- **Reading Time**: Automatically calculated based on content length

### Structured Data
The blog implements these JSON-LD schemas for enhanced search visibility:
- **BlogPosting**: Full article schema with author, publish date, etc.
- **BreadcrumbList**: Shows hierarchical navigation in search results
- **FAQPage**: For posts that use a question/answer format
- **WebSite**: General site information

### SEO Best Practices
Follow these guidelines for optimal search visibility:
- **Titles**: Keep titles under 60 characters, include primary keyword
- **Headings**: Use proper heading hierarchy (H1, H2, H3)
- **Keywords**: Include natural keywords in your content (no keyword stuffing)
- **Links**: Use descriptive link text, not "click here"
- **Images**: Always include descriptive alt text
- **Content**: Aim for at least 300 words per post, ideally 700+
- **Structure**: Use paragraphs, lists, and headers to make content scannable

## Automatic Features

The system provides several automatic features:
- **Image Selection**: If no featured image is specified, one will be automatically selected based on the post title
- **Excerpt Generation**: If no excerpt is provided, one will be generated from the first paragraph of content
- **Slug Creation**: Generated automatically from the title
- **Fallback Image**: If no matching image is found, a default placeholder will be used
- **Meta Tags**: Properly formatted meta tags are automatically generated
- **Reading Time**: Estimated reading time is calculated based on word count
- **Keywords**: SEO keywords are auto-generated from the post title and content

## Related Posts

The system automatically displays related posts at the bottom of each blog post page. These are selected based on similar content and tags.

## Publishing Workflow

1. Write your content in Markdown format
2. Prepare your featured image following the naming convention
3. Place the image in the `/public/images/` directory
4. Enter your post in the Contentful CMS or create it directly in the codebase
5. Publish the post to make it visible on the site

## Testing Your Post

Always preview your post before publishing to ensure:
- The featured image displays correctly
- All formatting appears as expected
- Links work properly
- Related posts are appropriate
- Meta tags show correctly (use browser inspector or SEO tools)
- Structured data validates (use Google's Structured Data Testing Tool)

For any questions about blog post creation, please refer to the blog component documentation or reach out to the development team. 