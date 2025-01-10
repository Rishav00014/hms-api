# Software Requirements Specification (SRS)  
**Project Name:** Exhibition Event Management System  
**Document Version:** 1.1  
**Date:** 08/01/2025  

---

## Table of Contents  

1. [Introduction](#1-introduction)  
   1.1 [Purpose](#11-purpose)  
   1.2 [Scope](#12-scope)  
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)  
   1.4 [References](#14-references)  
   1.5 [Overview](#15-overview)  
2. [Overall Description](#2-overall-description)  
   2.1 [Product Perspective](#21-product-perspective)  
   2.2 [Product Features](#22-product-features)  
   2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)  
   2.4 [Operating Environment](#24-operating-environment)  
   2.5 [Assumptions and Dependencies](#25-assumptions-and-dependencies)  
3. [System Architecture and Data Model](#3-system-architecture-and-data-model)  
   3.1 [Entity-Relationship Diagram (ERD)](#31-entity-relationship-diagram-erd)  
   3.2 [Schema Definitions](#32-schema-definitions)  
4. [User Flows](#4-user-flows)  
   4.1 [Event Manager Workflow](#41-event-manager-workflow)  
   4.2 [Supervisor Workflow](#42-supervisor-workflow)  
5. [Specific Requirements](#5-specific-requirements)  
   5.1 [Functional Requirements](#51-functional-requirements)  
   5.2 [Non-Functional Requirements](#52-non-functional-requirements)  
   5.3 [Data Requirements](#53-data-requirements)  
6. [System Features](#6-system-features)  
   6.1 [Feature 1: Event and Hall Management](#61-feature-1-event-and-hall-management)  
   6.2 [Feature 2: Supervisor and Personnel Assignment](#62-feature-2-supervisor-and-personnel-assignment)  
   6.3 [Feature 3: Attendance and Reporting](#63-feature-3-attendance-and-reporting)  

---

## 1. Introduction  

### 1.1 Purpose  
The purpose of this document is to define the software requirements for the **Exhibition Event Management System**, enabling comprehensive management of exhibition schedules, services, personnel, and reporting in adherence to ISO standards.  

### 1.2 Scope  
The system provides functionalities for:  
- Scheduling exhibitions with associated halls and services.  
- Assigning supervisors to halls.  
- Managing personnel assignments and capturing attendance data.  
- Generating event-specific reports.  

### 1.3 Definitions, Acronyms, and Abbreviations  
- **Event:** A scheduled exhibition.  
- **Supervisor:** A manager overseeing hall-specific operations.  
- **Personnel:** Staff members such as security guards and housekeeping personnel.  

### 1.4 References  
- ISO/IEC/IEEE 29148:2018 – Systems and Software Engineering – Life Cycle Processes – Requirements Engineering.  

### 1.5 Overview  
This document outlines detailed requirements, data models, and workflows to ensure smooth operation of the system.  

---

## 2. Overall Description  

### 2.1 Product Perspective  
This system integrates with internal databases and media storage to centralize event management.  

### 2.2 Product Features  
- Event scheduling and management.  
- Hall-specific supervisor and personnel assignment.  
- Real-time reporting and attendance tracking.  

### 2.3 User Classes and Characteristics  
1. **Event Managers:** Create and manage events, assign supervisors, and generate reports.  
2. **Supervisors:** Assign personnel and manage hall operations.  
3. **Personnel:** Execute assigned tasks and record attendance.  

### 2.4 Operating Environment  
- Web-based dashboard for event managers.  
- Mobile app for supervisors.  

### 2.5 Assumptions and Dependencies  
- Internet access is required for data synchronization.  
- The system integrates with existing media storage for photo uploads.  

---

## 3. System Architecture and Data Model  

### 3.1 Entity-Relationship Diagram (ERD)  
```plaintext
Event --> Hall --> Supervisor --> Personnel
Event --> Report
```

### 3.2 Schema Definitions  

#### Event Schema  
```json
{
  "eventId": "UUID",
  "name": "string",
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "halls": ["Hall"]
}
```

#### Hall Schema  
```json
{
  "hallId": "UUID",
  "hallNumber": "string",
  "eventId": "UUID",
  "supervisorId": "UUID",
  "services": ["string"]
}
```

#### Supervisor Schema  
```json
{
  "supervisorId": "UUID",
  "name": "string",
  "assignedHall": "UUID"
}
```

#### Personnel Schema  
```json
{
  "personnelId": "UUID",
  "name": "string",
  "position": "string",
  "photoUrl": "string",
  "assignedLocation": "string",
  "shift": "string",
  "date": "ISO8601"
}
```

#### Report Schema  
```json
{
  "reportId": "UUID",
  "eventId": "UUID",
  "date": "ISO8601",
  "shift": "string",
  "personnelDetails": ["Personnel"]
}
```

---

## 4. User Flows  

### 4.1 Event Manager Workflow  
1. **Login:** Event manager logs into the system.  
2. **Event Creation:**  
   - Navigate to the "Create Event" page.  
   - Input event name, start and end dates.  
   - Add halls and services for the event.  
3. **Assign Supervisors:** Assign one supervisor to each hall.  
4. **Generate Reports:**  
   - Select the event.  
   - Specify the date or shift for the report.  
   - Download the report as a PDF or export it to Excel.  

### 4.2 Supervisor Workflow  
1. **Login:** Supervisor logs into the mobile app.  
2. **View Halls:** List of assigned halls is displayed.  
3. **Assign Personnel:**  
   - Select a hall.  
   - Add personnel details (name, position, location, photo, date, and shift).  
4. **Manage Shifts:** Update assignments for day or night shifts.  

---

## 5. Specific Requirements  

### 5.1 Functional Requirements  
1. **Event Management:**  
   - Create and manage events with multiple halls.  
   - Assign services to each hall.  

2. **Supervisor Assignment:**  
   - Assign one supervisor per hall.  

3. **Personnel Assignment:**  
   - Supervisors can assign and update personnel details.  

4. **Reporting:**  
   - Generate attendance reports by day, shift, or event duration.  

### 5.2 Non-Functional Requirements  
1. **Performance:**  
   - Response time for each operation must be under 2 seconds.  
2. **Scalability:**  
   - Support up to 10,000 users during peak usage.  

3. **Security:**  
   - Secure data using AES-256 encryption.  
   - Role-based access controls (RBAC).  

### 5.3 Data Requirements  
- Store personnel photos securely in a cloud storage solution.  
- Maintain data retention for up to one year for audit purposes.  

---

## 6. System Features  

### 6.1 Feature 1: Event and Hall Management  
- Create and manage events.  
- Assign halls and services to events.  

### 6.2 Feature 2: Supervisor and Personnel Assignment  
- Assign supervisors to halls.  
- Allow supervisors to manage hall-specific personnel.  

### 6.3 Feature 3: Attendance and Reporting  
- Track personnel attendance.  
- Generate and export detailed reports.  

---

**Prepared by:** Rishav Kumar  
**Date:** 08/01/2025  
**Version:** 1.1  