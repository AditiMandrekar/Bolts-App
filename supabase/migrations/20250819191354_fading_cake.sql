/*
  # Create Colony Manager Profiles Table

  1. New Tables
    - `colony_manager_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `personal_name` (text)
      - `contact_number` (text)
      - `email` (text)
      - `colony_name` (text)
      - `colony_address` (text)
      - `ward_number` (text)
      - `zone_number` (text)
      - `president_name` (text)
      - `president_contact` (text)
      - `president_email` (text)
      - `secretary_name` (text)
      - `secretary_contact` (text)
      - `secretary_email` (text)
      - `number_of_buildings` (integer, default 0)
      - `occupied_residential_units` (integer, default 0)
      - `unoccupied_residential_units` (integer, default 0)
      - `offices` (integer, default 0)
      - `shops` (integer, default 0)
      - `eateries` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `colony_manager_profiles` table
    - Add policies for managers to manage their own profiles
    - Add policies for authorities to read all manager profiles
    - Add policies for collectors to read manager profiles
*/

-- Create colony_manager_profiles table
CREATE TABLE IF NOT EXISTS colony_manager_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_name text DEFAULT '',
  contact_number text DEFAULT '',
  email text DEFAULT '',
  colony_name text DEFAULT '',
  colony_address text DEFAULT '',
  ward_number text DEFAULT '',
  zone_number text DEFAULT '',
  president_name text DEFAULT '',
  president_contact text DEFAULT '',
  president_email text DEFAULT '',
  secretary_name text DEFAULT '',
  secretary_contact text DEFAULT '',
  secretary_email text DEFAULT '',
  number_of_buildings integer DEFAULT 0,
  occupied_residential_units integer DEFAULT 0,
  unoccupied_residential_units integer DEFAULT 0,
  offices integer DEFAULT 0,
  shops integer DEFAULT 0,
  eateries integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE colony_manager_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Managers can read own profile"
  ON colony_manager_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authorities can read all manager profiles"
  ON colony_manager_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

CREATE POLICY "Collectors can read manager profiles"
  ON colony_manager_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'garbage_collector'
    )
  );

CREATE POLICY "Managers can insert own profile"
  ON colony_manager_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can update own profile"
  ON colony_manager_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_colony_manager_profiles_updated_at
  BEFORE UPDATE ON colony_manager_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_colony_manager_profiles_user_id ON colony_manager_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_colony_manager_profiles_colony_name ON colony_manager_profiles(colony_name);