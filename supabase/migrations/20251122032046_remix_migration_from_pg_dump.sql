CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    image_url text NOT NULL,
    title text,
    subtitle text,
    link_url text,
    order_index integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT banners_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text])))
);


--
-- Name: course_enrollments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    enrolled_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    progress_percentage integer DEFAULT 0,
    is_active boolean DEFAULT true
);


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    type text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    is_free_access boolean DEFAULT false,
    show_syllabus_to_all boolean DEFAULT false,
    enable_certificates boolean DEFAULT false,
    workload_hours integer DEFAULT 0,
    passing_grade numeric DEFAULT 7.0,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    thumbnail_url text,
    thumbnail_mobile_url text,
    order_index integer DEFAULT 0,
    total_enrolled integer DEFAULT 0,
    total_completed integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT courses_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'coming_soon'::text, 'inactive'::text]))),
    CONSTRAINT courses_type_check CHECK ((type = ANY (ARRAY['free'::text, 'paid'::text])))
);


--
-- Name: lesson_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lesson_favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lesson_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lesson_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    completed boolean DEFAULT false,
    progress_percentage integer DEFAULT 0,
    xp_earned integer DEFAULT 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid,
    submodule_id uuid,
    name text NOT NULL,
    description text,
    type text NOT NULL,
    content_url text,
    content text,
    thumbnail_url text,
    thumbnail_mobile_url text,
    status text DEFAULT 'draft'::text NOT NULL,
    xp_reward integer DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lesson_parent_check CHECK ((((module_id IS NOT NULL) AND (submodule_id IS NULL)) OR ((module_id IS NULL) AND (submodule_id IS NOT NULL)))),
    CONSTRAINT lessons_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text]))),
    CONSTRAINT lessons_type_check CHECK ((type = ANY (ARRAY['video'::text, 'pdf'::text, 'image'::text, 'text'::text, 'link'::text])))
);


--
-- Name: modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'draft'::text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT modules_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


--
-- Name: submodules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submodules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    status text DEFAULT 'draft'::text NOT NULL,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT submodules_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_pkey PRIMARY KEY (id);


--
-- Name: course_enrollments course_enrollments_user_id_course_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_user_id_course_id_key UNIQUE (user_id, course_id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: lesson_comments lesson_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_comments
    ADD CONSTRAINT lesson_comments_pkey PRIMARY KEY (id);


--
-- Name: lesson_favorites lesson_favorites_lesson_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_favorites
    ADD CONSTRAINT lesson_favorites_lesson_id_user_id_key UNIQUE (lesson_id, user_id);


--
-- Name: lesson_favorites lesson_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_favorites
    ADD CONSTRAINT lesson_favorites_pkey PRIMARY KEY (id);


--
-- Name: lesson_notes lesson_notes_lesson_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_notes
    ADD CONSTRAINT lesson_notes_lesson_id_user_id_key UNIQUE (lesson_id, user_id);


--
-- Name: lesson_notes lesson_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_notes
    ADD CONSTRAINT lesson_notes_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_pkey PRIMARY KEY (id);


--
-- Name: lesson_progress lesson_progress_user_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_user_id_lesson_id_key UNIQUE (user_id, lesson_id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: submodules submodules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submodules
    ADD CONSTRAINT submodules_pkey PRIMARY KEY (id);


--
-- Name: idx_banners_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_banners_order ON public.banners USING btree (order_index);


--
-- Name: idx_course_enrollments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_course_enrollments_user_id ON public.course_enrollments USING btree (user_id);


--
-- Name: idx_lesson_comments_lesson_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_comments_lesson_id ON public.lesson_comments USING btree (lesson_id);


--
-- Name: idx_lesson_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_comments_user_id ON public.lesson_comments USING btree (user_id);


--
-- Name: idx_lesson_favorites_lesson_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_favorites_lesson_id ON public.lesson_favorites USING btree (lesson_id);


--
-- Name: idx_lesson_favorites_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_favorites_user_id ON public.lesson_favorites USING btree (user_id);


--
-- Name: idx_lesson_notes_lesson_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_notes_lesson_id ON public.lesson_notes USING btree (lesson_id);


--
-- Name: idx_lesson_notes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_notes_user_id ON public.lesson_notes USING btree (user_id);


--
-- Name: idx_lesson_progress_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lesson_progress_user_id ON public.lesson_progress USING btree (user_id);


--
-- Name: idx_lessons_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_module_id ON public.lessons USING btree (module_id);


--
-- Name: idx_lessons_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_order ON public.lessons USING btree (order_index);


--
-- Name: idx_lessons_submodule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lessons_submodule_id ON public.lessons USING btree (submodule_id);


--
-- Name: idx_modules_course_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_modules_course_id ON public.modules USING btree (course_id);


--
-- Name: idx_modules_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_modules_order ON public.modules USING btree (order_index);


--
-- Name: idx_submodules_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submodules_module_id ON public.submodules USING btree (module_id);


--
-- Name: idx_submodules_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_submodules_order ON public.submodules USING btree (order_index);


--
-- Name: banners update_banners_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: courses update_courses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lesson_progress update_lesson_progress_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lessons update_lessons_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: modules update_modules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: submodules update_submodules_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_submodules_updated_at BEFORE UPDATE ON public.submodules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: course_enrollments course_enrollments_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_enrollments
    ADD CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: lesson_comments lesson_comments_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_comments
    ADD CONSTRAINT lesson_comments_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_favorites lesson_favorites_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_favorites
    ADD CONSTRAINT lesson_favorites_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_notes lesson_notes_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_notes
    ADD CONSTRAINT lesson_notes_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lesson_progress lesson_progress_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT lesson_progress_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: lessons lessons_submodule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_submodule_id_fkey FOREIGN KEY (submodule_id) REFERENCES public.submodules(id) ON DELETE CASCADE;


--
-- Name: modules modules_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: submodules submodules_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submodules
    ADD CONSTRAINT submodules_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: courses Admin can manage courses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage courses" ON public.courses USING (true);


--
-- Name: lessons Admin can manage lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage lessons" ON public.lessons USING (true);


--
-- Name: modules Admin can manage modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage modules" ON public.modules USING (true);


--
-- Name: submodules Admin can manage submodules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage submodules" ON public.submodules USING (true);


--
-- Name: banners Admins can manage banners; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage banners" ON public.banners USING (true) WITH CHECK (true);


--
-- Name: banners Banners are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Banners are viewable by everyone" ON public.banners FOR SELECT USING ((status = 'active'::text));


--
-- Name: courses Courses are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);


--
-- Name: lessons Lessons are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);


