/*
  # Create Government Authority Profiles Table

  1. New Tables
    - `government_authority_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `personal_name` (text)
      - `contact_number` (text)
      - `email` (text)
      - `department` (text)
      - `position` (text)
      - `jurisdiction` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `government_authority_profiles` table
    - Add policies for authorities to manage their own profiles
    - Add policies for other authorities to read profiles
*/

-- Create government_authority_profiles table
CREATE TABLE IF NOT EXISTS government_authority_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_name text DEFAULT '',
  contact_number text DEFAULT '',
  email text DEFAULT '',
  department text DEFAULT '',
  position text DEFAULT '',
  jurisdiction text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE government_authority_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authorities can read own profile"
  ON government_authority_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authorities can read other authority profiles"
  ON government_authority_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

CREATE POLICY "Authorities can insert own profile"
  ON government_authority_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorities can update own profile"
  ON government_authority_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_government_authority_profiles_updated_at
  BEFORE UPDATE ON government_authority_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_government_authority_profiles_user_id ON government_authority_profiles(user_id);