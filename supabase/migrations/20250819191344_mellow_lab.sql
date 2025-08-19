/*
  # Create Garbage Collector Profiles Table

  1. New Tables
    - `garbage_collector_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `personal_name` (text)
      - `employee_id` (text, unique)
      - `contact_number` (text)
      - `years_of_experience` (integer, default 0)
      - `complete_address` (text)
      - `assigned_areas` (text array)
      - `shift_timing` (text)
      - `vehicle_number` (text)
      - `supervisor_name` (text)
      - `working_status` (text, enum: Active, On Leave, Retired)
      - `daily_task_counter` (integer, default 0)
      - `profile_picture` (text, URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `garbage_collector_profiles` table
    - Add policies for collectors to manage their own profiles
    - Add policies for managers and authorities to read collector profiles
*/

-- Create garbage_collector_profiles table
CREATE TABLE IF NOT EXISTS garbage_collector_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_name text DEFAULT '',
  employee_id text UNIQUE,
  contact_number text DEFAULT '',
  years_of_experience integer DEFAULT 0,
  complete_address text DEFAULT '',
  assigned_areas text[] DEFAULT '{}',
  shift_timing text DEFAULT '',
  vehicle_number text DEFAULT '',
  supervisor_name text DEFAULT '',
  working_status text DEFAULT 'Active' CHECK (working_status IN ('Active', 'On Leave', 'Retired')),
  daily_task_counter integer DEFAULT 0,
  profile_picture text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE garbage_collector_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Collectors can read own profile"
  ON garbage_collector_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Managers and authorities can read collector profiles"
  ON garbage_collector_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() 
      AND role IN ('colony_manager', 'government_authority')
    )
  );

CREATE POLICY "Collectors can insert own profile"
  ON garbage_collector_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Collectors can update own profile"
  ON garbage_collector_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_garbage_collector_profiles_updated_at
  BEFORE UPDATE ON garbage_collector_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_garbage_collector_profiles_user_id ON garbage_collector_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_garbage_collector_profiles_employee_id ON garbage_collector_profiles(employee_id);