# ArtistKatta - Complete Testing Guide

## 🧪 **HOW TO TEST THE APPLICATION**

---

## 📱 **TESTING OPTIONS**

You have **3 workspaces** to test:
1. **Web App** - `C:\Server`
2. **Mobile App** - `C:\artist-katta-app`
3. **Backend Server** - `C:\artistkatta-server`

---

## 🌐 **1. TESTING WEB APP (C:\Server)**

### **Local Testing (Your PC)**

#### **Step 1: Start Backend Server**
```bash
# Terminal 1 - Backend Server
cd C:\artistkatta-server
node server.js

# Should show:
# ✅ MongoDB connected successfully
# ✅ Server running on http://localhost:5001
```

#### **Step 2: Start Web App**
```bash
# Terminal 2 - Web App
cd C:\Server
npm run dev

# Should show:
# ✓ Ready in Xms
# ○ Local:   http://localhost:3000
# ○ Network: http://0.0.0.0:3000
```

#### **Step 3: Open in Browser**
```
http://localhost:3000
```

### **Test Locally:**
1. **Signup:** Create a new account
2. **Login:** Login with created account
3. **Dashboard:** Should load with splash screen
4. **Profile:** Upload profile picture
5. **Jobs:** Browse and post jobs
6. **Network:** Search and connect with users
7. **Messages:** Send messages to connections

---

### **EC2 Server Testing (Live)**

#### **Access the Live App:**
```
http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:3000
```

#### **Check Server Status:**
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@ec2-15-206-211-190.ap-south-1.compute.amazonaws.com

# Check if app is running
pm2 status

# Check logs
pm2 logs artistkatta

# Restart if needed
pm2 restart artistkatta
```

---

## 📱 **2. TESTING MOBILE APP (C:\artist-katta-app)**

### **Option A: Web Browser Testing (Quick)**

#### **Step 1: Configure API**
```bash
cd C:\artist-katta-app

# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:5001/api > .env.local

# Or for EC2 testing:
echo NEXT_PUBLIC_API_URL=http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api > .env.local
```

#### **Step 2: Start Backend** (if testing locally)
```bash
# Terminal 1
cd C:\artistkatta-server
node server.js
```

#### **Step 3: Start Mobile App**
```bash
# Terminal 2
cd C:\artist-katta-app
npm install  # First time only
npm run dev

# Opens at:
# http://localhost:3000 (or next available port)
```

#### **Step 4: Test in Browser**
- Open Chrome/Edge
- Press `F12` → Toggle device toolbar (Ctrl+Shift+M)
- Select "iPhone 12 Pro" or "Pixel 5"
- Navigate through the app
- Test bottom navigation
- Test all features

**Note:** Native features (camera, haptics) won't work in browser!

---

### **Option B: Android Emulator Testing**

#### **Prerequisites:**
- Android Studio installed
- Android SDK configured
- Android Virtual Device (AVD) created

#### **Step 1: Build the App**
```bash
cd C:\artist-katta-app

# Install dependencies
npm install

# Build for production
npm run build

# Sync with Capacitor
npx cap sync android
```

#### **Step 2: Open in Android Studio**
```bash
npx cap open android
```

#### **Step 3: Run in Emulator**
1. In Android Studio:
   - Click "Run" (green play button)
   - Select your Android emulator
   - Wait for app to install and launch

2. Test the app:
   - Test bottom navigation
   - Test camera (emulator camera)
   - Test all features

---

### **Option C: Real Android Device Testing**

#### **Step 1: Enable Developer Mode**
On your Android phone:
1. Go to Settings → About phone
2. Tap "Build number" 7 times
3. Enable "USB Debugging" in Developer options

#### **Step 2: Connect Device**
```bash
# Connect phone via USB
# Allow USB debugging on phone

# Verify connection
adb devices
# Should show your device
```

#### **Step 3: Build and Install**
```bash
cd C:\artist-katta-app

