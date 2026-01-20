# 3.5 Modules Developed - Village Cohort Data Platform

## 3.5.1 User Authentication Module

The authentication module provides secure user registration and login functionality with role-based access control.

**Features:**
- **User Registration:** New users can create accounts with validation for username uniqueness, strong password requirements (minimum 8 characters with uppercase, lowercase, number, and symbol), email format validation, and required phone number field.
- **Secure Login:** Users authenticate using username and password. The system validates credentials against BCrypt-hashed passwords stored in the database and issues JWT tokens for session management.
- **JWT Token Management:** Upon successful login, the system generates a JSON Web Token containing username and role claims. Tokens expire after 24 hours, requiring re-authentication for security.
- **Role-Based Access Control:** The system differentiates between multiple user roles:
  - **SUPER_ADMIN:** Full system access including user management and administrative functions
  - **COLLEGE_ADMIN:** Administrative access for college-level management
  - **FACULTY:** Access to data upload, filtering, and reporting features
  - **DATA_ANALYST:** Access to data analysis and visualization tools
  - **VIEWER:** Read-only access to reports and visualizations
- **Session Management:** JWT tokens are stored in browser localStorage and automatically included in API requests via Authorization headers. The frontend validates token expiration and redirects users to login when sessions expire.

**Security Features:**
- BCrypt password hashing with salt rounds for secure credential storage
- Input validation and sanitization to prevent SQL injection and XSS attacks
- CORS configuration restricting API access to authorized frontend domains
- Comprehensive error logging for authentication attempts and failures

---

## 3.5.2 CSV Data Upload and Cohort Filtering Module

This module enables users to upload health cohort data in CSV format and provides comprehensive filtering capabilities for data analysis.

**CSV Upload Features:**
- **File Selection:** Users can select CSV files through an intuitive file picker interface
- **Data Validation:** The system validates CSV structure, checks for required columns, and provides immediate feedback on data quality issues
- **Data Preview:** Uploaded data is immediately displayed in a paginated table format, allowing users to verify data accuracy before proceeding
- **State Persistence:** CSV data and filter states are saved to browser localStorage, enabling users to resume work after page refresh or browser restart
- **Error Handling:** Clear error messages guide users when CSV files are malformed, missing required columns, or contain invalid data formats

**Cohort Filtering Engine:**
The filtering system supports multiple filter types for comprehensive data analysis:

**Single-Select Filters:**
- **Village Name:** Filter records by specific village locations
- **Ward/Area:** Filter by administrative ward or area designation
- **Age Range:** Filter by predefined age brackets (18-24, 25-34, 35-44, 45-54, 55-64, 65+)
- **Gender:** Filter by patient gender (Female, Male, Transgender)
- **Education Level:** Filter by patient education (Illiterate, Upto 10th standard, HSC, Graduate, Postgraduate and above)
- **Occupation:** Filter by occupation type (Student, Homemaker, Private Job, Government Job, Business/self Employed, Retired, Unemployed)
- **Heard About DMAMCHRC:** Filter by awareness status (Yes/No)

**Multi-Select Filters:**
- **How did you hear about DMAMCHRC?:** Multiple selection from sources including Flex boards/Posters, Newspaper, Social Media, Health Camp, Referred by Doctor, Friends/Family, or "I have not heard about it"
- **Medicine/Panchakarma:** Filter by medical conditions including Diabetes, Hypertension, Asthma, Heart disease, Paralysis, Breathlessness/Weakness, Skin Disease, Obesity, Acidity/Hyper Acidity, Arthritis/knee pain/Back pain, Thyroid
- **Surgery:** Filter by surgical conditions including Urine Disorder, Hernia, Hydrocele, Cyst, Kidney Stone, Piles/Haemorrhoids, Fistula, Corn, Diabetic Wounds, Venous Ulcers
- **Gynecology:** Filter by gynecological conditions including Menstrual Disorder, Abnormal vaginal bleeding, Uterine Prolapse, Infertility, White Discharge, Cyst in a breast, PCOD, ANC
- **Pediatrics:** Filter by pediatric conditions including Allergic Rhinitis, Malnourish Children, Difficulty in Speech to child, Convulsions, Not gaining weight, Cerebral Palsy, Obesity in Children, Mentally Deficient, Other
- **Ophthalmology & ENT:** Filter by eye and ENT conditions including Diminished Vision, Discharge from eye, Squint, Pterygium, Ear discharge, DNS, Migraine

