# Company Profile Updates Needed

## **Issues Identified:**

1. ❌ Images not displaying - Loading only from sessionStorage
2. ❌ No share button functionality
3. ❌ Using old AWS API Gateway for uploads
4. ❌ Not using MongoDB API for saving

## **Required Changes:**

### 1. Update imports
Add: `Share2, Copy, Check` icons from lucide-react

### 2. Add state for share functionality
```typescript
const [shareCopied, setShareCopied] = useState(false);
```

### 3. Update data loading (lines 281-312)
Replace sessionStorage loading with API fetch to get fresh data from MongoDB

### 4. Add share function
```typescript
const handleShareProfile = async () => {
  // Share profile functionality
}
```

### 5. Update image upload system
- Replace AWS API Gateway with local `/api/upload` endpoint
- Use `ImageUpload` component from `@/components/file-upload`
- Update to use MongoDB API for saving

### 6. Add share button in UI
Add next to company name in the profile header

### 7. Update save functionality
- Use `updateUserProfile` from `@/lib/api`
- Remove AWS API Gateway dependency

## **Files to Update:**

1. `app/profile/company/page.tsx` - Full update needed
2. `app/profile/admin/page.tsx` - Also needs same updates

## **Priority: HIGH**

These updates are critical for company and admin profiles to work properly with the new S3 and MongoDB system.


