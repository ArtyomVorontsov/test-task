# To-Do List App

## Overview

This is a collaborative real-time to-do list [application](http://20.123.59.80/1) that allows users to create and manage to-do items, such as grocery lists, while enabling multiple users to edit the list simultaneously.

## Technical Stack

### **Database**

- PostgreSQL

### **Frontend**

- **Language:** TypeScript
- **Framework:** React

### **Backend**

- **Language:** TypeScript
- **Framework:** Node.js
- **Libraries:**
  - Express.js (API handling)
  - Knex.js (Database query builder)
  - Socket.io (Real-time collaboration)

### **Hosting**

- Azure VM

## User stories from task

- I as a user can create to-do items, such as a grocery list.
- I as another user can collaborate in real-time with user - so that we can
  (for example) edit our family shopping-list together.
- I as a user can mark to-do items as “done” - so that I can avoid clutter and focus on
  things that are still pending
- I as a user can filter the to-do list and view items that were marked as done - so that I
  can retrospect on my prior progress
- I as a user can create multiple to-do lists where each list has it's unique URL that I can
  share with my friends - so that I could have separate to do lists for my groceries and
  work related tasks
- I as a user can be sure that my todos will be persisted so that important information is
  not lost when server restarts

### User stories proposed by me

- I as a user, I want to see a visual representation of online users who have joined the current to-do list page, so that I can easily identify active collaborators in real time.
- I as a user, I want to have a list where all to-do tables are displayed, so that I can easily access and manage different to-do lists in one place.
- I as a user, I want to have randomly generated usernames so that I can skip annoying registration while still being able to differentiate myself from other users.
