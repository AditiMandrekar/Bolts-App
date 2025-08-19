/*
  # Create Waste Categories Table

  1. New Tables
    - `waste_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `category_type` (text, enum: recyclable, biodegradable, hazardous, other)
      - `color_code` (text, hex color for UI)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `waste_categories` table
    - Add policies for all authenticated users to read categories
    - Add policies for authorities to manage categories

  3. Sample Data
    - Insert all waste types specified in requirements
*/

-- Create waste_categories table
CREATE TABLE IF NOT EXISTS waste_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  category_type text DEFAULT 'other' CHECK (category_type IN ('recyclable', 'biodegradable', 'hazardous', 'other')),
  color_code text DEFAULT '#6B7280',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waste_categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All authenticated users can read waste categories"
  ON waste_categories
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Authorities can manage waste categories"
  ON waste_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_waste_categories_updated_at
  BEFORE UPDATE ON waste_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert waste categories
INSERT INTO waste_categories (name, description, category_type, color_code) VALUES
  ('Paper', 'Newspapers, magazines, office paper', 'recyclable', '#3B82F6'),
  ('Cardboard', 'Cardboard boxes and packaging', 'recyclable', '#3B82F6'),
  ('PET Bottles', 'Plastic bottles with PET marking', 'recyclable', '#10B981'),
  ('Other Plastics', 'Non-PET plastic items', 'recyclable', '#10B981'),
  ('Glass', 'Glass bottles and containers', 'recyclable', '#8B5CF6'),
  ('Metals', 'Aluminum cans, metal containers', 'recyclable', '#6B7280'),
  ('Textiles', 'Clothing, fabric materials', 'other', '#F59E0B'),
  ('Footwear', 'Shoes, sandals, boots', 'other', '#F59E0B'),
  ('E-waste', 'Electronic devices and components', 'hazardous', '#EF4444'),
  ('Hazardous Waste', 'Batteries, chemicals, medical waste', 'hazardous', '#EF4444'),
  ('Sanitary Waste', 'Diapers, sanitary products', 'other', '#EC4899'),
  ('Coconut Shells', 'Hard coconut shells', 'biodegradable', '#22C55E'),
  ('Tender Coconut Shells', 'Soft coconut shells', 'biodegradable', '#22C55E'),
  ('Garden Waste', 'Leaves, branches, grass', 'biodegradable', '#22C55E'),
  ('Other Biodegradable Waste', 'Food scraps, organic matter', 'biodegradable', '#22C55E'),
  ('Other Non-recyclables', 'Mixed waste, non-categorized items', 'other', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_waste_categories_name ON waste_categories(name);
CREATE INDEX IF NOT EXISTS idx_waste_categories_category_type ON waste_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_waste_categories_active ON waste_categories(active);