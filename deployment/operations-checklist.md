# 📋 Operations Checklist - Post-Deployment Testing

## Pre-Deployment Verification

### Code Quality
- [ ] Run `pnpm run build` locally - builds successfully
- [ ] No console errors in development mode
- [ ] All environment variables documented in `env.example`
- [ ] Database schema exported to `database-export.sql`
- [ ] All dependencies listed in `package.json`

### Environment Configuration
- [ ] `.env` file created with production values
- [ ] `VITE_SUPABASE_URL` points to production database
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is correct
- [ ] CORS domains updated in Supabase dashboard
- [ ] Storage bucket URLs are correct

### Backup
- [ ] Database backup created
- [ ] Storage files backed up
- [ ] Current deployment files archived
- [ ] Git repository up to date

---

## Deployment Execution Checklist

### Frontend Deployment
- [ ] Build completed: `pnpm run build`
- [ ] `dist` folder generated (size: ~2-5MB)
- [ ] Files uploaded to hosting (HostGator/Vercel/Netlify)
- [ ] `.htaccess` file present (for HostGator)
- [ ] File permissions set correctly (644/755)

### Backend Configuration
- [ ] Supabase project accessible
- [ ] Database connection tested
- [ ] Edge functions deployed (if any)
- [ ] Storage buckets accessible

### DNS & SSL
- [ ] DNS records updated (A or CNAME)
- [ ] SSL certificate installed
- [ ] HTTPS redirects working
- [ ] www and non-www both work

---

## Functional Testing (Post-Deploy)

### 1. Homepage & Navigation ✓

**Test Case:** Homepage loads correctly
```
Steps:
1. Navigate to https://yourdomain.com
2. Wait for page to fully load
3. Check browser console for errors

Expected Results:
- ✓ Page loads within 3 seconds
- ✓ No console errors
- ✓ Banner carousel visible
- ✓ Navigation menu works
- ✓ Responsive on mobile

Status: [ ] Pass  [ ] Fail
Notes: _________________________________
```

**Test Case:** Student/Admin navigation
```
Steps:
1. Click on "Aluno" menu
2. Expand "Diretor" menu
3. Navigate between sections

Expected Results:
- ✓ Both menus expand independently
- ✓ Links navigate correctly
- ✓ Active route highlighted

Status: [ ] Pass  [ ] Fail
```

---

### 2. Course Viewing (Student) ✓

**Test Case:** View courses list
```
Steps:
1. Navigate to /student/courses
2. Wait for courses to load

Expected Results:
- ✓ Courses displayed in carousel
- ✓ Course thumbnails load
- ✓ "Em Progresso" only shows if user has progress
- ✓ No "Meus Cursos" or "Continue de onde parou" text

Status: [ ] Pass  [ ] Fail
Database Query:
SELECT COUNT(*) FROM courses; -- Should return > 0
```

**Test Case:** View course details
```
Steps:
1. Click on any course card
2. Navigate to course detail page
3. View modules and lessons

Expected Results:
- ✓ Course banner displays
- ✓ Modules shown as cards
- ✓ Module thumbnails load
- ✓ Click module opens lessons
- ✓ Progress bar visible on cards (if progress exists)

Status: [ ] Pass  [ ] Fail
```

**Test Case:** View lesson content
```
Steps:
1. Open a course
2. Click on a lesson
3. Verify content displays

Test different lesson types:
- [ ] Video lessons play correctly
- [ ] PDF lessons render (check PDF.js)
- [ ] Text lessons show formatted content
- [ ] Image lessons display
- [ ] External links open correctly

Expected Results:
- ✓ Content loads without errors
- ✓ Video player functional
- ✓ PDF scrolls and zooms
- ✓ Rich text formatting preserved

Status: [ ] Pass  [ ] Fail
Notes: _________________________________
```

---

### 3. Admin Functions ✓