**Advanced Filtering:**
- **Global Search:** Full-text search across all data fields for quick record location
- **Combined Filters:** Multiple filters can be applied simultaneously for precise data subset selection
- **URL State Sync:** Filter selections are synchronized with browser URL parameters, enabling bookmarkable filtered views and easy sharing

**Data Export:**
- Filtered data can be exported as CSV files with proper formatting
- Export includes only the currently filtered subset of data
- CSV files maintain proper escaping and formatting for compatibility with spreadsheet applications

---

## 3.5.3 Data Visualization and Reporting Module

This module provides interactive visualizations and comprehensive reporting capabilities for cohort data analysis.

**Visualization Features:**
- **Dynamic Charts:** The system generates interactive charts using Recharts library, including bar charts, pie charts, and trend lines
- **Real-Time Updates:** Visualizations automatically update when filters are applied, providing instant insights into filtered data subsets
- **Multiple Chart Types:** Support for various chart types including:
  - Distribution charts showing data spread across categories
  - Comparison charts highlighting differences between groups
  - Trend analysis charts showing patterns over time
- **Responsive Design:** Charts adapt to different screen sizes and maintain readability on mobile, tablet, and desktop devices

**Reporting Capabilities:**
- **Data Summary:** Automatic generation of summary statistics for filtered datasets
- **Export Options:** Reports can be exported in multiple formats including CSV for further analysis
- **Print-Friendly Views:** Optimized layouts for printing physical reports
- **Custom Report Generation:** Users can create custom reports by applying specific filter combinations

---

## 3.5.4 Administrative Dashboard Module

The administrative dashboard provides comprehensive user and system management capabilities for administrators.

**User Management Features:**
- **User Listing:** Display all registered users with pagination and search functionality
- **User Creation:** Administrators can create new user accounts with role assignment
- **User Editing:** Update user information including personal details, contact information, and role assignments
- **User Deletion:** Remove user accounts with proper validation and confirmation
- **Role Assignment:** Assign and modify user roles to control system access levels
- **Status Management:** Activate, deactivate, or set users to pending status

**System Management:**
- **Access Logs:** View comprehensive logs of user login attempts, successful authentications, and failed login attempts
- **Audit Trail:** Track administrative actions including user modifications and system changes
- **Security Monitoring:** Monitor system security through authentication logs and access patterns

**Dashboard Interface:**
- **Role-Based Navigation:** Dashboard layout adapts based on administrator role (SUPER_ADMIN vs COLLEGE_ADMIN)
- **Real-Time Updates:** User lists and system status update in real-time
- **Responsive Design:** Dashboard accessible on various device types with optimized layouts

---

## 3.5.5 Bulk Messaging Module

The bulk messaging module enables users to send messages to multiple recipients simultaneously, facilitating efficient communication with cohort participants and team members.

**Core Features:**
- **Message Composition:** Users can compose messages through an intuitive text editor interface
- **Recipient Selection:** Multiple methods for selecting message recipients:
  - **Village-Based Selection:** Select recipients by village name, enabling targeted communication to specific geographic areas
  - **Ward/Area Selection:** Filter recipients by administrative ward or area for localized messaging
  - **Role-Based Selection:** Send messages to users based on their system roles (Faculty, Data Analysts, etc.)
  - **Custom Recipient Lists:** Create and save custom recipient groups for frequently used messaging lists
  - **Individual Selection:** Manually select specific recipients from user lists

**Message Management:**
- **Message Templates:** Pre-defined message templates for common communication scenarios (appointment reminders, health camp notifications, survey requests)
- **Message Scheduling:** Schedule messages for future delivery at specified dates and times
- **Message History:** View sent message history with timestamps, recipient counts, and delivery status
- **Draft Messages:** Save message drafts for later editing and sending

**Advanced Features:**
- **Attachment Support:** Attach files (flyers, documents, images) to messages with size limits (under 1 MB)
- **Delivery Tracking:** Monitor message delivery status and track read receipts when available
- **Delivery Logs:** Comprehensive logs showing message delivery attempts, successes, and failures
- **Retry Mechanism:** Automatic retry for failed message deliveries with configurable retry intervals

