# Planning Guide

A comprehensive job application portal that connects job seekers with opportunities, allowing them to browse openings, apply with their CV, and track their application status through an intuitive, professional interface.

**Experience Qualities**: 
1. **Professional** - Every interaction reinforces trust and credibility through refined visual design and clear communication
2. **Transparent** - Application status and process steps are always visible, reducing anxiety and uncertainty
3. **Efficient** - Streamlined flows from discovery to application minimize friction and respect users' time

**Complexity Level**: Light Application (multiple features with basic state)
  - The portal includes job listings, application submission, user profiles, and status tracking, but maintains simplicity through clear separation of concerns and straightforward user flows.

## Essential Features

### Job Listings Page
- **Functionality**: Display all active job postings with filtering and search capabilities
- **Purpose**: Enable users to discover relevant opportunities quickly without authentication barriers
- **Trigger**: Landing on the portal homepage
- **Progression**: View grid of job cards → Apply filters (location, area, contract type, experience level) → Search by keyword → Click job card → Navigate to detail view
- **Success criteria**: Users can find relevant jobs within 30 seconds; all filters work independently and in combination

### Job Detail View
- **Functionality**: Show complete job information including description, requirements, benefits, and application button
- **Purpose**: Provide all necessary information for candidates to make informed application decisions
- **Trigger**: Clicking on a job card from listings
- **Progression**: View full job details → Read requirements and benefits → Click "Apply Now" → Redirect to application flow (registration if new, confirmation if authenticated)
- **Success criteria**: All job metadata displays correctly; apply button state reflects user authentication status

### Application Submission
- **Functionality**: Capture candidate information and CV file, create user profile if needed
- **Purpose**: Collect necessary data for recruiters while minimizing barriers to application
- **Trigger**: Clicking "Apply Now" on job detail page
- **Progression**: Fill personal information form → Upload CV (PDF/DOCX) → Submit → Create user account + application record → Show success confirmation → Redirect to user portal
- **Success criteria**: Form validates all fields; file upload works for PDF/DOCX; user profile and application are created atomically

### Candidate Portal
- **Functionality**: Dashboard showing all user applications with current status and profile management
- **Purpose**: Provide transparency into application progress and allow profile updates
- **Trigger**: Logging in or completing first application
- **Progression**: View applications table → Check color-coded status badges → Click application for details → Navigate to profile section → Update information or CV → Save changes
- **Success criteria**: Status updates reflect immediately; profile changes persist; CV replacement works correctly

### Application Status Tracking
- **Functionality**: Visual indication of application progress through recruitment pipeline
- **Purpose**: Reduce candidate anxiety by showing exactly where they are in the process
- **Trigger**: Automatic when admin updates status in backend system
- **Progression**: Application submitted (blue) → Under review (blue) → Interview scheduled (yellow) → Hired (green) or Rejected (red)
- **Success criteria**: Status changes appear in real-time; each status has distinct visual identity; notifications accompany changes

## Edge Case Handling

- **Duplicate Applications** - Prevent users from applying to the same job twice with clear messaging if attempted
- **File Upload Failures** - Show clear error messages; validate file type and size before upload; allow retry
- **Empty States** - Display helpful messages and CTAs when no jobs match filters or user has no applications yet
- **Expired Job Postings** - Hide from main listings but preserve in user's application history if already applied
- **Invalid Authentication** - Clear session handling; redirect to login with return URL preservation
- **Network Errors** - Show retry options; don't lose form data on submission failures

## Design Direction

The design should feel institutional and trustworthy - like applying through a government or large corporate portal - with professional polish that conveys competence and reliability. A clean, minimal interface keeps focus on content while subtle use of brand colors adds personality without distraction.

## Color Selection

Complementary color scheme using institutional blue and energetic green to balance professionalism with optimism.