# Build
npm run build
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# - Select your physical device
# - Click Run
```

#### **Step 4: Test on Real Device**
- App installs on your phone
- Test all features
- Test camera (real camera!)
- Test haptic feedback
- Test native sharing
- Test performance

---

### **Option D: Build APK for Distribution**

#### **Step 1: Build Release APK**
```bash
cd C:\artist-katta-app

# Build web app
npm run build

# Sync to Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

#### **Step 2: Generate Signed APK**
In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Select APK
3. Create or select keystore
4. Build release APK
5. APK location: `android/app/build/outputs/apk/release/`

#### **Step 3: Install on Device**
```bash
# Install via ADB
adb install path/to/app-release.apk

# Or transfer APK to phone and install manually
```

---

## 🖥️ **3. TESTING BACKEND SERVER (C:\artistkatta-server)**

### **Local Testing**

#### **Start Server:**
```bash
cd C:\artistkatta-server
node server.js

# Should show:
# ✅ MongoDB connected successfully
# ✅ Server running on http://localhost:5001
```

#### **Test API Endpoints:**

**Test Login:**
```bash
curl -X POST http://localhost:5001/api/logindata \
  -H "Content-Type: application/json" \
  -d '{"emailId":"test@example.com","password":"Test@1234"}'
```

**Test Jobs:**
```bash
curl http://localhost:5001/api/jobs
```

**Test with Postman:**
1. Import ArtistKatta API collection
2. Test all endpoints
3. Verify responses

---

## 🧪 **COMPLETE TESTING WORKFLOW**

### **Scenario 1: Full Local Testing**

```bash
# Terminal 1: Backend
cd C:\artistkatta-server
node server.js

# Terminal 2: Web App
cd C:\Server
npm run dev

# Terminal 3: Mobile App
cd C:\artist-katta-app
npm run dev
```

**Then:**
- Web App: `http://localhost:3000`
- Mobile App: `http://localhost:3001` (or next available port)
- Backend: `http://localhost:5001`

---

### **Scenario 2: Testing Web on EC2, Mobile Locally**

```bash
# Web App already deployed on EC2
# Just access: http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:3000

# Terminal 1: Backend (if not on EC2)
cd C:\artistkatta-server
node server.js

# Terminal 2: Mobile App
cd C:\artist-katta-app

# Configure to use EC2 backend
# Edit .env.local:
NEXT_PUBLIC_API_URL=http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api

npm run dev
```

---

### **Scenario 3: Testing Mobile as Native Android App**

```bash
# Build and sync
cd C:\artist-katta-app
npm run build
npx cap sync android
npx cap open android

# In Android Studio:
# - Select device/emulator
# - Click Run
# - App launches on device
```

**Test:**
- All navigation works
- Camera opens and captures
- Haptic feedback on interactions
- Share functionality works
- App doesn't crash
- API calls work

---

## 📋 **FEATURE TESTING CHECKLIST:**

### **Web App Testing:**
- [ ] Dashboard loads with splash screen
- [ ] All menus work (no empty spaces)
- [ ] User avatar displays correctly
- [ ] Stats cards show data
- [ ] Job posting works (single + bulk)
- [ ] Connection requests work
- [ ] Messaging works
- [ ] Search with filters works
- [ ] Category pages load
- [ ] Profile parameters save
- [ ] All error messages show "ArtistKatta:"

### **Mobile App Testing:**
- [ ] Splash screen shows on app launch
- [ ] Login/Signup works
- [ ] Bottom navigation works
- [ ] Home feed displays posts
- [ ] Jobs tab shows jobs
- [ ] Events tab shows events
- [ ] Camera button works (native only)
- [ ] Share button works (native only)
- [ ] Haptic feedback works (native only)
- [ ] Profile displays correctly
- [ ] Network/Connections work
- [ ] Chat/Messaging works

### **Backend Testing:**
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] All API endpoints respond
- [ ] Authentication works
- [ ] Token validation works
- [ ] CORS allows requests
- [ ] Error handling works

---

## 🔧 **DEBUGGING TOOLS:**

### **Web App:**
```bash
# Check for errors
npm run build  # Should complete without errors

# Check linting
npm run lint

# View logs in browser
# F12 → Console tab
```

