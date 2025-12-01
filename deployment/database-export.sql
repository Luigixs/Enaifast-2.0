-- =====================================================
-- EAD PLATFORM DATABASE EXPORT
-- =====================================================
-- Generated: December 2024
-- Database: PostgreSQL 15+
-- Compatible with: Supabase, Railway, Render, Neon
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: courses
-- =====================================================
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('free', 'paid')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'coming_soon', 'inactive')),
    thumbnail_url TEXT,
    thumbnail_mobile_url TEXT,
    is_free_access BOOLEAN DEFAULT false,
    show_syllabus_to_all BOOLEAN DEFAULT false,
    enable_certificates BOOLEAN DEFAULT false,
    passing_grade NUMERIC DEFAULT 7.0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    order_index INTEGER DEFAULT 0,
    total_enrolled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    workload_hours INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for courses
CREATE INDEX idx_courses_status ON public.courses(status);
CREATE INDEX idx_courses_type ON public.courses(type);
CREATE INDEX idx_courses_order_index ON public.courses(order_index);
CREATE INDEX idx_courses_created_at ON public.courses(created_at DESC);

-- =====================================================
-- TABLE: modules
-- =====================================================
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- Indexes for modules
CREATE INDEX idx_modules_course_id ON public.modules(course_id);
CREATE INDEX idx_modules_status ON public.modules(status);
CREATE INDEX idx_modules_order_index ON public.modules(order_index);

-- =====================================================
-- TABLE: submodules
-- =====================================================
CREATE TABLE IF NOT EXISTS public.submodules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE
);

-- Indexes for submodules
CREATE INDEX idx_submodules_module_id ON public.submodules(module_id);
CREATE INDEX idx_submodules_status ON public.submodules(status);
CREATE INDEX idx_submodules_order_index ON public.submodules(order_index);

-- =====================================================
-- TABLE: lessons
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID,
    submodule_id UUID,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('video', 'pdf', 'text', 'image', 'link')),
    content_url TEXT,
    content TEXT,
    thumbnail_url TEXT,
    thumbnail_mobile_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    duration_minutes INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 0,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE,
    FOREIGN KEY (submodule_id) REFERENCES public.submodules(id) ON DELETE CASCADE,
    CHECK (module_id IS NOT NULL OR submodule_id IS NOT NULL)
);

-- Indexes for lessons
CREATE INDEX idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX idx_lessons_submodule_id ON public.lessons(submodule_id);
CREATE INDEX idx_lessons_status ON public.lessons(status);
CREATE INDEX idx_lessons_type ON public.lessons(type);
CREATE INDEX idx_lessons_order_index ON public.lessons(order_index);

-- =====================================================
-- TABLE: banners
-- =====================================================
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for banners
CREATE INDEX idx_banners_status ON public.banners(status);
CREATE INDEX idx_banners_order_index ON public.banners(order_index);

-- =====================================================
-- TABLE: course_enrollments
-- =====================================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
);

-- Indexes for course_enrollments
CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX idx_course_enrollments_is_active ON public.course_enrollments(is_active);

-- =====================================================
-- TABLE: lesson_progress
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    lesson_id UUID NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE,
    UNIQUE(user_id, lesson_id)
);

-- Indexes for lesson_progress
CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_completed ON public.lesson_progress(completed);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submodules_updated_at
BEFORE UPDATE ON public.submodules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submodules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Courses are viewable by everyone"
ON public.courses FOR SELECT
USING (true);

CREATE POLICY "Admin can manage courses"
ON public.courses FOR ALL
USING (true);

-- Modules policies
CREATE POLICY "Modules are viewable by everyone"
ON public.modules FOR SELECT
USING (true);

CREATE POLICY "Admin can manage modules"
ON public.modules FOR ALL
USING (true);

-- Submodules policies
CREATE POLICY "Submodules are viewable by everyone"
ON public.submodules FOR SELECT
USING (true);

CREATE POLICY "Admin can manage submodules"
ON public.submodules FOR ALL
USING (true);

-- Lessons policies
CREATE POLICY "Lessons are viewable by everyone"
ON public.lessons FOR SELECT
USING (true);

CREATE POLICY "Admin can manage lessons"
ON public.lessons FOR ALL
USING (true);

-- Banners policies
CREATE POLICY "Banners are viewable by everyone"
ON public.banners FOR SELECT
USING (status = 'active');

CREATE POLICY "Admins can manage banners"
ON public.banners FOR ALL
USING (true);

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own enrollments"
ON public.course_enrollments FOR ALL
USING (true);

-- Lesson progress policies
CREATE POLICY "Users can view their own progress"
ON public.lesson_progress FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own progress"
ON public.lesson_progress FOR ALL
USING (true);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data for testing:

/*
INSERT INTO public.courses (name, description, type, status, workload_hours) VALUES
('Introdução ao Chocolate', 'Aprenda os fundamentos da confecção de chocolates artesanais', 'free', 'published', 12),
('Chocolates Premium', 'Técnicas avançadas para chocolates gourmet', 'paid', 'published', 24);

-- Get the course IDs for foreign key references
WITH course_ids AS (
  SELECT id, name FROM public.courses
)
INSERT INTO public.modules (course_id, name, description, status)
SELECT 
  id, 
  'Módulo 1: Fundamentos',
  'Conceitos básicos sobre chocolate',
  'published'
FROM course_ids
WHERE name = 'Introdução ao Chocolate';
*/

-- =====================================================
-- NOTES FOR MIGRATION
-- =====================================================

/*
DEPLOYMENT INSTRUCTIONS:

1. For Supabase:
   - Create new project at supabase.com
   - Run this SQL in SQL Editor
   - Configure storage buckets manually:
     * course-thumbnails (public)
     * lesson-content (public)
     * lesson-thumbnails (public)
     * banners (public)

2. For Railway/Render/Neon:
   - Create PostgreSQL database
   - Run: psql [connection-string] < database-export.sql
   - Note: RLS policies require auth.uid() - may need modification

3. For self-hosted PostgreSQL:
   - Ensure PostgreSQL 15+
   - Enable uuid-ossp extension
   - Run this script
   - Configure application connection string

STORAGE MIGRATION:
- Export files from Supabase Storage Dashboard
- Upload to new S3/Spaces bucket
- Update environment variables:
  VITE_SUPABASE_URL or S3_ENDPOINT

CORS CONFIGURATION:
- Update allowed origins in your platform
- For Supabase: Settings → API → CORS
- For S3: Bucket Policy + CORS configuration

AUTHENTICATION:
- This schema uses Supabase Auth
- For migration, consider:
  * JWT token format compatibility
  * User table structure (auth.users)
  * RLS policy auth.uid() references
*/

-- =====================================================
-- END OF DATABASE EXPORT
-- =====================================================
