# Credits & External Resources

This document provides a comprehensive list of all external resources, libraries, templates, and assets used in the CammyCare Virtual Chameleon Pet Game.

---

## Core Technologies & Frameworks

### React

- **Source:** https://react.dev/
- **Version:** 18.3.1
- **License:** MIT License
- **Documentation:** https://react.dev/learn

### TypeScript

- **Source:** https://www.typescriptlang.org/
- **Version:** 5.6.2
- **License:** Apache License 2.0
- **Copyright:** Microsoft Corporation
- **Usage:** Type-safe JavaScript for improved code quality and developer experience
- **Documentation:** https://www.typescriptlang.org/docs/

### Vite

- **Source:** https://vitejs.dev/
- **Version:** 6.0.5
- **License:** MIT License
- **Copyright:** Evan You and Vite contributors
- **Usage:** Build tool and development server for fast development
- **Documentation:** https://vitejs.dev/guide/

---

## Backend Services

### Firebase

- **Source:** https://firebase.google.com/
- **Version:** 11.2.0
- **License:** Apache License 2.0
- **Copyright:** Google LLC
- **Services Used:**
  - **Firebase Authentication** - User login and signup functionality
  - **Cloud Firestore** - NoSQL database for storing game state and user data
- **Documentation:** https://firebase.google.com/docs

---

## Navigation & Routing

### React Router DOM

- **Source:** https://reactrouter.com/
- **Version:** 7.1.4
- **License:** MIT License
- **Copyright:** Remix Software Inc.
- **Usage:** Client-side routing for navigation between game screens
- **Documentation:** https://reactrouter.com/en/main

---

## Fonts & Typography

### Fredoka Font Family

- **Source:** Google Fonts
- **URL:** https://fonts.google.com/specimen/Fredoka
- **Designer:** Milena Brandão
- **License:** SIL Open Font License 1.1
- **Weights Used:** 400 (Regular), 600 (Semi-Bold), 700 (Bold)
- **Usage:** Headings, buttons, titles, and playful UI elements
- **Import URL:** `https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap`

### Nunito Font Family

- **Source:** Google Fonts
- **URL:** https://fonts.google.com/specimen/Nunito
- **Designer:** Vernon Adams, Cyreal, Jacques Le Bailly
- **License:** SIL Open Font License 1.1
- **Weights Used:** 400 (Regular), 600 (Semi-Bold), 700 (Bold)
- **Usage:** Body text, descriptions, labels, and general UI text
- **Import URL:** `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap`

---

## Audio Assets

### Sound Effects

- **Ding Sound (ding.mp3)**
  - **Source:** [Specify: Created by team / Free sound library / Licensed source]
  - **License:** [Specify license]
  - **Usage:** Played when coins are earned or transactions occur
  - **Location:** `src/assets/ding.mp3`

_Note: If using external audio, please specify the source and ensure proper attribution_

---

## Image Assets

### Chameleon Sprites

All chameleon images located in `src/assets/chameleonImages/`

**Panther Chameleon, Jackson's Chameleon ,Nose-Horned Chameleon :**

- Level 1, 2, 3: Green, Yellow, Brown, Orange variants
- used Adobe Illustrator for drawing the chameleon images and graphics

### UI Icons

- **Left Arrow (left-arrow.png)**
  - **Source:** [https://www.clipartmax.com/middle/m2i8m2H7i8K9d3i8_circle-with-an-arrow-pointing-to-left-comments-portrait-of-a-man/]
- **Right Arrow (right-arrow.png)**
  - **Source:** [https://www.clipartmax.com/middle/m2i8m2H7i8K9d3i8_circle-with-an-arrow-pointing-to-left-comments-portrait-of-a-man/]
- **Play Button (play-button.png)**
  - **Source:** [https://www.clipartmax.com/middle/m2i8N4b1N4K9Z5Z5_human-rights-watch-icono-de-reproducir/]

---

## NPM Packages & Dependencies

### Development Dependencies

#### @vitejs/plugin-react

- **Version:** ^4.3.4
- **License:** MIT
- **Purpose:** Vite plugin for React support

#### TypeScript ESLint

- **Package:** @typescript-eslint/eslint-plugin
- **Version:** ^8.20.0
- **License:** MIT
- **Purpose:** TypeScript-specific linting rules

#### ESLint

- **Version:** ^9.17.0
- **License:** MIT
- **Purpose:** Code linting and quality enforcement

#### Vite Plugin Checker

- **Version:** ^0.8.0
- **License:** MIT
- **Purpose:** TypeScript type checking during development

---

## CSS Techniques & Inspiration

### Animation & Transitions

- **CSS Cubic Bezier Easing:** Standard CSS timing functions
- **Flexbox & Grid Layout:** CSS3 layout modules
- **CSS Variables:** Custom properties for theming

### Color Palette

- **Blue Background:** #3488cd (custom)
- **Green Primary:** #1FCC1F, #33cc53 (custom)
- **Health Bar Colors:**
  - Energy: #FFD700 (Gold)
  - Hunger: #FF8C42 (Orange)
  - Happiness: #FF69B4 (Pink)
  - Health: #FF4444 (Red)
  - Hydration: #4DA6FF (Blue)

---

## Educational Resources & Learning Materials

### Documentation References

- **React Documentation:** https://react.dev/learn
- **Firebase Guides:** https://firebase.google.com/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/
- **CSS-Tricks:** https://css-tricks.com/
- **Stack Overflow:** https://stackoverflow.com/

### Tutorials & Guides

- React useState Hook Documentation
- React useEffect Hook Documentation
- React Context API Documentation
- Firebase Authentication Guide
- Firestore Database Guide
- TypeScript with React Guide

---

## Development Tools

### Code Editor

- **Visual Studio Code**
  - **Publisher:** Microsoft Corporation
  - **License:** MIT License
  - **URL:** https://code.visualstudio.com/

### Browser DevTools

- Chrome DevTools
- Firefox Developer Tools

### Version Control

- **Git:** https://git-scm.com/
- **GitHub:** https://github.com/

---

## Code Templates & Snippets

### React Component Structure

- Basic functional component pattern from React documentation
- Custom hooks pattern from React documentation

### Firebase Integration

- Authentication setup based on Firebase documentation
- Firestore CRUD operations based on Firebase documentation

---

### Community Resources

- React Community - Support and best practices
- Firebase Community - Implementation guidance
- Stack Overflow Contributors - Problem-solving assistance

---

## License Compliance

This project complies with all licenses of the external resources used:

- **MIT Licensed Resources:** Used in accordance with MIT License terms (attribution provided)
- **Apache 2.0 Licensed Resources:** Used in accordance with Apache License terms
- **Open Font License Resources:** Fonts used in accordance with SIL OFL 1.1
- **Custom Assets:** [Specify ownership and usage rights]

---

## Attribution Statement

This project uses several open-source libraries and resources. We are grateful to all the developers and creators who have made their work available for educational and commercial use. All external resources are credited above with proper attribution.

If you believe any attribution is missing or incorrect, please contact us at [samriddhik1010@gmail.com] or [aag.vlogger@gmail.com].

---

## Questions About Credits

If you have questions about any of the resources listed here or need more information about licensing, please refer to the respective documentation links or contact the project maintainers.
