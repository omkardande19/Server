# ArtistKatta - Complete Testing Checklist

## 🧪 Testing Status - October 15, 2025

---

## ✅ **1. USER CREATION (SIGNUP)**

### **Test Cases:**

#### **Test 1.1: Artist Signup**
- [ ] Navigate to `/signup`
- [ ] Fill in all required fields:
  - Full Name: "Test Artist"
  - Email: "artist@test.com"
  - Password: "Test@1234"
  - User Category: "Artist"
  - User Category Type: "Painter"
  - City: "Mumbai"
  - Country: "India"
- [ ] Submit form
- [ ] **Expected:** Success message → Redirect to dashboard
- [ ] **Actual:** _______________

#### **Test 1.2: Company Signup**
- [ ] Navigate to `/signup`
- [ ] Fill in company details
- [ ] User Category: "Company"
- [ ] Submit form
- [ ] **Expected:** Success message → Redirect to dashboard
- [ ] **Actual:** _______________

#### **Test 1.3: Validation**
- [ ] Try signup with invalid email
- [ ] **Expected:** "Please enter a valid email address"
- [ ] Try signup with short password (< 8 chars)
- [ ] **Expected:** "Password must be at least 8 characters"
- [ ] **Actual:** _______________

---

## ✅ **2. LOGIN**

### **Test Cases:**

#### **Test 2.1: Successful Login**
- [ ] Navigate to `/login`
- [ ] Enter email: "artist@test.com"
- [ ] Enter password: "Test@1234"
- [ ] Submit form
- [ ] **Expected:** Success → Redirect to `/dashboard`
- [ ] **Actual:** _______________

#### **Test 2.2: Failed Login - Wrong Password**
- [ ] Navigate to `/login`
- [ ] Enter correct email
- [ ] Enter wrong password
- [ ] **Expected:** "Invalid password" error
- [ ] **Actual:** _______________

#### **Test 2.3: Failed Login - User Not Found**
- [ ] Navigate to `/login`
- [ ] Enter non-existent email
- [ ] **Expected:** "User not found" error
- [ ] **Actual:** _______________

---

## ✅ **3. DASHBOARD**

### **Test Cases:**

#### **Test 3.1: Dashboard Loads**
- [ ] Login successfully
- [ ] Dashboard loads without errors
- [ ] **Expected:** See welcome message with user's name
- [ ] **Expected:** See 4 stats cards
- [ ] **Expected:** See Quick Actions section
- [ ] **Expected:** See Recent Activity section
- [ ] **Expected:** See Upcoming Events section
- [ ] **Actual:** _______________

#### **Test 3.2: User Profile Display**
- [ ] Check top-right profile dropdown
- [ ] Click on profile dropdown
- [ ] **Expected:** See user photo (or initial)
- [ ] **Expected:** See full name
- [ ] **Expected:** See email
- [ ] **Expected:** See user category & type
- [ ] **Actual:** _______________

#### **Test 3.3: Stats Cards**
- [ ] Check "Active Jobs" card
- [ ] Check "Connections" card
- [ ] Check "Messages" card
- [ ] Check "Requests" card
- [ ] **Expected:** All show correct numbers
- [ ] **Actual:** _______________

#### **Test 3.4: Sidebar Navigation**
- [ ] Click "Dashboard" in sidebar
- [ ] Click "Jobs" in sidebar
- [ ] Click "Events" in sidebar
- [ ] Click "Network" in sidebar
- [ ] Click "Messages" in sidebar
- [ ] Click "Saved" in sidebar
- [ ] Click "Profile" in sidebar
- [ ] Click "Settings" in sidebar
- [ ] **Expected:** All links navigate correctly
- [ ] **Actual:** _______________

#### **Test 3.5: Right Sidebar (Desktop Only)**
- [ ] View dashboard on desktop (> 1280px)
- [ ] **Expected:** See "In Demand Talents" section
- [ ] **Expected:** See "Top Jobs" section
- [ ] **Actual:** _______________

#### **Test 3.6: Responsive Design**
- [ ] View on mobile (< 768px)
- [ ] **Expected:** Sidebar collapses, stats cards stack vertically
- [ ] View on tablet (768px - 1024px)
- [ ] **Expected:** 2-column layout for stats
- [ ] View on desktop (> 1024px)
- [ ] **Expected:** Full 4-column layout with right sidebar
- [ ] **Actual:** _______________

