-- Fix search_path security warning by setting it on calculate_rank function
CREATE OR REPLACE FUNCTION public.calculate_rank(xp INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF xp >= 10000 THEN RETURN 'challenger';
  ELSIF xp >= 7500 THEN RETURN 'master';
  ELSIF xp >= 5000 THEN RETURN 'diamond';
  ELSIF xp >= 3000 THEN RETURN 'platinum';
  ELSIF xp >= 1500 THEN RETURN 'gold';
  ELSIF xp >= 500 THEN RETURN 'silver';
  ELSE RETURN 'bronze';
  END IF;
END;
$$;