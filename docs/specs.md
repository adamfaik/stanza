# **Project Specification: Stanza**

## **1\. Project Overview**

**Concept:** A minimalist, text-first social platform for book lovers to share fleeting thoughts and discussions.

**Core Differentiator:** All posts have a strict **24-hour lifespan**, creating a sense of urgency and casual conversation ("The Pop-Up Book Club").

**Design Philosophy:** "Polished Minimalism." High focus on typography, whitespace, and readability. It should feel modern and refined (e.g., *Medium, Read.cv*), not utilitarian or "geeky."

## **2\. Core Features**

### **A. The Feed (Home Page)**

* **Layout:** Single-column main feed. No sidebars, no categories.  
* **Visibility:** Accessible to all visitors (public read access).  
* **Sorting Logic:**  
  1. **Top:** Most upvotes (Descending).  
  2. **Undiscovered:** Least upvotes (Ascending).  
  3. **Just Added:** Newest first (Time remaining descending).  
  4. **Last Call:** Urgent/Expiring soonest (Time remaining ascending).  
* **Visual Urgency:** If a post has **\< 4 hours** remaining, the time indicator turns Burnt Orange.

### **B. Posting (The Writing Room)**

* **Interface:** A dedicated, distraction-free full page (/write). NOT a modal.  
* **Input Structure:**  
  * **Title:** Massive Serif font, acts as the page header.  
  * **Body:** Large Serif body text.  
  * **No Labels:** The interface uses "Ghost" inputs with no borders or explicit labels.  
* **Media Constraint:** Maximum **ONE** image per post (via a subtle camera icon).  
* **No AI:** No suggestion algorithms or AI writing helpers. Pure human thought.  
* **Lifespan:** Posts are automatically hard-deleted or hidden 24 hours after creation.

### **C. Interaction: Voting**

* **Mechanism:** Simple Upvote only (No downvote).  
* **Access:** **No Login Required.**  
* **Spam Prevention:** Browser Fingerprinting (LocalStorage \+ IP) to enforce 1 vote per post per device.

### **D. Interaction: Discussions**

* **Access:** **Login Required** (Email Magic Link).  
* **Interface:**  
  * Multi-line text area (Prose-focused, not Chat-focused).  
  * Solid Black "Comment" button.  
* **Lifespan:** Comments die with the post.

### **E. User Accounts**

* **Method:** Email Only (Magic Link). No passwords.  
* **Profile:** Minimal. Shows a solid circle avatar with the user's initial.

## **3\. UI/UX Guidelines**

### **Typography & Palette**

* **Body/Titles:** High-quality Serif (e.g., *Merriweather, Newsreader*).  
* **UI Elements:** Clean Sans-Serif (e.g., *Inter*) for metadata (Time, Author, Buttons).  
* **Input Fields:** Always Transparent/White background with Dark Text. Never dark backgrounds.  
* **Buttons:** Solid Black (\#000000) with White Text for primary actions.

### **Visual Inspiration**

* **Medium / Substack:** For whitespace and typography.  
* **Read.cv:** For modern, clean minimalism.  
* **VSCO:** For premium mobile aesthetics.