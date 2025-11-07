# Planning Guide

**Computrabajo - Portal de Empleos** is a comprehensive job portal application that enables users to discover job opportunities, manage applications, and receive real-time notifications about their application status. The platform emphasizes transparency, professional aesthetics, and user engagement through modern design patterns.

**Experience Qualities**:

- **Professional Trust**: Clean, corporate design with deep blue primary colors that communicate stability and reliability, making users feel confident in the platform's legitimacy.
- **Responsive Efficiency**: Smooth transitions and instant feedback that respect users' time - every interaction feels purposeful and quick without unnecessary delays.
- **Proactive Communication**: Real-time notifications and status updates that keep users informed about their application progress, reducing anxiety and improving transparency.

**Complexity Level**: Complex Application (advanced functionality, accounts)
  - Full user authentication with persistent sessions, comprehensive profile management with CV builder, real-time notification system for application status changes, favorites and alerts system, and multi-category job browsing across all industries.
## Essential Features

### Real-Time Notification System
- **Functionality**: Automatic notifications when application status changes, displayed in navbar dropdown and dedicated notifications panel
- **Purpose**: Keep users informed about their application progress without requiring them to constantly check
- **Trigger**: Application status changes (postulado → cv-visto → en-proceso → finalista → proceso-finalizado)
- **Progression**: Status changes → Notification created → Toast appears → Badge in navbar → View in dropdown or panel → Mark as read
- **Success criteria**: Users receive instant notifications for status changes, can view notification history, and mark notifications as read

### User Authentication & Login
- **Functionality**: Secure login/register modal with form validation
- **Purpose**: Enable personalized experience and track user applications

### Job Listings with Category 
- **Purpose**: Help users discover relevant opportunities across all industries
- **Progression**: View listings → Filter by category/location → See results update → Click job for deta

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
- **Functionality**: Apply to jobs, track application status through multiple stages
- **Purpose**: Streamline the job application process with clear status tracking
- **Trigger**: Click "Aplicar" on job detail page
- **Progression**: View job → Click apply → Confirm application → Track status → Receive notifications
- **Success criteria**: Applications are tracked, status updates trigger notifications, users can withdraw applications

## Edge Case Handling
## Edge Case Handling

- **Unauthenticated Actions**: Users must log in to apply for jobs, favorite listings, or view notifications
- **No Notifications**: Empty state with friendly message when user has no notifications yet
- **Invalid Profile Data**: Form validation prevents submission of incomplete required fields with clear error messages
- **Network Errors**: Graceful error handling with retry options and user-friendly messages
- **Concurrent Status Changes**: Notification system handles multiple status changes smoothly with proper ordering

## Design Direction
- **Primary Color**: Deep Professional Blue (oklch(0.45 0.12 250)) - Communicates trust, sta
  - Neutral Gray (oklch(0.55 0.02 250)) - Supporting color for less promi
- **Accent Color**: Energetic Teal (oklch(0.60 0.14 195)) - Highlight color for CTAs, active states, and 
  - Background (Light Cream oklch(0.99 0.005 85)): Dark Gray text (oklch(0.25 0.01 250)) - Ratio 13.2:1 ✓

  - Accent (Energetic Teal okl

The typography should feel modern, highly legible, and professional - conveying competence 
- **Typographic Hierarchy**:
  - H2 (Section Headers): Inter Semibold / 24px / -0.01em / 1.3 line height
  - Body (Job descriptions, profile text): Inter Regular / 15px / normal / 
  - Button Text: Inter Semibold / 14px / normal


  - Card hover elevations suggest interactivity
  - Modal entrances/exits maintain spatial context
  
  - Primary: Application submissions, login/logout transitions (300ms)
  - Tertiary: Hover states, tooltips (150ms)

  - **Dialog**: Log
  - **Tabs**: Switching between "Mis postulaciones" states (All, Applied, CV Viewed, In Process)

  - **Avatar**: Us
  - **ScrollArea**: Long job descriptions, application lists

  - Job card component with integrated favorite button, status badge, and company logo
  - Curriculum preview/d
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
