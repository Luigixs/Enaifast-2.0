-- Admin pode ver TODAS as stats de TODOS os usuários
CREATE POLICY "Admins can view all stats"
ON public.user_stats
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin pode inserir stats para qualquer usuário
CREATE POLICY "Admins can insert any stats"
ON public.user_stats
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin pode atualizar stats de qualquer usuário
CREATE POLICY "Admins can update any stats"
ON public.user_stats
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin pode ver todos os logins
CREATE POLICY "Admins can view all logins"
ON public.daily_logins
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin pode inserir logins para qualquer usuário
CREATE POLICY "Admins can insert any logins"
ON public.daily_logins
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));