### **Mobile App:**
```bash
# Check for errors
npm run build

# Android logs (when testing on device)
adb logcat | grep -i "artist"

# View in Chrome DevTools (for web testing)
# F12 → Console tab
```

### **Backend:**
```bash
# Check server logs
# Look at console output

# Check MongoDB connection
# Verify MongoDB Atlas is accessible

# Test specific endpoint
curl -v http://localhost:5001/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🌐 **BROWSER TESTING (Web App):**

### **Recommended Browsers:**
- ✅ Chrome (Desktop + Mobile view)
- ✅ Edge (Desktop + Mobile view)
- ✅ Firefox
- ✅ Safari (Mac only)

### **Responsive Testing:**
1. **Desktop:** 1920x1080 (Full layout with sidebar)
2. **Laptop:** 1366x768 (Laptop view)
3. **Tablet:** 768x1024 (iPad)
4. **Mobile:** 375x667 (iPhone SE)
5. **Mobile:** 414x896 (iPhone 11)

### **Browser DevTools:**
```
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
Select different devices
Test all features on each size
```

---

## 📱 **MOBILE DEVICE TESTING:**

### **Android Testing Options:**

**1. Android Emulator (Free)**
- Download Android Studio
- Create AVD (Pixel 5 recommended)
- Install and test app

**2. Real Android Device (Best)**
- Enable Developer Mode
- Enable USB Debugging
- Connect via USB
- Install via Android Studio or ADB

**3. Browser Mobile View (Quick)**
- Open Chrome
- Press F12
- Toggle device toolbar
- Select Android device

### **iOS Testing Options:**

**1. iOS Simulator (Mac only)**
- Requires macOS + Xcode
- `npx cap open ios`
- Run in simulator

**2. Real iPhone (Best)**
- Requires Apple Developer account
- Mac with Xcode
- Physical iPhone connected

**3. Browser Mobile View (Quick)**
- Open Safari/Chrome
- Press F12
- Toggle device toolbar
- Select iPhone model

---

## 🧪 **AUTOMATED TESTING (Future):**

### **Unit Tests:**
```bash
# Web App
cd C:\Server
npm test

# Mobile App
cd C:\artist-katta-app
npm test
```

### **E2E Tests:**
```bash
# Install Playwright/Cypress
npm install -D @playwright/test

# Run E2E tests
npx playwright test
```

---

## 📊 **PERFORMANCE TESTING:**

### **Web App Performance:**
```bash
# Lighthouse in Chrome DevTools
# F12 → Lighthouse tab → Generate report

# Check:
# - Performance score
# - Accessibility
# - Best practices
# - SEO
```

### **Mobile App Performance:**
```bash
# Android Studio Profiler
# - CPU usage
# - Memory usage
# - Network activity
# - Battery usage
```

---

## 🔍 **API TESTING:**

### **Using Postman:**

**Import these endpoints:**

**1. Login**
```
POST http://localhost:5001/api/logindata
Body: {
  "emailId": "test@example.com",
  "password": "Test@1234"
}
```

**2. Get Current User**
```
GET http://localhost:5001/api/me
Headers: Authorization: Bearer YOUR_TOKEN
```

**3. Create Job**
```
POST http://localhost:5001/api/jobs
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "title": "Test Job",
  "description": "Test Description",
  ...
}
```

### **Using cURL:**

```bash
# Login
curl -X POST http://localhost:5001/api/logindata \
  -H "Content-Type: application/json" \
  -d '{"emailId":"test@example.com","password":"Test@1234"}'

# Get Jobs
curl http://localhost:5001/api/jobs

# With Authentication
curl http://localhost:5001/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 **TEST SCENARIOS:**

### **Complete User Journey Test:**

#### **1. New User Signup**
```
1. Go to /signup (web) or /auth/signup (mobile)
2. Fill in all fields:
   - Full Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "Test@1234"
   - Category: "Artist"
   - Type: "Painter"
   - City: "Mumbai"
   - Country: "India"
3. Submit form
4. ✅ Should redirect to dashboard/home
5. ✅ Should show welcome message
```

