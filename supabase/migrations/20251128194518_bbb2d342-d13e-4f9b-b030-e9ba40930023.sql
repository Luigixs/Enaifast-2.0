-- Create user_stats table for gamification
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  total_coins INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_login_date DATE,
  rank TEXT NOT NULL DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create daily_logins table for streak tracking
CREATE TABLE IF NOT EXISTS public.daily_logins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, login_date)
);

-- Enable RLS
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
  ON public.user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for daily_logins
CREATE POLICY "Users can view their own logins"
  ON public.daily_logins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logins"
  ON public.daily_logins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at on user_stats
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate rank based on XP
CREATE OR REPLACE FUNCTION public.calculate_rank(xp INTEGER)
RETURNS TEXT
LANGUAGE plpgsql
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

-- Function to update user stats after lesson completion
CREATE OR REPLACE FUNCTION public.update_user_stats_on_lesson_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  xp_to_add INTEGER;
  coins_to_add INTEGER;
  new_total_xp INTEGER;
  new_rank TEXT;
BEGIN
  -- Only process if lesson is being marked as completed
  IF NEW.completed = TRUE AND (OLD.completed IS NULL OR OLD.completed = FALSE) THEN
    -- Get XP from lesson
    SELECT COALESCE(xp_reward, 50) INTO xp_to_add
    FROM lessons
    WHERE id = NEW.lesson_id;
    
    -- Calculate coins (10% of XP)
    coins_to_add := CEIL(xp_to_add * 0.1);
    
    -- Insert or update user_stats
    INSERT INTO user_stats (user_id, total_xp, total_coins)
    VALUES (NEW.user_id, xp_to_add, coins_to_add)
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_xp = user_stats.total_xp + xp_to_add,
      total_coins = user_stats.total_coins + coins_to_add,
      updated_at = now();
    
    -- Update rank based on new XP total
    SELECT total_xp INTO new_total_xp
    FROM user_stats
    WHERE user_id = NEW.user_id;
    
    new_rank := calculate_rank(new_total_xp);
    
    UPDATE user_stats
    SET rank = new_rank
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to update stats when lesson is completed
CREATE TRIGGER on_lesson_completed
  AFTER INSERT OR UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_on_lesson_complete();

-- Function to update streak on daily login
CREATE OR REPLACE FUNCTION public.update_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  last_date DATE;
  new_streak INTEGER;
BEGIN
  -- Get last login date
  SELECT last_login_date INTO last_date
  FROM user_stats
  WHERE user_id = NEW.user_id;
  
  -- Calculate new streak
  IF last_date IS NULL THEN
    new_streak := 1;
  ELSIF NEW.login_date = last_date THEN
    -- Same day, don't change streak
    RETURN NEW;
  ELSIF NEW.login_date = last_date + INTERVAL '1 day' THEN
    -- Consecutive day
    SELECT current_streak + 1 INTO new_streak
    FROM user_stats
    WHERE user_id = NEW.user_id;
  ELSE
    -- Streak broken
    new_streak := 1;
  END IF;
  
  -- Update user_stats
  INSERT INTO user_stats (user_id, current_streak, longest_streak, last_login_date)
  VALUES (NEW.user_id, new_streak, new_streak, NEW.login_date)
  ON CONFLICT (user_id)
  DO UPDATE SET
    current_streak = new_streak,
    longest_streak = GREATEST(user_stats.longest_streak, new_streak),
    last_login_date = NEW.login_date,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Trigger to update streak on login
CREATE TRIGGER on_daily_login
  AFTER INSERT ON public.daily_logins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_streak();