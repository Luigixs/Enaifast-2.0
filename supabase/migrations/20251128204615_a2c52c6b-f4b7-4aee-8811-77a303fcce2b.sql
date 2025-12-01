-- Adicionar parent_comment_id se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lesson_comments' 
    AND column_name = 'parent_comment_id'
  ) THEN
    ALTER TABLE public.lesson_comments 
    ADD COLUMN parent_comment_id uuid REFERENCES public.lesson_comments(id) ON DELETE CASCADE;
    
    CREATE INDEX idx_lesson_comments_parent ON public.lesson_comments(parent_comment_id);
  END IF;
END $$;

-- Atualizar política de insert para verificar se é resposta e se é admin
DROP POLICY IF EXISTS "Usuários podem criar seus próprios comentários" ON public.lesson_comments;

CREATE POLICY "Usuários podem criar comentários" 
ON public.lesson_comments 
FOR INSERT 
WITH CHECK (
  -- Qualquer usuário pode criar comentário de primeiro nível
  (parent_comment_id IS NULL) 
  OR 
  -- Apenas admins podem criar respostas
  (parent_comment_id IS NOT NULL AND has_role(auth.uid(), 'admin'))
);