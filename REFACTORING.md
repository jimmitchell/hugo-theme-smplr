# Theme Refactoring Documentation

This document outlines the refactoring work performed on the smplr Hugo theme to improve maintainability, reduce code duplication, and follow best practices.

## Refactoring Summary

**Date:** February 2026
**Total Impact:** ~350+ lines of code eliminated or consolidated
**Files Created:** 3 new partials, 1 new JavaScript module
**Files Deleted:** 3 redundant templates

---

## 1. Date Formatting Partial

### Problem
Date formatting logic with ordinal suffixes (1st, 2nd, 3rd, etc.) was duplicated across three templates:
- `layouts/_default/single.html`
- `layouts/_default/list.html`
- `layouts/index.html`

Each contained identical 6-line blocks for calculating and displaying dates.

### Solution
Created `layouts/partials/formatted-date.html` to centralize this logic.

**Usage:**
```go
<time datetime="{{ .Date.Format "2006-01-02" }}">
    {{- partial "formatted-date.html" .Date -}}
</time>
```

**Benefits:**
- Single source of truth for date formatting
- Easier to modify format site-wide
- Reduced ~18 lines of duplicate code

---

## 2. Archive Template Consolidation

### Problem
Four nearly identical archive templates existed:
- `layouts/archives.html` (older version with inline script)
- `layouts/archives/list.html` (newer version)
- `layouts/_default/archives.html` (simple version without filter)
- `layouts/page/archives.html` (identical to archives/list.html)

This caused confusion and maintenance burden.

### Solution
Consolidated to a single template: `layouts/_default/archives.html`

This template includes:
- Year filter functionality
- Data attributes for filtering
- Fallback content when no posts exist

**Hugo's Template Lookup Order:**
The `_default/archives.html` serves as the fallback for all archive-type pages, following Hugo's template hierarchy.

**Benefits:**
- Eliminated ~178 lines of duplicate code
- Single template to maintain
- Consistent archive experience across all pages

---

## 3. JavaScript Extraction

### Problem
JavaScript was embedded inline in HTML templates:
- Archive year filter script (~11 lines in archives.html)
- Search functionality (~120+ lines in search/list.html)

This violated separation of concerns and prevented proper minification and caching.

### Solution

#### Archive Filter
Moved year filter logic to `assets/js/main.js`:
```javascript
// Archive Year Filter
const yearFilter = document.getElementById('year-filter');
if (yearFilter) {
    yearFilter.addEventListener('change', function() {
        const selectedYear = this.value;
        document.querySelectorAll('.archive-year').forEach(function(year) {
            year.style.display = (selectedYear === 'all' ||
                year.getAttribute('data-year') === selectedYear) ? '' : 'none';
        });
    });
}
```

#### Search Functionality
Created dedicated `assets/js/search.js` module with:
- HTML escaping utilities
- HTML entity decoding
- Search index loading and querying
- Result rendering

The search template now loads this via Hugo's asset pipeline with minification and fingerprinting.

**Benefits:**
- Better separation of concerns
- JavaScript minified and fingerprinted in production
- Improved caching
- Easier to test and maintain
- Eliminated ~131 lines of inline JavaScript

---

## 4. Posts Query Partial

### Problem
The pattern for retrieving posts was duplicated in three files:
```go
{{ $posts := where .Site.RegularPages "Section" "posts" }}
{{ if not $posts }}{{ $posts = .Site.RegularPages }}{{ end }}
```

Found in:
- `layouts/partials/sidebar.html`
- `layouts/index.html`
- `layouts/_default/archives.html`

### Solution
Created `layouts/partials/get-posts.html`:
```go
{{- $posts := where .Site.RegularPages "Section" "posts" -}}
{{- if not $posts -}}
    {{- $posts = .Site.RegularPages -}}
{{- end -}}
{{- return $posts -}}
```

**Usage:**
```go
{{ $posts := partial "get-posts.html" . }}
```

**Benefits:**
- Consistent posts querying logic
- Single place to modify if query logic needs to change
- Reduced ~6 lines of duplicate code

