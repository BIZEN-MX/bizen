-- Función para incrementar XP de usuario en live quiz
-- Llama a esta función desde el cliente con: supabase.rpc('increment_user_xp', { user_xp: 100 })

CREATE OR REPLACE FUNCTION increment_user_xp(user_xp INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET xp = COALESCE(xp, 0) + user_xp
  WHERE user_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION increment_user_xp(INTEGER) TO authenticated;
