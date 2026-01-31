// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const siteNav = document.getElementById('site-nav');
    const body = document.body;
    
    function openMenu() {
        siteNav.classList.add('active');
        menuToggle.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        siteNav.classList.remove('active');
        menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        body.style.overflow = '';
    }
    
    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', function() {
            if (siteNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on overlay (outside menu)
        document.addEventListener('click', function(event) {
            if (siteNav.classList.contains('active') && 
                !siteNav.contains(event.target) && 
                !menuToggle.contains(event.target)) {
                closeMenu();
            }
        });
        
        // Handle sub-menu toggle and link clicks using event delegation
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
        let isMobileView = mobileMediaQuery.matches;
        
        // Update mobile state on resize
        mobileMediaQuery.addEventListener('change', function(e) {
            isMobileView = e.matches;
        });
        
        siteNav.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const parentLi = link.closest('li');
            
            // If it's a parent menu item with submenu on mobile, toggle submenu
            if (parentLi && parentLi.classList.contains('has-submenu') && isMobileView) {
                e.preventDefault();
                parentLi.classList.toggle('active');
                return;
            }
            
            // If clicking a submenu link, close the entire menu
            if (parentLi && parentLi.closest('.nav-submenu')) {
                closeMenu();
                return;
            }
            
            // Close menu for top-level links without submenu
            if (!parentLi || !parentLi.classList.contains('has-submenu')) {
                closeMenu();
            }
        });
    }
    
    // Auto-detect and apply system theme preference
    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark');
            body.classList.remove('light');
        } else {
            body.classList.remove('dark');
        }
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(prefersDark.matches);
    
    // Listen for changes to system preference
    prefersDark.addEventListener('change', function(e) {
        applyTheme(e.matches);
    });
});