---

## ✅ **4. PASSWORD CHANGE**

### **Test Cases:**

#### **Test 4.1: Successful Password Change**
- [ ] Navigate to `/change-password`
- [ ] Enter old password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Submit form
- [ ] **Expected:** "Password updated successfully"
- [ ] **Actual:** _______________

#### **Test 4.2: Wrong Old Password**
- [ ] Enter wrong old password
- [ ] Submit form
- [ ] **Expected:** "Old password incorrect" error
- [ ] **Actual:** _______________

---

## ✅ **5. NETWORKING**

### **Test Cases:**

#### **Test 5.1: Search Users**
- [ ] Navigate to `/network`
- [ ] Click "Discover" tab
- [ ] Enter search query: "Test"
- [ ] Click "Search"
- [ ] **Expected:** List of matching users
- [ ] **Actual:** _______________

#### **Test 5.2: Send Connection Request**
- [ ] Search for a user
- [ ] Click "Connect" button
- [ ] **Expected:** "Connection request sent successfully!" alert
- [ ] **Expected:** Button changes to "Pending" badge
- [ ] **Actual:** _______________

#### **Test 5.3: View Connection Requests (Recipient)**
- [ ] Login as the recipient user
- [ ] Navigate to `/network`
- [ ] Click "Requests" tab
- [ ] **Expected:** See pending connection request
- [ ] **Expected:** See requester's name, category, message
- [ ] **Actual:** _______________

#### **Test 5.4: Accept Connection Request**
- [ ] Click "Accept" button on a request
- [ ] **Expected:** "Connection accepted!" alert
- [ ] **Expected:** Request removed from "Requests" tab
- [ ] **Expected:** Connection appears in "Connections" tab
- [ ] **Actual:** _______________

#### **Test 5.5: Decline Connection Request**
- [ ] Click "Decline" button on a request
- [ ] **Expected:** "Connection request declined." alert
- [ ] **Expected:** Request removed from "Requests" tab
- [ ] **Actual:** _______________

#### **Test 5.6: View Connections**
- [ ] Click "Connections" tab
- [ ] **Expected:** See all accepted connections
- [ ] **Expected:** Each shows user info and "Message" button
- [ ] **Actual:** _______________

#### **Test 5.7: Activity Feed**
- [ ] Click "Activity Feed" tab
- [ ] **Expected:** See network activities
- [ ] **Actual:** _______________

---

## ✅ **6. MESSAGING**

### **Test Cases:**

#### **Test 6.1: Start Conversation from Network**
- [ ] Go to `/network` → Connections tab
- [ ] Click "Message" button on a connection
- [ ] **Expected:** Navigate to `/messages`
- [ ] **Expected:** Conversation created/opened
- [ ] **Actual:** _______________

#### **Test 6.2: View Conversations**
- [ ] Navigate to `/messages`
- [ ] **Expected:** See list of conversations on left
- [ ] **Expected:** Each shows participant name, last message, timestamp
- [ ] **Actual:** _______________

#### **Test 6.3: Send Message**
- [ ] Select a conversation
- [ ] Type a message: "Hello, this is a test message"
- [ ] Press Enter or click Send
- [ ] **Expected:** Message appears immediately
- [ ] **Expected:** Message shown in conversation list
- [ ] **Actual:** _______________

#### **Test 6.4: Receive Message (Other User)**
- [ ] Login as the other user
- [ ] Navigate to `/messages`
- [ ] **Expected:** See the conversation with unread badge
- [ ] **Expected:** See the new message
- [ ] **Actual:** _______________

#### **Test 6.5: Message to Non-Connected User**
- [ ] Try to message a user you're not connected with
- [ ] **Expected:** "Users must be connected to message each other" error
- [ ] **Actual:** _______________

---

## ✅ **7. JOBS**

### **Test Cases:**

#### **Test 7.1: View Jobs List**
- [ ] Navigate to `/jobs`
- [ ] **Expected:** See list of jobs
- [ ] **Expected:** No "jobs.map is not a function" error
- [ ] **Actual:** _______________

