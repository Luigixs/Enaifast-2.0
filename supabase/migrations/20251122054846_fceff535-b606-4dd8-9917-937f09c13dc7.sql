-- Add thumbnail columns to modules table
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS thumbnail_mobile_url text;

-- Add thumbnail columns to submodules table
ALTER TABLE submodules 
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS thumbnail_mobile_url text;