---

## 5. Theme Detection Cleanup

### Problem
Theme detection was duplicated in two places:
1. Inline script in `layouts/partials/head.html` (applies to `document.documentElement`)
2. JavaScript in `assets/js/main.js` (applied to `body`)

This created inconsistency and redundancy.

### Solution
Removed the duplicate from `main.js` (lines 75-92), keeping only the inline script in `head.html`.

**Why keep head.html version:**
The inline script runs immediately before page render to prevent FOUC (Flash of Unstyled Content). It must remain inline and in the `<head>`.

**Benefits:**
- Single source of truth for theme application
- No inconsistency between `documentElement` and `body`
- Eliminated ~18 lines of redundant code
- Faster page load

---

## 6. Code Quality Improvements

### Problem
Unused variable `isMobile` on line 40 of `main.js` that was never referenced.

### Solution
Removed the unused variable. The code only needs `isMobileView` which is properly maintained.

**Benefits:**
- Cleaner code
- No IDE warnings
- Slightly smaller JavaScript bundle

---

## Theme Architecture

### Directory Structure
```
themes/smplr/
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── chroma-xcode-dark.css
│   └── js/
│       ├── main.js         # Menu toggle, archive filter
│       └── search.js       # Search functionality
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     # Base template
│   │   ├── single.html     # Single post
│   │   ├── list.html       # List pages
│   │   └── archives.html   # Archive pages
│   ├── partials/
│   │   ├── head.html           # <head> content
│   │   ├── header.html         # Site header
│   │   ├── footer.html         # Site footer
│   │   ├── sidebar.html        # Sidebar
│   │   ├── scripts.html        # Script loading
│   │   ├── formatted-date.html # Date formatter
│   │   └── get-posts.html      # Posts query
│   ├── search/
│   │   └── list.html       # Search page
│   ├── shortcodes/
│   │   ├── csv-to-table.html
│   │   ├── gist.html
│   │   ├── last_modified.html
│   │   └── yt.html
│   └── index.html          # Homepage
└── static/
    └── fonts/
```

### Key Patterns

#### Partials Usage
All reusable logic should be extracted to partials:
- **Formatting**: `formatted-date.html`
- **Data retrieval**: `get-posts.html`
- **UI components**: `header.html`, `footer.html`, `sidebar.html`

#### JavaScript Organization
- **main.js**: Site-wide functionality (menu, archive filter)
- **search.js**: Feature-specific module (search only)
- **Inline scripts**: Only for FOUC prevention (theme detection)

#### Template Hierarchy
Following Hugo's lookup order:
1. Specific layouts (e.g., `layouts/archives/list.html`)
2. Default layouts (e.g., `layouts/_default/archives.html`)
3. Partials for shared components

### Best Practices

1. **DRY Principle**: If logic appears 2+ times, extract to a partial
2. **Separation of Concerns**: Keep JavaScript in separate files
3. **Performance**: Use Hugo's asset pipeline for minification and fingerprinting
4. **Consistency**: Use partials to ensure uniform behavior
5. **Documentation**: Comment complex logic inline

### Future Improvements

Potential areas for further enhancement:

1. **Local lunr.js**: Bundle lunr.js locally instead of using unpkg.com CDN
2. **Taxonomy partials**: Extract category/tag rendering to partials
3. **CSS organization**: Consider CSS modules or component-based architecture
4. **Testing**: Add integration tests for JavaScript functionality

---

## Migration Notes

If you're updating an existing installation:

1. All existing pages will continue to work
2. Archive pages now use a single template
3. JavaScript is now properly minified in production
4. No configuration changes required

## Maintenance

When making changes to the theme:

1. **Dates**: Modify `layouts/partials/formatted-date.html`
2. **Posts queries**: Modify `layouts/partials/get-posts.html`
3. **Archive filter**: Update JavaScript in `assets/js/main.js`
4. **Search**: Update `assets/js/search.js`
5. **Theme detection**: Only modify inline script in `layouts/partials/head.html`

---

**Last Updated:** February 13, 2026
