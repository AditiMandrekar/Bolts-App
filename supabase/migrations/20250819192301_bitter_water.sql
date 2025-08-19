/*
  # Insert Sample Data

  1. Sample Data
    - Sample colony areas for testing
    - Sample collection routes
    - Initial notification templates

  2. Purpose
    - Provides realistic test data for development
    - Ensures proper functionality testing
    - Demonstrates app capabilities with real-world scenarios
*/

-- Insert sample colony areas
INSERT INTO colony_areas (name, address, ward_number, zone_number, total_buildings, total_residents, total_units, latitude, longitude) VALUES
  ('Green Valley Colony', 'Sector 12, New Delhi, 110001', '12', 'North Zone', 15, 450, 180, 28.6139, 77.2090),
  ('Sunrise Apartments', 'Phase 2, Gurgaon, Haryana 122002', '8', 'South Zone', 8, 320, 128, 28.4595, 77.0266),
  ('Palm Grove Society', 'Sector 45, Noida, UP 201303', '45', 'East Zone', 12, 380, 152, 28.5355, 77.3910),
  ('Rose Garden Complex', 'Block C, Faridabad, Haryana 121001', '23', 'West Zone', 20, 600, 240, 28.4089, 77.3178),
  ('Metro Heights', 'Sector 18, Gurgaon, Haryana 122015', '18', 'Central Zone', 25, 750, 300, 28.4921, 77.0869),
  ('Lotus Enclave', 'Sector 62, Noida, UP 201309', '62', 'East Zone', 18, 540, 216, 28.6271, 77.3747),
  ('Golden Towers', 'Dwarka Sector 7, New Delhi 110075', '7', 'West Zone', 22, 660, 264, 28.5921, 77.0460),
  ('Silver Springs', 'Vasant Kunj, New Delhi 110070', '15', 'South Zone', 16, 480, 192, 28.5244, 77.1597)
ON CONFLICT (name) DO NOTHING;

-- Insert sample collection routes
INSERT INTO collection_routes (name, colonies, start_time, end_time, days_of_week) VALUES
  ('North Zone Route A', ARRAY['Green Valley Colony', 'Golden Towers'], '06:00:00', '14:00:00', ARRAY['Monday', 'Wednesday', 'Friday']),
  ('South Zone Route B', ARRAY['Sunrise Apartments', 'Silver Springs'], '06:00:00', '14:00:00', ARRAY['Tuesday', 'Thursday', 'Saturday']),
  ('East Zone Route C', ARRAY['Palm Grove Society', 'Lotus Enclave'], '14:00:00', '22:00:00', ARRAY['Monday', 'Wednesday', 'Friday']),
  ('Central Route D', ARRAY['Metro Heights', 'Rose Garden Complex'], '14:00:00', '22:00:00', ARRAY['Tuesday', 'Thursday', 'Saturday'])
ON CONFLICT DO NOTHING;