/*
  # Insert Sample Data

  1. Sample Data
    - Sample colony areas for testing
    - Sample waste type categories
    - Initial notification templates

  2. Purpose
    - Provides realistic test data for development
    - Ensures proper functionality testing
    - Demonstrates app capabilities with real-world scenarios
*/

-- Insert sample colony areas
INSERT INTO colony_areas (name, address, ward_number, zone_number, total_buildings, total_residents) VALUES
  ('Green Valley Colony', 'Sector 12, New Delhi', '12', 'North Zone', 15, 450),
  ('Sunrise Apartments', 'Phase 2, Gurgaon', '8', 'South Zone', 8, 320),
  ('Palm Grove Society', 'Sector 45, Noida', '45', 'East Zone', 12, 380),
  ('Rose Garden Complex', 'Block C, Faridabad', '23', 'West Zone', 20, 600),
  ('Metro Heights', 'Sector 18, Gurgaon', '18', 'Central Zone', 25, 750)
ON CONFLICT (name) DO NOTHING;