--
-- Name: modules Modules are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Modules are viewable by everyone" ON public.modules FOR SELECT USING (true);


--
-- Name: submodules Submodules are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Submodules are viewable by everyone" ON public.submodules FOR SELECT USING (true);


--
-- Name: course_enrollments Users can manage their own enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own enrollments" ON public.course_enrollments USING (true);


--
-- Name: lesson_progress Users can manage their own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can manage their own progress" ON public.lesson_progress USING (true);


--
-- Name: course_enrollments Users can view their own enrollments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own enrollments" ON public.course_enrollments FOR SELECT USING (true);


--
-- Name: lesson_progress Users can view their own progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own progress" ON public.lesson_progress FOR SELECT USING (true);


--
-- Name: lesson_favorites Usuários podem adicionar favoritos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem adicionar favoritos" ON public.lesson_favorites FOR INSERT WITH CHECK (true);


--
-- Name: lesson_comments Usuários podem criar seus próprios comentários; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem criar seus próprios comentários" ON public.lesson_comments FOR INSERT WITH CHECK (true);


--
-- Name: lesson_notes Usuários podem criar suas próprias anotações; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem criar suas próprias anotações" ON public.lesson_notes FOR INSERT WITH CHECK (true);


--
-- Name: lesson_comments Usuários podem deletar seus próprios comentários; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem deletar seus próprios comentários" ON public.lesson_comments FOR DELETE USING (true);


--
-- Name: lesson_notes Usuários podem deletar suas próprias anotações; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem deletar suas próprias anotações" ON public.lesson_notes FOR DELETE USING (true);


--
-- Name: lesson_comments Usuários podem editar seus próprios comentários; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem editar seus próprios comentários" ON public.lesson_comments FOR UPDATE USING (true);


--
-- Name: lesson_notes Usuários podem editar suas próprias anotações; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem editar suas próprias anotações" ON public.lesson_notes FOR UPDATE USING (true);


--
-- Name: lesson_favorites Usuários podem remover seus próprios favoritos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem remover seus próprios favoritos" ON public.lesson_favorites FOR DELETE USING (true);


--
-- Name: lesson_favorites Usuários podem visualizar seus próprios favoritos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem visualizar seus próprios favoritos" ON public.lesson_favorites FOR SELECT USING (true);


--
-- Name: lesson_notes Usuários podem visualizar suas próprias anotações; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem visualizar suas próprias anotações" ON public.lesson_notes FOR SELECT USING (true);


--
-- Name: lesson_comments Usuários podem visualizar todos os comentários; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Usuários podem visualizar todos os comentários" ON public.lesson_comments FOR SELECT USING (true);


--
-- Name: banners; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

--
-- Name: course_enrollments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: courses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_notes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_notes ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

--
-- Name: modules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

--
-- Name: submodules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.submodules ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


