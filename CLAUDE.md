# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Vietnamese language Rust book built with mdBook - a comprehensive resource for learning Rust programming in Vietnamese. The book covers fundamental concepts through advanced topics and practical examples.

## Development Commands

### Local Development
```bash
# Start development server (auto-installs dependencies)
./dev.sh

# Start with custom port
./dev.sh 3001

# Manual setup and serve
cargo install mdbook mdbook-linkcheck
mdbook serve --open --port 3000
```

### Building the Book
```bash
# Build the book for production
mdbook build

# Check links
mdbook-linkcheck
```

### Testing
```bash
# Test Rust code examples in the book
mdbook test

# Run tests for specific chapter
mdbook test src/basic/
```

## Architecture & Structure

### Content Organization
- **`src/`** - All book content in Markdown format
  - **`SUMMARY.md`** - Table of contents defining book structure
  - **`basic/`** - Fundamental Rust concepts (variables, ownership, structs, traits, enums)
  - **`advanced/`** - Advanced topics (smart pointers, async programming)
  - **`crates/`** - Popular crate documentation and examples
  - **`design-pattern/`** - Rust design patterns and idioms
  - **`data-engineering/`** - Data processing and analysis with Rust
  - **`getting-started/`** - Installation and first project guides

### Key Configuration Files
- **`book.toml`** - mdBook configuration with Vietnamese language settings
- **`dev.sh`** - Development script with auto-dependency installation
- **`src/lib.rs`** - Minimal Rust file for GitHub language detection

### Content Structure Patterns
1. **Hierarchical Topics** - Each major concept has its own directory with README.md
2. **Progressive Complexity** - Basic → Advanced → Specialized topics
3. **Practical Examples** - Rust code files (`.rs`) embedded in chapters
4. **Vietnamese Language** - All content in Vietnamese with technical terms explained

### Build System
- **mdBook** - Static site generator for technical documentation
- **GitHub Actions** - Automated deployment to GitHub Pages
- **Link Checking** - Validates all links in the book content

## Development Workflow

### Adding New Content
1. Create/update Markdown files in `src/` directory
2. Update `src/SUMMARY.md` if adding new chapters
3. Include practical Rust code examples where appropriate
4. Test locally with `./dev.sh` before committing

### Content Guidelines
- Write in Vietnamese with clear explanations
- Include runnable Rust code examples
- Use consistent formatting and terminology
- Link to related concepts within the book

### CI/CD Pipeline
- **PR Builds** - Every PR builds the book and checks links
- **Deployment** - Main branch automatically deploys to GitHub Pages
- **Sitemap Generation** - Automatically generates sitemap for SEO
- **Link Validation** - mdbook-linkcheck validates all external links

## Book-Specific Considerations

### Language and Localization
- Primary language: Vietnamese (`vi`)
- Technical terms include both Vietnamese and English
- Code examples use English variable names with Vietnamese comments

### Content Validation
- All Rust code examples should compile and run
- Links should be validated with mdbook-linkcheck
- Vietnamese grammar and terminology should be consistent

### Performance
- Static site generation allows fast loading
- GitHub Pages provides reliable hosting
- Responsive design for mobile and desktop reading