**Integration Capabilities:**
- **SMS Gateway Integration:** Ready for integration with SMS gateways for text message delivery
- **Email Integration:** Email notification support for message delivery
- **WhatsApp Integration:** Framework prepared for WhatsApp Business API integration for direct messaging
- **Multi-Channel Support:** Send messages through multiple channels simultaneously (SMS + Email + WhatsApp)

**User Interface:**
- **Intuitive Compose Interface:** Clean, user-friendly interface for message composition
- **Recipient Preview:** Preview selected recipient count and list before sending
- **Message Validation:** Validation checks ensure message content meets requirements before sending
- **Confirmation Dialogs:** Confirmation prompts prevent accidental bulk message sends

**Use Cases:**
- **Health Camp Notifications:** Inform village residents about upcoming health camps and screening programs
- **Appointment Reminders:** Send reminders to patients about scheduled appointments
- **Survey Distribution:** Distribute health surveys and data collection forms to cohort participants
- **Emergency Alerts:** Rapid communication for health emergencies or urgent health information
- **Follow-Up Communications:** Send follow-up messages to patients after treatments or consultations
- **Team Coordination:** Internal messaging for coordination among health workers and administrators

**Security and Privacy:**
- **Access Control:** Only authorized users can send bulk messages, with role-based restrictions
- **Message Encryption:** Sensitive health information in messages is handled securely
- **Audit Logging:** All bulk messaging activities are logged for compliance and auditing
- **Recipient Privacy:** Recipient lists are protected and not exposed to unauthorized users

**Performance Optimization:**
- **Batch Processing:** Messages are processed in batches to handle large recipient lists efficiently
- **Rate Limiting:** Prevents message spam and ensures compliance with messaging service limits
- **Queue Management:** Message queue system ensures reliable delivery even during high-volume periods
- **Error Handling:** Graceful error handling with user notifications for delivery failures

---

## 3.5.6 Interactive Help Chatbot Module

The platform includes an intelligent chatbot feature integrated via Chatbase, providing users with instant assistance and guidance.

**Chatbot Features:**
- **24/7 Availability:** Chatbot available at all times for user support without requiring human intervention
- **Contextual Help:** Provides context-aware responses based on user queries and current page context
- **FAQ Integration:** Chatbot connected to comprehensive FAQ database covering common user questions
- **Natural Language Processing:** Understands natural language queries and provides relevant responses
- **Multi-Topic Support:** Handles queries about:
  - Data upload procedures and CSV format requirements
  - Filter usage and data filtering techniques
  - Report generation and export options
  - User account management and password reset
  - System navigation and feature discovery
  - Troubleshooting common issues

**User Interface:**
- **Floating Chat Widget:** Accessible chatbot button in bottom-right corner of all pages
- **Help Button Integration:** Dedicated "Help" button in navigation bar for quick chatbot access
- **Chat History:** Maintains conversation history during user session
- **Quick Actions:** Provides quick action buttons for common tasks (e.g., "How to upload CSV?", "How to filter data?")

**Integration:**
- **Seamless Integration:** Chatbot seamlessly integrated into all platform pages
- **Page Context Awareness:** Chatbot understands current page context to provide relevant assistance
- **Link to Help Page:** Chatbot can direct users to detailed help documentation (HELPP.HTML) when needed

---

## 3.5.7 Data Export and Download Module

This module handles secure and efficient data export functionality.

**Export Features:**
- **Filtered Data Export:** Export only the currently filtered subset of data
- **Full Dataset Export:** Option to export complete dataset without filters
- **Multiple Formats:** Support for CSV export with proper formatting and encoding
- **Custom Export:** Users can select specific columns for export
- **Batch Export:** Export multiple filtered views simultaneously

**Download Management:**
- **Download Tracking:** Track download history and frequency
- **File Naming:** Automatic file naming with timestamps and filter descriptions
- **Download Validation:** Verify file integrity before download completion

---

## Summary

The Village Cohort Data Platform modules work together to provide a comprehensive solution for health data management, analysis, and communication. Each module is designed with security, usability, and scalability in mind, ensuring the platform can grow with user needs while maintaining data integrity and user privacy.
