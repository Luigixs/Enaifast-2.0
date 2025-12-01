-- Update role enum to include professor
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'professor';

-- Create function to get all users with their roles
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  role app_role,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id as user_id,
    au.email,
    ur.role,
    au.created_at
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY au.created_at DESC;
$$;