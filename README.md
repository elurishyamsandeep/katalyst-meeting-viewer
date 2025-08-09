# Katalyst Meeting Viewer App

This project is a lightweight Meeting Collaboration Platform (MCP)-style web application designed to connect to a user's personal Google Calendar, fetch their past and upcoming meetings, and display them in a contextual interface. It was developed as a take-home assignment for a Founding Engineer position at Katalyst.

## Live Demo and Video Walkthrough

*   **Live Application:** [https://katalyst-meeting-viewer.vercel.app](https://katalyst-meeting-viewer.vercel.app)
*   **Video Walkthrough:** [https://youtu.be/ynNiY2FjKNo?si=XpEZJGEWVgbZxb2](https://youtu.be/ynNiY2FjKNo?si=XpEZJGEWVgbZxb2)

## Goal

The primary goal was to build an AI-powered internal tooling layer that connects to third-party systems (Google Calendar) and presents contextual intelligence to users.

## Core Requirements & Implementation

*   **Auth:** Implemented Google OAuth using `@react-oauth/google`. User authentication status and access tokens are managed via `AuthContext` and persisted in `localStorage`.
*   **Calendar Integration:** Fetches 5 upcoming and 5 past meetings from Google Calendar using the `googleapis` library. The `useCalendarData` hook handles data fetching, loading states, error handling, and automatic refreshing.
*   **Display:** Meetings are displayed in a user-friendly interface, separating upcoming and past meetings. Details shown include title, time, duration, attendees, and description.
*   **Frontend:** Built with React, Next.js, and TypeScript, styled using Tailwind CSS.
*   **AI Summary:** Utilizes the Groq SDK to generate summaries and insights for past meetings, providing contextual intelligence.
*   **Error & Loading Handling:** Basic UX state handling for API calls is implemented, including loading indicators and error messages for calendar data fetching and AI summary generation.

## Tech Stack Used

*   **Frontend:** React, Next.js, TypeScript
*   **Styling:** Tailwind CSS
*   **Authentication:** Google OAuth (`@react-oauth/google`)
*   **Calendar Integration:** Google Calendar API (`googleapis`)
*   **AI:** Groq SDK (`groq-sdk`)
*   **HTTP Client:** Axios
*   **Date Manipulation:** `date-fns`
*   **Hosting:** Vercel

## Features Implemented

*   **Login:** Google OAuth for secure user authentication.
*   **Fetch past/upcoming meetings from Google Calendar:** Retrieves the 5 most recent past meetings and 5 upcoming meetings.
*   **Display meeting details:** Shows comprehensive information for each meeting.
*   **AI summary for past meetings:** Generates concise summaries and overall insights for past meetings using Groq.
*   **Deployed live on Vercel:** The application is deployed and accessible online.

## Assumptions & Design Decisions

*   **Google OAuth:** Chosen for robust and secure authentication, aligning with the requirement for connecting to Google Calendar.
*   **Groq SDK for AI:** Selected for its performance in generating AI summaries and insights, providing a realistic LLM integration.
*   **Local Storage for Session:** User and token information are stored in `localStorage` for persistence across sessions.
*   **Polling for Calendar Data:** The `useCalendarData` hook implements a polling mechanism (every 5 minutes) to keep meeting data up-to-date, with intelligent pausing when the page is hidden.
*   **Component-based Architecture:** Follows a standard React component structure for modularity and maintainability.
*   **Error Handling:** Implemented basic error handling for API calls and token validation to provide a better user experience.
*   **Scope Prioritization:** Focused on core functionalities (auth, calendar integration, display, AI summary) within the given time constraints, prioritizing a functional end-to-end solution.

## How to Run Locally

To set up and run the project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd katalyst-meeting-viewer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google Client ID and Groq API Key.
    ```
    NEXT_PUBLIC_GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
    NEXT_PUBLIC_GROQ_API_KEY="YOUR_GROQ_API_KEY"
    ```
    *   You can obtain your Google Client ID from the Google Cloud Console.
    *   You can obtain your Groq API Key from the Groq Cloud website.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be accessible at `http://localhost:3000`.