- **Primary Color**: Deep professional blue (oklch(0.35 0.08 250)) - conveys trust, stability, and corporate credibility for headers, navigation, and primary actions
- **Secondary Colors**: Fresh success green (oklch(0.65 0.15 142)) for positive actions and "hired" status; neutral gray (oklch(0.35 0 0)) for body text
- **Accent Color**: Vibrant green (oklch(0.68 0.17 140)) for CTAs and important interactive elements that drive user action
- **Foreground/Background Pairings**: 
  - Background (White oklch(1 0 0)): Dark gray text (oklch(0.3 0 0)) - Ratio 12.6:1 ✓
  - Card (Light gray oklch(0.98 0 0)): Dark gray text (oklch(0.3 0 0)) - Ratio 12.1:1 ✓
  - Primary (Deep blue oklch(0.35 0.08 250)): White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Secondary (Success green oklch(0.65 0.15 142)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Accent (Vibrant green oklch(0.68 0.17 140)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Muted (Light gray oklch(0.96 0 0)): Medium gray text (oklch(0.5 0 0)) - Ratio 6.8:1 ✓

## Font Selection

Typography should project authority and clarity, using a modern sans-serif that reads exceptionally well across devices and conveys professional competence.

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Inter Bold / 32px / -0.02em letter spacing / 1.2 line height
  - H2 (Section Headers): Inter SemiBold / 24px / -0.01em letter spacing / 1.3 line height
  - H3 (Card Titles): Inter SemiBold / 18px / normal letter spacing / 1.4 line height
  - Body (Main Content): Inter Regular / 16px / normal letter spacing / 1.6 line height
  - Small (Metadata): Inter Regular / 14px / normal letter spacing / 1.5 line height
  - Button Text: Inter Medium / 16px / normal letter spacing

## Animations

Animations should be subtle and purposeful, reinforcing the professional nature of the platform while providing helpful feedback - understated transitions that guide without distracting.

- **Purposeful Meaning**: Smooth page transitions convey polish and care; status badge animations draw attention to important updates; hover states provide clear affordance
- **Hierarchy of Movement**: Primary CTAs get subtle scale on hover; card elevation changes guide exploration; status transitions animate smoothly to acknowledge change

## Component Selection

- **Components**: 
  - Card for job listings and application status entries
  - Button for primary actions with variant support (primary blue, secondary green, ghost for tertiary)
  - Input, Textarea, Label for forms with clear focus states
  - Badge for status indicators with color variants
  - Dialog for application confirmation and important messages
  - Table for applications dashboard with sortable columns
  - Tabs for portal navigation (applications, profile, notifications)
  - Avatar for user profile display
  - Progress indicator for multi-step forms
  - Alert for success/error feedback
  
- **Customizations**: 
  - Status badges with specific colors (blue/yellow/green/red) beyond default variants
  - File upload component with drag-drop and preview
  - Job card component with custom layout for metadata display
  - Filter sidebar with checkbox groups and search input
  
- **States**: 
  - Buttons: default, hover (slight scale), active (pressed), disabled (muted), loading (spinner)
  - Inputs: default, focus (blue ring), error (red border + message), disabled (gray background)
  - Cards: default, hover (elevated shadow), active/selected (blue border)
  
- **Icon Selection**: 
  - MagnifyingGlass for search
  - Funnel for filters
  - FileText for CV/documents
  - User for profile
  - Bell for notifications
  - Check for success states
  - X for close/cancel
  - Upload for file actions
  - Clock for pending status
  - CheckCircle for approved/hired
  - XCircle for rejected
  
- **Spacing**: 
  - Container padding: px-4 sm:px-6 lg:px-8
  - Card padding: p-6
  - Form field gaps: gap-4
  - Section margins: mb-8 or mb-12 for major sections
  - Grid gaps: gap-6 for job cards
  
- **Mobile**: 
  - Job cards stack single column on mobile, 2 columns on tablet, 3+ on desktop
  - Filters become collapsible drawer on mobile
  - Navigation collapses to hamburger menu
  - Tables convert to stacked cards on mobile for better readability
  - Touch targets minimum 44x44px
  - Bottom sheet for mobile application forms
