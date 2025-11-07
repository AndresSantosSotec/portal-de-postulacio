# Planning Guide

A comprehensive job portal platform that enables users to search for employment opportunities across all industries, manage their professional profile and curriculum, track applications, save favorite jobs, and receive job alerts - inspired by Computrabajo.

**Experience Qualities**:
1. **Professional** - The interface should feel trustworthy and credible, instilling confidence in users that this is a serious platform for career advancement
2. **Efficient** - Users should be able to quickly search, filter, and apply to jobs without friction, with clear navigation between key features
3. **Empowering** - The platform should make users feel in control of their job search with robust tools for profile management, tracking, and personalization

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - This is a full-featured job portal with user authentication, profile/resume management, application tracking, favorites system, alerts, and multi-category job browsing capabilities

## Essential Features

### User Authentication & Login
- **Functionality**: Secure login/registration system that persists user sessions
- **Purpose**: Enable personalized features like applications, favorites, alerts, and profile management
- **Trigger**: User clicks "Login" or "Register" button in navbar
- **Progression**: Click login → Modal appears → Enter credentials or register → Validation → Dashboard access
- **Success criteria**: Users can create accounts, log in/out, and their session persists across page refreshes

### User Profile & Curriculum Builder
- **Functionality**: Comprehensive profile with personal info, work experience, education, skills, and downloadable curriculum
- **Purpose**: Allow users to showcase their qualifications and maintain an up-to-date professional profile
- **Trigger**: User accesses "Mi curriculum" from navigation
- **Progression**: Click curriculum → View/edit mode → Add sections (experience, education, skills) → Save → Preview/download
- **Success criteria**: Users can create complete profiles, edit all sections, and have their data persist

### Job Listings with Category Filtering
- **Functionality**: Browse jobs across multiple categories (not just software) with search and filter capabilities
- **Purpose**: Help users discover relevant opportunities across all industries
- **Trigger**: User lands on homepage or clicks "Mi área" 
- **Progression**: View listings → Filter by category/location → See results update → Click job for details
- **Success criteria**: Jobs display in organized grid, filters work instantly, categories cover diverse industries

### Job Application System
- **Functionality**: Apply to jobs and track application status (Applied, CV Viewed, In Process, Finalist, Finalized)
- **Purpose**: Streamline the application process and provide transparency on application progress
- **Trigger**: User clicks "Apply" on job detail page
- **Progression**: View job → Click apply → Confirm application → Added to "Mis postulaciones" → Track status changes
- **Success criteria**: Applications are saved, status updates reflect in user portal, all applications are viewable

### Favorites System
- **Functionality**: Save interesting jobs to review later
- **Purpose**: Allow users to bookmark opportunities without committing to apply immediately
- **Trigger**: User clicks heart/favorite icon on job card or detail page
- **Progression**: Browse jobs → Click favorite icon → Visual confirmation → Job saved to "Mis favoritos"
- **Success criteria**: Favorites persist, can be added/removed easily, accessible from dedicated section

### Job Alerts & Notifications
- **Functionality**: Set up alerts for specific job types/categories and receive notifications
- **Purpose**: Keep users informed of new relevant opportunities without constant searching
- **Trigger**: User configures alert criteria in "Mis alertas" section
- **Progression**: Go to alerts → Set criteria (category, location, keywords) → Save → Receive notifications badge
- **Progression**: Notification appears → Click to view → See matching jobs
- **Success criteria**: Alerts can be created/edited/deleted, notification count displays, users can view alert-matched jobs

## Edge Case Handling
- **Unauthenticated Actions**: When non-logged-in users try to apply/favorite, show login modal with clear messaging
- **Empty States**: When users have no applications/favorites/alerts, show helpful illustrations and CTAs to get started
- **Invalid Profile Data**: Form validation prevents submission of incomplete required fields with clear error messages
- **Application Duplicates**: Prevent users from applying to same job twice with visual indicator "Already Applied"
- **Network Errors**: Graceful error handling with retry options and user-friendly messages

## Design Direction
The design should feel professional and trustworthy like established job portals (LinkedIn, Indeed, Computrabajo) while maintaining a clean, modern aesthetic. It should balance information density with breathing room - users need to scan many jobs quickly but not feel overwhelmed. The interface should feel efficient and action-oriented with clear CTAs, while the profile/curriculum sections should feel more spacious and allow for thoughtful content creation.

## Color Selection
**Complementary (opposite colors)** - Using a professional blue as primary with warm accent colors to create visual interest and draw attention to important actions.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.12 250)) - Communicates trust, stability, and professionalism - the foundation of career services
- **Secondary Colors**: 
  - Neutral Gray (oklch(0.55 0.02 250)) - Supporting color for less prominent UI elements and text
  - Light Background (oklch(0.98 0.005 250)) - Soft off-white for cards and sections