**Test Case:** Admin authentication
```
Steps:
1. Navigate to /admin
2. Check if authentication required
3. Login if prompted

Expected Results:
- ✓ Unauthenticated users redirected
- ✓ Login form works
- ✓ Admin dashboard loads

Status: [ ] Pass  [ ] Fail
```

**Test Case:** Create new course
```
Steps:
1. Navigate to /admin/courses
2. Click "Add Course" button
3. Fill in course details:
   - Name: "Test Course"
   - Description: "Test Description"
   - Type: "free" or "paid"
   - Status: "draft"
4. Upload thumbnail (optional)
5. Click Save

Expected Results:
- ✓ Form validates input
- ✓ Course created in database
- ✓ Thumbnail uploaded to storage (if provided)
- ✓ Success toast notification
- ✓ Redirected to course detail

Status: [ ] Pass  [ ] Fail
Database Query:
SELECT * FROM courses WHERE name = 'Test Course';
```

**Test Case:** Add module to course
```
Steps:
1. Open created test course
2. Click "Add Module"
3. Enter module details
4. Save module

Expected Results:
- ✓ Module created
- ✓ Module appears in course
- ✓ order_index set correctly

Status: [ ] Pass  [ ] Fail
```

**Test Case:** Add lesson with content preview
```
Steps:
1. Open a module
2. Click "Add Lesson"
3. Fill lesson details
4. Upload content (video/PDF/image)
5. Verify preview appears
6. Confirm upload success message
7. Save lesson

Expected Results:
- ✓ Content preview displays before save
- ✓ Upload confirmation message
- ✓ Lesson saves successfully
- ✓ Content accessible from student view

Test each content type:
- [ ] Video: .mp4 file
- [ ] PDF: .pdf file
- [ ] Image: .jpg/.png
- [ ] Text: Rich text editor
- [ ] Link: External URL

Status: [ ] Pass  [ ] Fail
Notes: _________________________________
```

**Test Case:** Drag-and-drop reordering
```
Steps:
1. Create 3+ courses/modules/lessons
2. Drag items to reorder
3. Verify order persists after page refresh

Expected Results:
- ✓ Items reorder smoothly
- ✓ order_index updated in database
- ✓ New order persists

Status: [ ] Pass  [ ] Fail
Database Query:
SELECT name, order_index FROM courses ORDER BY order_index;
```

---

### 4. Storage & Media ✓

**Test Case:** Upload course thumbnail
```
Steps:
1. Edit a course
2. Upload thumbnail image (16:9 ratio)
3. Verify preview shows
4. Save course
5. Check thumbnail displays on course card

Expected Results:
- ✓ Image uploads to 'course-thumbnails' bucket
- ✓ Preview visible before save
- ✓ Thumbnail URL saved in database
- ✓ Image loads on course card
- ✓ Image responsive on mobile

Status: [ ] Pass  [ ] Fail
Storage Check:
- Bucket: course-thumbnails
- File naming: [uuid].jpg/png
```

**Test Case:** Upload lesson content (PDF)
```
Steps:
1. Create lesson with type "PDF"
2. Upload PDF file
3. Preview PDF before saving
4. Save lesson
5. Open lesson as student
6. Verify PDF renders correctly

Expected Results:
- ✓ PDF uploads to 'lesson-content' bucket
- ✓ Preview shows in admin panel
- ✓ PDF loads in student view
- ✓ PDF.js renders pages
- ✓ Zoom and scroll work
- ✓ No CORS errors in console

Status: [ ] Pass  [ ] Fail
```

**Test Case:** Upload lesson content (Video)
```
Steps:
1. Create lesson with type "Video"
2. Upload video file (.mp4)
3. Preview video before saving
4. Save lesson
5. Open lesson as student
6. Play video

Expected Results:
- ✓ Video uploads to 'lesson-content' bucket
- ✓ Preview plays in admin
- ✓ Video player loads in student view
- ✓ Play/pause controls work
- ✓ Video streams smoothly

Status: [ ] Pass  [ ] Fail
```

