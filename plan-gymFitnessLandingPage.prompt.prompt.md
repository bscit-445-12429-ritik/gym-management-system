## Plan: Gym & Fitness Landing Page

Create a responsive, dark-themed single-page gym landing page using pure HTML, CSS, and vanilla JavaScript. The design will use a black and dark gray color palette with striking red accents. It will feature smooth scrolling, a sticky navbar, and modular sections using placeholder images and FontAwesome icons to ensure it looks professional immediately.

**Steps**
1. **Project Setup**: Create the foundational files: `index.html`, `styles.css`, and `script.js`. In the HTML `<head>`, link Google Fonts (Poppins for bold headings, Roboto for readable body text) and the FontAwesome CDN for icons.
2. **Header & Sticky Navbar**: Implement a `<header>` containing the gym logo, navigation anchor links (`#home`, `#about`, etc.), and a highlighted "Join Now" button. 
3. **Hero Section (`#home`)**: Build a full-height section with a dark-overlay background image (using an Unsplash fitness placeholder). Include the main headline "Transform Your Body, Transform Your Life", supporting text, and two CTA buttons ("Join Now" in red, "View Programs" outlined).
4. **About Section (`#about`)**: Create a two-column layout using CSS Flexbox or Grid. Place the introduction text, experience details, and equipment mentions on one side, and a relevant fitness image on the other.
5. **Programs Section (`#programs`)**: Use CSS Grid to display 4–6 program cards (Strength Training, Cardio, Yoga, etc.). Style each card with a dark gray background, a red FontAwesome icon, title, description, and a smooth hover effect (e.g., slight upward translation and red border highlight).
6. **Trainers Section (`#trainers`)**: Implement a grid of trainer profile cards. Each card will feature a placeholder headshot, name, and specialization, styled with clean typography.
7. **Pricing Section (`#pricing`)**: Create 3 membership tier cards (Basic, Standard, Premium). Visually highlight the "Standard" (recommended) plan by scaling it slightly larger and applying the red accent color to its borders and primary button.
8. **Testimonials & CTA Sections**: Add a `#testimonials` section featuring client review cards with star icons and small avatar images. Follow this with a high-impact `#cta` banner section containing motivational text and a "Start Your Fitness Journey" button.
9. **Contact & Footer (`#contact`)**: Build a split-layout contact section with a functional-looking HTML form on the left and gym information (location, phone, hours) on the right. Conclude with a `<footer>` containing social media icon links and copyright text.
10. **JavaScript Interactivity**: In `script.js`, implement an event listener on the `window` scroll event to toggle a "scrolled" class on the navbar for the sticky effect. Add logic for a mobile hamburger menu toggle and ensure smooth scrolling for all navigation links.

**Verification**
- Open `index.html` in a modern web browser.
- Resize the window or use Developer Tools to verify mobile and tablet responsiveness (especially the grid layouts and mobile menu).
- Scroll down the page to ensure the navbar becomes sticky and the background transitions smoothly.
- Click navigation links to test smooth scrolling behavior.

**Decisions**
- **Styling**: Pure CSS with Flexbox and Grid will be used instead of a framework to keep the project lightweight and strictly adhere to the "HTML, CSS, and JS" requirement.
- **Assets**: Unsplash Source URLs will be used for placeholder imagery so the layout can be visualized immediately without needing local image files.
- **Icons & Fonts**: FontAwesome (via CDN) and Google Fonts (Poppins/Roboto) are chosen as sensible defaults for a modern, aggressive fitness aesthetic.
