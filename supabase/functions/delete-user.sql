
-- Function to delete a user by ID (should be run by someone with permissions)
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Delete the user from auth.users (will cascade to profiles table)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;
