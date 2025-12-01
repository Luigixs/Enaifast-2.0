-- Criar função para buscar email por telefone
CREATE OR REPLACE FUNCTION public.get_email_by_phone(phone_number text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_user_id uuid;
  found_email text;
BEGIN
  -- Buscar user_id pelo telefone ou whatsapp
  SELECT user_id INTO found_user_id
  FROM public.profiles
  WHERE phone = phone_number OR whatsapp = phone_number
  LIMIT 1;
  
  IF found_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Buscar email do usuário
  SELECT email INTO found_email
  FROM auth.users
  WHERE id = found_user_id;
  
  RETURN found_email;
END;
$$;