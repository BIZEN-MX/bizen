-- Step 1: Add bizcoins column to Profiles if it doesn't already exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bizcoins') THEN
    ALTER TABLE public.profiles ADD COLUMN bizcoins INTEGER DEFAULT 0;
  END IF;
END $$;

-- Step 2: Create the user_inventory table
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  price_paid INTEGER NOT NULL DEFAULT 0
);

-- Step 3: Add an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON public.user_inventory(user_id);

-- Step 4: Add a unique constraint to prevent duplicate purchases of the same item
-- Note: Re-run this if you want to enforce one purchase per user per product.
ALTER TABLE public.user_inventory DROP CONSTRAINT IF EXISTS user_inventory_unique_purchase;
ALTER TABLE public.user_inventory ADD CONSTRAINT user_inventory_unique_purchase UNIQUE (user_id, product_id);

-- Step 5: (OPTIONAL) Enable RLS for user_inventory if you use Supabase client directly
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own inventory
DROP POLICY IF EXISTS "Users can see their own inventory" ON public.user_inventory;
CREATE POLICY "Users can see their own inventory" 
ON public.user_inventory FOR SELECT 
TO authenticated 
USING (auth.uid()::text = user_id);

-- Policy to allow system to manage inventory
DROP POLICY IF EXISTS "Public profiles can see everyone's inventory for metadata" ON public.user_inventory;
CREATE POLICY "Public profiles can see everyone's inventory for metadata"
ON public.user_inventory FOR SELECT
TO authenticated
USING (TRUE);
