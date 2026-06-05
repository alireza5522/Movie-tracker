/*
  # Update watchlist table

  1. Changes
    - Add tmdb_id column for TMDB API integration
    - Add overview column for descriptions
    - Add status column for tracking watch status

  2. Notes
    - Working with existing table structure
    - Adding columns that don't exist yet
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watchlist' AND column_name = 'tmdb_id'
  ) THEN
    ALTER TABLE watchlist ADD COLUMN tmdb_id integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watchlist' AND column_name = 'overview'
  ) THEN
    ALTER TABLE watchlist ADD COLUMN overview text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'watchlist' AND column_name = 'status'
  ) THEN
    ALTER TABLE watchlist ADD COLUMN status text DEFAULT 'watching';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_watchlist_tmdb_id ON watchlist(tmdb_id);