**Test Case:** Banner image upload
```
Steps:
1. Navigate to banner management
2. Upload banner image (16:6 ratio)
3. Set title and link
4. Save banner
5. Verify on homepage

Expected Results:
- ✓ Image uploads to 'banners' bucket
- ✓ Banner displays on homepage
- ✓ Clicking banner navigates to link

Status: [ ] Pass  [ ] Fail
```

---

### 5. Progress Tracking ✓

**Test Case:** Lesson progress updates
```
Steps:
1. As student, open a lesson
2. Mark lesson as complete
3. Verify progress updates

Expected Results:
- ✓ lesson_progress record created
- ✓ Progress bar updates on cards
- ✓ Course progress percentage updates
- ✓ "Em Progresso" section shows course

Status: [ ] Pass  [ ] Fail
Database Query:
SELECT * FROM lesson_progress WHERE user_id = '[test-user-id]';
```

**Test Case:** Progress visibility logic
```
Steps:
1. View new course (no progress)
2. Enter course and view one lesson
3. Return to courses list
4. Check if progress bar now appears

Expected Results:
- ✓ New courses show no progress bar
- ✓ Progress bar appears after interaction
- ✓ Percentage accurate

Status: [ ] Pass  [ ] Fail
```

---

### 6. Database Operations ✓

**Test Case:** Database queries execute
```
Steps:
1. Run test queries from deployment SQL

Query 1: Count courses
SELECT COUNT(*) FROM courses;

Query 2: Get course with modules
SELECT c.name, m.name as module_name 
FROM courses c 
LEFT JOIN modules m ON c.id = m.course_id 
WHERE c.id = '[test-course-id]';

Query 3: Check RLS policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

Expected Results:
- ✓ All queries execute without errors
- ✓ RLS policies active
- ✓ Foreign keys working

Status: [ ] Pass  [ ] Fail
```

**Test Case:** Data integrity
```
Steps:
1. Create course → module → lesson chain
2. Delete course
3. Verify cascade delete works

Expected Results:
- ✓ Foreign keys enforce relationships
- ✓ Cascade deletes work
- ✓ No orphaned records

Status: [ ] Pass  [ ] Fail
```

---

### 7. Performance ✓

**Test Case:** Page load speed
```
Steps:
1. Open Chrome DevTools → Network
2. Clear cache
3. Load homepage
4. Check load times

Benchmarks:
- Homepage: < 3 seconds
- Course list: < 2 seconds
- Lesson content: < 5 seconds

Status: [ ] Pass  [ ] Fail
Results: 
- Time to First Byte: _____ms
- Largest Contentful Paint: _____ms
- Total Load Time: _____ms
```

**Test Case:** Large file handling
```
Steps:
1. Upload large video (>50MB)
2. Upload large PDF (>10MB)
3. Monitor upload progress
4. Verify files load correctly

Expected Results:
- ✓ Upload progress indicator works
- ✓ Large files upload successfully
- ✓ Files stream/load properly
- ✓ No timeout errors

Status: [ ] Pass  [ ] Fail
```

---

### 8. Cross-Browser Testing ✓

Test in multiple browsers:

**Chrome/Edge (Chromium)**
- [ ] All features work
- [ ] No console errors
- [ ] Layout correct

**Firefox**
- [ ] All features work
- [ ] Video/PDF playback works
- [ ] Layout correct

**Safari (macOS/iOS)**
- [ ] All features work
- [ ] Video formats compatible
- [ ] Touch interactions work

**Mobile Browsers**
- [ ] Responsive layout
- [ ] Touch navigation
- [ ] Video playback
- [ ] Forms usable

---

### 9. Responsive Design ✓