#### **2. Login**
```
1. Go to /login (web) or /auth/login (mobile)
2. Enter credentials
3. Click Sign In
4. ✅ Should see splash screen (web)
5. ✅ Should redirect to dashboard/home
6. ✅ Profile avatar should display
```

#### **3. Profile Management**
```
1. Go to Profile
2. Click "Edit Cover" / "Edit Profile"
3. Upload images
4. Fill in category-specific fields
5. Save changes
6. ✅ Images should update
7. ✅ Data should persist
```

#### **4. Job Management (Company User)**
```
1. Login as company user
2. Go to /jobs/new
3. Post a single job
4. ✅ Job should appear in listings
5. Try bulk upload
6. ✅ Should show "Successfully uploaded X out of Y"
```

#### **5. Networking**
```
1. Go to /network (web) or /my-network (mobile)
2. Search for users
3. Send connection request
4. ✅ Should show "Connection request sent!"
5. Login as other user
6. Check Requests tab
7. ✅ Should see pending request
8. Accept connection
9. ✅ Should move to Connections tab
```

#### **6. Messaging**
```
1. Go to /messages (web) or /chat (mobile)
2. Click on a connection
3. Type and send message
4. ✅ Message should appear immediately
5. Login as other user
6. Check messages
7. ✅ Should see the message
```

---

## 🔧 **TESTING COMMANDS:**

### **Web App**
```bash
cd C:\Server

# Development
npm run dev              # Start dev server

# Production build
npm run build            # Build for production
npm run start            # Start production server

# Linting
npm run lint             # Check for errors

# Clean
npm run clean            # Remove build artifacts
```

### **Mobile App**
```bash
cd C:\artist-katta-app

# Development
npm run dev              # Start dev server (web mode)

# Production build
npm run build            # Build Next.js app

# Capacitor commands
npx cap sync             # Sync web to native
npx cap sync android     # Sync to Android only
npx cap open android     # Open in Android Studio
npx cap run android      # Build and run on device

# Quick APK build
./build-apk-quick.sh     # If script exists
```

### **Backend Server**
```bash
cd C:\artistkatta-server

# Start server
node server.js           # Start backend

# Or with nodemon (auto-reload)
npx nodemon server.js

# Check MongoDB
# - Ensure connection string is correct
# - Verify MongoDB Atlas is accessible
```

---

## 🔥 **TESTING MOBILE APP ON ANDROID:**

### **Complete Android Testing Steps:**

#### **Step 1: Setup Environment**
```bash
# Install Android Studio (first time only)
# Download from: https://developer.android.com/studio

# Install Capacitor CLI
npm install -g @capacitor/cli

# Verify installation
cap --version
```

#### **Step 2: Configure API Endpoint**
```bash
cd C:\artist-katta-app

# Edit .env.local (create if not exists)
# For local testing:
NEXT_PUBLIC_API_URL=http://10.0.2.2:5001/api  # Android emulator

# For real device on same network:
NEXT_PUBLIC_API_URL=http://YOUR_PC_IP:5001/api

# For EC2 server:
NEXT_PUBLIC_API_URL=http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api
```

#### **Step 3: Build and Install**
```bash
# Install dependencies
npm install

# Build Next.js app
npm run build

# Copy to Capacitor
npx cap copy android

# Sync native dependencies
npx cap sync android

# Open in Android Studio
npx cap open android
```

#### **Step 4: Run on Device/Emulator**
In Android Studio:
1. Wait for Gradle sync to complete
2. Select target device (emulator or physical)
3. Click green "Run" button
4. App installs and launches

#### **Step 5: Test Features**
- ✅ App launches with splash screen
- ✅ Login works
- ✅ Bottom navigation works
- ✅ Camera opens when clicking camera button
- ✅ Haptic feedback on button press
- ✅ Share functionality works
- ✅ All API calls work

---

## 📱 **QUICK MOBILE TESTING (Browser)**

**Fastest way to test mobile UI:**

```bash
# Terminal 1: Backend
cd C:\artistkatta-server
node server.js

# Terminal 2: Mobile App
cd C:\artist-katta-app
npm run dev
```

