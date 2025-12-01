-- Create permissions table for granular access control
CREATE TABLE public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_key TEXT NOT NULL,
  granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission_key)
);

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Admins can manage all permissions
CREATE POLICY "Admins can manage all permissions"
ON public.user_permissions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own permissions
CREATE POLICY "Users can view their own permissions"
ON public.user_permissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_key TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions
    WHERE user_id = _user_id
      AND permission_key = _permission_key
      AND granted = true
  )
$$;

-- Function to get all permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE (
  permission_key TEXT,
  granted BOOLEAN,
  granted_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    permission_key,
    granted,
    created_at as granted_at
  FROM public.user_permissions
  WHERE user_id = _user_id
    AND (auth.uid() = _user_id OR public.has_role(auth.uid(), 'admin'))
  ORDER BY permission_key;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();