# crystal-seed-tarot-dot-com


A Cursor-powered AI development environment with advanced agentic capabilities.


## Quick Start

1. Activate the virtual environment:
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

2. Configure your environment:
   - Copy `.env.example` to `.env` if you haven't already
   - Add your API keys in `.env` (optional)

## Available Tools

Your project includes several powerful tools in the `tools/` directory:

### LLM Integration
```python
from tools.llm_api import query_llm

# Use LLM for assistance
response = query_llm(
    "Your question here",
    provider="anthropic"  # Options: openai, anthropic, azure_openai, deepseek, gemini
)
print(response)
```

### Web Scraping
```python
from tools.web_scraper import scrape_urls

# Scrape web content
results = scrape_urls(["https://example.com"], max_concurrent=3)
```

### Search Engine
```python
from tools.search_engine import search

# Search the web
results = search("your search keywords")
```


### Screenshot Verification
```python
from tools.screenshot_utils import take_screenshot_sync
from tools.llm_api import query_llm

# Take and analyze screenshots
screenshot_path = take_screenshot_sync('https://example.com', 'screenshot.png')
analysis = query_llm(
    "Describe this webpage",
    provider="openai",
    image_path=screenshot_path
)
```

Note: When you first use the screenshot verification feature, Playwright browsers will be installed automatically.


## AI Assistant Configuration


This project uses `.cursorrules` to configure the AI assistant. The assistant can:
- Help with coding tasks
- Verify screenshots
- Perform web searches
- Analyze images and code


## Environment Variables

Configure these in your `.env` file:

- `LLM_API_KEY`: Your LLM API key (optional)
- `AZURE_OPENAI_API_KEY`: Azure OpenAI API key (optional)
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI endpoint (optional)
- `AZURE_OPENAI_MODEL_DEPLOYMENT`: Azure OpenAI model deployment name (optional)
- `SILICONFLOW_API_KEY`: Siliconflow API key (optional)
Note: Basic functionality works without API keys. Advanced features (like multimodal analysis) require appropriate API keys.

## Development Tools

- `.devcontainer/`: VS Code development container configuration
- `.vscode.example/`: Recommended VS Code settings
- `.github/`: CI/CD workflows

## Deployment

This Next.js website is set up to be deployed on platforms like Vercel, Netlify, or any service that supports Next.js deployments.

### Important: Contentful Configuration for Production

The blog system relies on Contentful as a headless CMS. For production deployments, you **must** configure the following environment variables:

```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

Without these environment variables, the blog section will not display any posts in production environments. The application has built-in safeguards that will:

1. Show mock blog data in development environments for convenience
2. Return empty arrays/null values in production when Contentful credentials are missing
3. Log errors to the console when Contentful cannot be reached

#### Setting Environment Variables

- **Vercel**: Add environment variables in your project settings
- **Netlify**: Configure environment variables in the build settings
- **Other platforms**: Refer to platform documentation for setting environment variables

### Testing Your Deployment

After deploying, verify that:

1. The blog page loads and displays your Contentful posts
2. Individual blog posts can be accessed
3. Related posts are displayed correctly

If you see an empty blog page in production, check your deployment logs for Contentful connection errors.

## License

MIT License