Then:
1. Open Chrome
2. Press `F12`
3. Click "Toggle device toolbar" (Ctrl+Shift+M)
4. Select "iPhone 12 Pro" or "Pixel 5"
5. Navigate to `http://localhost:3000`
6. Test the mobile UI

**Limitations:**
- ❌ No camera access
- ❌ No haptic feedback
- ❌ No native sharing
- ✅ UI and navigation work
- ✅ API calls work
- ✅ Authentication works

---

## 🚀 **DEPLOYMENT TESTING:**

### **Testing EC2 Deployed Web App:**
```
URL: http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:3000

Test:
1. Open URL in browser
2. Test signup/login
3. Test all features
4. Check performance
5. Test on mobile browser
```

### **Testing Mobile APK:**
```bash
# Build APK
cd C:\artist-katta-app
npm run build
npx cap sync android
npx cap open android

# In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

# Install on device
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Test on device
```

---

## ⚠️ **COMMON TESTING ISSUES:**

### **Web App:**
**Issue:** "Network Error"
**Solution:** Ensure backend server is running on port 5001

**Issue:** "Token not found"
**Solution:** Login again, check localStorage in DevTools

**Issue:** "CORS error"
**Solution:** Backend should allow CORS from frontend URL

### **Mobile App:**
**Issue:** "API calls fail in emulator"
**Solution:** Use `10.0.2.2` instead of `localhost` for Android emulator

**Issue:** "Camera doesn't work in browser"
**Solution:** Normal - camera only works in native app

**Issue:** "App crashes on launch"
**Solution:** Check Android Studio Logcat for errors

### **Backend:**
**Issue:** "MongoDB connection failed"
**Solution:** Check internet connection, verify MongoDB Atlas credentials

**Issue:** "Port 5001 already in use"
**Solution:** Kill existing process: `netstat -ano | findstr :5001` then kill PID

---

## 📊 **TESTING ENVIRONMENTS:**

### **Development:**
- **Web:** `http://localhost:3000`
- **Mobile:** `http://localhost:3001` or Native app
- **Backend:** `http://localhost:5001`

### **Staging (EC2):**
- **Web:** `http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:3000`
- **Backend:** `http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001`
- **Mobile:** Build APK and install on device

### **Production (Future):**
- **Web:** `https://artistkatta.com`
- **Backend:** `https://api.artistkatta.com`
- **Mobile:** Google Play Store / Apple App Store

---

## 🎯 **RECOMMENDED TESTING ORDER:**

### **Day 1: Local Testing**
1. Start backend server
2. Test web app locally
3. Test mobile app in browser (device mode)
4. Verify all basic features work

### **Day 2: EC2 Testing**
1. Deploy web app to EC2
2. Test web app on EC2
3. Test mobile app (browser) with EC2 backend
4. Verify networking and messaging

### **Day 3: Native Testing**
1. Build Android app
2. Test on Android emulator
3. Test on real device
4. Verify all native features (camera, haptics)

### **Day 4: Complete Testing**
1. Run through complete testing checklist
2. Test all user scenarios
3. Fix any issues found
4. Prepare for deployment

---

## ✅ **TESTING CHECKLIST SUMMARY:**

**Quick Start (5 minutes):**
```bash
# Test Web App Locally
cd C:\artistkatta-server && node server.js &
cd C:\Server && npm run dev
# Open: http://localhost:3000
```

**Test Mobile UI (10 minutes):**
```bash
# Test Mobile in Browser
cd C:\artist-katta-app && npm run dev
# Open Chrome, F12, device mode
# Navigate to: http://localhost:3000
```

**Test Mobile Native (30 minutes):**
```bash
# Build and test on Android
cd C:\artist-katta-app
npm run build
npx cap sync android
npx cap open android
# Click Run in Android Studio
```

---

## 🎉 **RESULT:**

You have **3 ways to test**:
1. ✅ **Local (PC)** - Fastest, for development
2. ✅ **EC2 (Live)** - For production testing
3. ✅ **Native (Mobile)** - For mobile app features

**All testing methods are ready to use!** 🚀