#### **Test 7.2: View Job Details**
- [ ] Click on a job
- [ ] **Expected:** Navigate to job detail page
- [ ] **Expected:** See all job information
- [ ] **Actual:** _______________

#### **Test 7.3: Post Single Job (Company User)**
- [ ] Login as company user
- [ ] Navigate to `/jobs/new`
- [ ] Click "Single Job" tab
- [ ] Fill in job details
- [ ] Submit form
- [ ] **Expected:** Job created successfully
- [ ] **Actual:** _______________

#### **Test 7.4: Bulk Upload Jobs**
- [ ] Navigate to `/jobs/new`
- [ ] Click "Bulk Upload" tab
- [ ] Download JSON template
- [ ] Fill in 2 jobs
- [ ] Upload file
- [ ] **Expected:** "Successfully uploaded 2 out of 2 jobs"
- [ ] **Actual:** _______________

#### **Test 7.5: Job History**
- [ ] Navigate to `/jobs/history`
- [ ] **Expected:** See job posting history
- [ ] **Expected:** See statistics
- [ ] **Actual:** _______________

---

## ✅ **8. MENUS & NAVIGATION**

### **Test Cases:**

#### **Test 8.1: Header Navigation (Desktop)**
- [ ] Click "Home" in header
- [ ] **Expected:** Navigate to `/dashboard`
- [ ] Click "Jobs" in header
- [ ] **Expected:** Navigate to `/opportunities`
- [ ] Click "Events" in header
- [ ] **Expected:** Navigate to `/events` (NOT `/messages`)
- [ ] **Actual:** _______________

#### **Test 8.2: Mobile Menu**
- [ ] View on mobile
- [ ] Click hamburger menu
- [ ] **Expected:** See all navigation items
- [ ] Test each link
- [ ] **Actual:** _______________

#### **Test 8.3: Sidebar Navigation (Dashboard)**
- [ ] All sidebar links work correctly
- [ ] Hover effects work
- [ ] Active state highlights current page
- [ ] **Actual:** _______________

---

## ✅ **9. ERROR HANDLING**

### **Test Cases:**

#### **Test 9.1: Network Errors**
- [ ] Disconnect from internet
- [ ] Try to load dashboard
- [ ] **Expected:** "ArtistKatta: Failed to load..." error
- [ ] **Actual:** _______________

#### **Test 9.2: Authentication Errors**
- [ ] Clear localStorage token
- [ ] Try to access `/dashboard`
- [ ] **Expected:** Redirect to `/login`
- [ ] **Actual:** _______________

#### **Test 9.3: API Errors**
- [ ] Stop backend server
- [ ] Try to send connection request
- [ ] **Expected:** "ArtistKatta: Failed to send connection request"
- [ ] **Actual:** _______________

#### **Test 9.4: Validation Errors**
- [ ] Try to submit forms with invalid data
- [ ] **Expected:** Clear validation messages
- [ ] **Actual:** _______________

---

## ✅ **10. USER EXPERIENCE**

### **Test Cases:**

#### **Test 10.1: Loading States**
- [ ] All API calls show loading indicators
- [ ] No blank pages during loading
- [ ] **Actual:** _______________

#### **Test 10.2: Success Feedback**
- [ ] All successful actions show confirmation
- [ ] Alerts are clear and user-friendly
- [ ] **Actual:** _______________

#### **Test 10.3: Error Messages**
- [ ] All errors show "ArtistKatta:" prefix
- [ ] Error messages are clear and actionable
- [ ] No server/technical names shown
- [ ] **Actual:** _______________

---

## 📊 **OVERALL TEST RESULTS**

### **Summary:**
- **Total Tests:** 40
- **Passed:** ___
- **Failed:** ___
- **Blocked:** ___

### **Critical Issues Found:**
1. _______________
2. _______________

### **Minor Issues Found:**
1. _______________
2. _______________

### **Recommendations:**
1. _______________
2. _______________

---

## ✅ **TESTING COMPLETE**

**Tested By:** _______________
**Date:** _______________
**Environment:** EC2 Server (http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:3000)
**Backend:** EC2 Server (http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001)

**Status:** [ ] All Tests Passed  [ ] Issues Found  [ ] Needs Review

