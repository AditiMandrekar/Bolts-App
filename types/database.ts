export interface User {
  id: string;
  email: string;
  role: 'garbage_collector' | 'colony_manager' | 'government_authority';
  created_at: string;
}

export interface GarbageCollectorProfile {
  id: string;
  user_id: string;
  personal_name: string;
  employee_id: string;
  contact_number: string;
  years_of_experience: number;
  complete_address: string;
  assigned_areas: string[];
  shift_timing: string;
  vehicle_number: string;
  supervisor_name: string;
  working_status: 'Active' | 'On Leave' | 'Retired';
  daily_task_counter: number;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface ColonyManagerProfile {
  id: string;
  user_id: string;
  personal_name: string;
  contact_number: string;
  email: string;
  colony_name: string;
  colony_address: string;
  ward_number: string;
  zone_number: string;
  president_name: string;
  president_contact: string;
  president_email: string;
  secretary_name: string;
  secretary_contact: string;
  secretary_email: string;
  number_of_buildings: number;
  occupied_residential_units: number;
  unoccupied_residential_units: number;
  offices: number;
  shops: number;
  eateries: number;
  created_at: string;
  updated_at: string;
}

export interface GovernmentAuthorityProfile {
  id: string;
  user_id: string;
  personal_name: string;
  contact_number: string;
  email: string;
  department: string;
  position: string;
  jurisdiction: string;
  created_at: string;
  updated_at: string;
}

export interface WasteSubmission {
  id: string;
  collector_id: string;
  date_time: string;
  waste_type: string;
  weight: number;
  colony_name: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleTracking {
  id: string;
  vehicle_number: string;
  collector_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface ColonyArea {
  id: string;
  name: string;
  address: string;
  ward_number: string;
  zone_number: string;
  manager_id?: string;
  total_buildings: number;
  total_residents: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
}

// Database response types with joins
export interface WasteSubmissionWithCollector extends WasteSubmission {
  garbage_collector_profiles?: {
    personal_name: string;
    employee_id: string;
  };
}

export interface ColonyAreaWithManager extends ColonyArea {
  colony_manager_profiles?: {
    personal_name: string;
    contact_number: string;
  };
}