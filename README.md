# smplr - A Simple and Minimalistic Hugo Theme

A clean, minimalistic Hugo theme with dark mode support, mobile-responsive design, and pagination.

## Features

- ✨ Simple and minimalistic design
- 📱 Mobile responsive with slide-in menu
- 🌙 Light and dark mode support
- 📄 Pagination for posts (15 posts per page)
- 📅 Archive organized by year and month
- 🎨 Clean typography and spacing

## Installation

1. Add the theme to your Hugo site:

```bash
git submodule add https://github.com/yourusername/hugo-theme-smplr themes/smplr
```

Or clone directly:

```bash
git clone https://github.com/yourusername/hugo-theme-smplr themes/smplr
```

2. Add the theme to your `config.toml`:

```toml
theme = "smplr"
```

## Configuration

### Basic Configuration

Add these settings to your `config.toml`:

```toml
baseURL = "https://yoursite.com"
title = "Your Site Title"
theme = "smplr"

[params]
  description = "Your site description"
```

### Menu Configuration

Add a menu in your `config.toml`:

```toml
[[menu.main]]
  name = "Home"
  url = "/"
  
[[menu.main]]
  name = "About"
  url = "/about"
```

### Pagination

The theme displays 15 posts per page by default. This is configured in `layouts/index.html`. You can modify the number by editing:

```go
{{ $paginator := .Paginate (where .Site.RegularPages "Type" "posts") 15 }}
```

Change `15` to your desired number.

## Content Structure

### Posts

Create posts in the `content/posts/` directory:

```bash
hugo new posts/my-first-post.md
```

### Home Page

The home page (`content/_index.md`) will display:
- Your custom content (if any)
- Latest 15 posts with pagination
- Archive organized by year and month

## Customization

### Colors

Edit `static/css/main.css` and modify the CSS variables:

```css
:root {
    --bg-color: #ffffff;
    --text-color: #333333;
    --accent-color: #0066cc;
    /* ... */
}
```

### Dark Mode

Dark mode is automatically supported.

## License

MIT License - feel free to use this theme for your projects.