**Test Case:** Mobile responsiveness
```
Steps:
1. Open site on mobile device or DevTools
2. Test viewport sizes:
   - 320px (small phone)
   - 375px (iPhone)
   - 768px (tablet)
   - 1024px (desktop)

Expected Results:
- ✓ Cards full-width on mobile
- ✓ Carousel scrolls horizontally
- ✓ Navigation menu accessible
- ✓ Forms usable
- ✓ Images scale correctly
- ✓ Text readable without zoom

Status: [ ] Pass  [ ] Fail
```

---

### 10. Security ✓

**Test Case:** RLS policies active
```
Steps:
1. Check Supabase dashboard → Authentication
2. Verify RLS enabled on all tables
3. Test unauthorized access

Expected Results:
- ✓ RLS enabled on all tables
- ✓ Unauthenticated users can only read public data
- ✓ Admin routes protected

Status: [ ] Pass  [ ] Fail
Query:
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

**Test Case:** CORS configuration
```
Steps:
1. Open browser console
2. Make API requests
3. Check for CORS errors

Expected Results:
- ✓ No CORS errors
- ✓ Allowed origins configured
- ✓ Credentials handled properly

Status: [ ] Pass  [ ] Fail
```

**Test Case:** Environment variables secure
```
Steps:
1. View page source
2. Check Network tab
3. Verify no secrets exposed

Expected Results:
- ✓ No secret keys in source code
- ✓ Only public keys (VITE_*) exposed
- ✓ Service role key not in frontend

Status: [ ] Pass  [ ] Fail
```

---

## Error Handling Tests

### Test Case: Network failure handling
```
Steps:
1. Open DevTools → Network
2. Set to "Offline" mode
3. Try to load courses

Expected Results:
- ✓ Graceful error message
- ✓ No white screen
- ✓ Retry mechanism

Status: [ ] Pass  [ ] Fail
```

### Test Case: Invalid data handling
```
Steps:
1. Submit form with invalid data
2. Try to access non-existent course
3. Upload invalid file type

Expected Results:
- ✓ Validation messages clear
- ✓ 404 page for missing content
- ✓ File type validation works

Status: [ ] Pass  [ ] Fail
```

---

## SEO & Analytics

### Test Case: Meta tags present
```
Steps:
1. View page source
2. Check meta tags

Required tags:
- [ ] <title> tag present
- [ ] <meta name="description"> present
- [ ] <meta property="og:*"> for social sharing
- [ ] Canonical URL set

Status: [ ] Pass  [ ] Fail
```

### Test Case: robots.txt accessible
```
Steps:
1. Navigate to /robots.txt
2. Verify allows crawling

Status: [ ] Pass  [ ] Fail
```

---

## Monitoring Setup

### Post-Deployment Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry, LogRocket)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Database backup schedule configured
- [ ] Alert email/SMS configured

---

## Final Sign-Off

### Deployment Complete
- [ ] All critical tests pass
- [ ] No console errors on production
- [ ] Performance within acceptable range
- [ ] Monitoring active
- [ ] Documentation updated
- [ ] Team notified

**Deployed by:** _____________________  
**Date:** ___________________________  
**Production URL:** __________________  
**Version:** ________________________  

**Sign-off:**  
- [ ] Developer: ____________________
- [ ] QA: ___________________________
- [ ] Product Owner: ________________

---

## Rollback Plan

If critical issues found:

1. **Immediate rollback:**
   ```bash
   # For HostGator: re-upload previous 'dist' folder
   # For Vercel: vercel rollback
   # For database: restore from backup
   ```

2. **Notify stakeholders**

3. **Document issues**

4. **Fix and re-test**

5. **Re-deploy**

---

## Support Contacts

**Hosting Support:**
- HostGator: https://www.hostgator.com/help

**Database Support:**
- Supabase: support@supabase.io
- Docs: https://supabase.com/docs

**Emergency Contacts:**
- Developer: _____________________
- DevOps: ________________________
- Product Owner: _________________

---

**Checklist Version:** 1.0  
**Last Updated:** December 2024
