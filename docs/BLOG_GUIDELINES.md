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

## Automatic Features

The system provides several automatic features:
- **Image Selection**: If no featured image is specified, one will be automatically selected based on the post title
- **Excerpt Generation**: If no excerpt is provided, one will be generated from the first paragraph of content
- **Slug Creation**: Generated automatically from the title
- **Fallback Image**: If no matching image is found, a default placeholder will be used

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

For any questions about blog post creation, please refer to the blog component documentation or reach out to the development team. 