- **Accent Color**: Energetic Teal (oklch(0.60 0.14 195)) - Highlight color for CTAs, active states, and progress indicators that feels modern and action-oriented
- **Foreground/Background Pairings**:
  - Background (Light Cream oklch(0.99 0.005 85)): Dark Gray text (oklch(0.25 0.01 250)) - Ratio 13.2:1 ✓
  - Card (White oklch(1 0 0)): Primary text (oklch(0.25 0.01 250)) - Ratio 14.1:1 ✓
  - Primary (Deep Blue oklch(0.45 0.12 250)): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Secondary (Neutral Gray oklch(0.55 0.02 250)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Accent (Energetic Teal oklch(0.60 0.14 195)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Muted (Light Gray oklch(0.95 0.005 250)): Muted text (oklch(0.45 0.01 250)) - Ratio 7.8:1 ✓

## Font Selection
The typography should feel modern, highly legible, and professional - conveying competence without stuffiness. **Inter** is ideal as it's designed for excellent screen readability and has a professional yet approachable character that works across all content types from job titles to body text.

- **Typographic Hierarchy**:
  - H1 (Main Page Titles): Inter Bold / 32px / -0.02em letter spacing / 1.2 line height
  - H2 (Section Headers): Inter Semibold / 24px / -0.01em / 1.3 line height
  - H3 (Job Titles, Card Headers): Inter Semibold / 18px / normal / 1.4 line height
  - Body (Job descriptions, profile text): Inter Regular / 15px / normal / 1.6 line height
  - Small (Metadata, dates, locations): Inter Medium / 13px / normal / 1.4 line height
  - Button Text: Inter Semibold / 14px / normal

## Animations
Animations should feel purposeful and efficient - reinforcing actions without slowing users down. The motion language should be crisp and responsive, with quick transitions that provide feedback without demanding attention. Think: professional efficiency over playful delight.

- **Purposeful Meaning**: 
  - Card hover elevations suggest interactivity
  - Application status transitions show progress
  - Modal entrances/exits maintain spatial context
  - Loading states prevent perceived delays
  
- **Hierarchy of Movement**:
  - Primary: Application submissions, login/logout transitions (300ms)
  - Secondary: Filter updates, tab switches (200ms)  
  - Tertiary: Hover states, tooltips (150ms)

## Component Selection
- **Components**:
  - **Dialog**: Login/register modal, application confirmation dialogs
  - **Card**: Job listings, application cards, profile sections - with hover:shadow-lg
  - **Tabs**: Switching between "Mis postulaciones" states (All, Applied, CV Viewed, In Process)
  - **Input, Textarea, Select**: Profile forms, job search, filter controls - with focus:ring-2
  - **Button**: Primary (Apply, Save), Secondary (Edit, Cancel), Ghost (Favorites) - distinct visual weights
  - **Badge**: Job categories, application status, notification count - using variant colors
  - **Avatar**: User profile display in navbar
  - **Separator**: Visual breaks between sections
  - **ScrollArea**: Long job descriptions, application lists
  - **Accordion**: Collapsible profile sections (Experience, Education, Skills)
  
- **Customizations**:
  - Job card component with integrated favorite button, status badge, and company logo
  - Application timeline component showing status progression
  - Curriculum preview/download component
  - Category filter grid with icon + label
  
- **States**:
  - Buttons: Subtle background shift on hover, pressed state with slight scale, disabled with opacity-50
  - Inputs: Border color change on focus with ring, error state with red border, success with green
  - Job cards: Elevation increase on hover, subtle border highlight on active
  - Favorite icon: Filled heart when active with color transition
  
- **Icon Selection**:
  - Briefcase: Job listings
  - User: Profile
  - Heart: Favorites
  - Bell: Alerts/notifications
  - PaperPlane: Applications
  - MagnifyingGlass: Search
  - Funnel: Filters
  - Download: CV download
  - Plus: Add new entries
  - Pencil: Edit
  
- **Spacing**:
  - Container max-width: 1280px (max-w-7xl)
  - Section padding: py-8 px-4 md:px-6
  - Card padding: p-6
  - Grid gaps: gap-6 for cards, gap-4 for forms
  - Button padding: px-6 py-2.5
  
- **Mobile**:
  - Stack navigation tabs vertically on mobile with full-width buttons
  - Job cards switch from grid to single column
  - Filter panel becomes drawer from bottom
  - Reduce font sizes: H1 to 24px, H2 to 20px, Body to 14px
  - Touch-friendly targets minimum 44px
  - Navbar collapses to hamburger menu with user avatar
