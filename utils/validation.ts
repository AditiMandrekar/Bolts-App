// Form validation utilities

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.trim() === '') return `${fieldName} is required`;
  return null;
};

export const validateNumeric = (value: string, fieldName: string, min?: number, max?: number): string | null => {
  if (!value) return `${fieldName} is required`;
  
  const numValue = Number(value);
  if (isNaN(numValue)) return `${fieldName} must be a valid number`;
  
  if (min !== undefined && numValue < min) return `${fieldName} must be at least ${min}`;
  if (max !== undefined && numValue > max) return `${fieldName} must be at most ${max}`;
  
  return null;
};

export const validateWeight = (weight: string): string | null => {
  return validateNumeric(weight, 'Weight', 0.1, 10000);
};

export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) return 'Please enter a valid phone number';
  return null;
};

export const validateEmployeeId = (employeeId: string): string | null => {
  if (!employeeId) return 'Employee ID is required';
  if (employeeId.length < 3) return 'Employee ID must be at least 3 characters';
  if (!/^[A-Z0-9\-]+$/i.test(employeeId)) return 'Employee ID can only contain letters, numbers, and hyphens';
  return null;
};

export const validateVehicleNumber = (vehicleNumber: string): string | null => {
  if (!vehicleNumber) return 'Vehicle number is required';
  if (vehicleNumber.length < 4) return 'Vehicle number must be at least 4 characters';
  return null;
};

// Waste form specific validations
export const validateWasteForm = (formData: {
  wasteType: string;
  weight: string;
  colonyName: string;
  buildingNumber?: string;
  houseNumber?: string;
}) => {
  const errors: Record<string, string> = {};

  const wasteTypeError = validateRequired(formData.wasteType, 'Waste type');
  if (wasteTypeError) errors.wasteType = wasteTypeError;

  const weightError = validateWeight(formData.weight);
  if (weightError) errors.weight = weightError;

  const colonyError = validateRequired(formData.colonyName, 'Colony name');
  if (colonyError) errors.colonyName = colonyError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Profile validation
export const validateCollectorProfile = (profile: any) => {
  const errors: Record<string, string> = {};

  const nameError = validateRequired(profile.personal_name, 'Personal name');
  if (nameError) errors.personal_name = nameError;

  const employeeIdError = validateEmployeeId(profile.employee_id);
  if (employeeIdError) errors.employee_id = employeeIdError;

  const phoneError = validatePhoneNumber(profile.contact_number);
  if (phoneError) errors.contact_number = phoneError;

  const vehicleError = validateVehicleNumber(profile.vehicle_number);
  if (vehicleError) errors.vehicle_number = vehicleError;

  const experienceError = validateNumeric(profile.years_of_experience, 'Years of experience', 0, 50);
  if (experienceError) errors.years_of_experience = experienceError;

  const taskCounterError = validateNumeric(profile.daily_task_counter, 'Daily task counter', 0, 1000);
  if (taskCounterError) errors.daily_task_counter = taskCounterError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateManagerProfile = (profile: any) => {
  const errors: Record<string, string> = {};

  const nameError = validateRequired(profile.personal_name, 'Personal name');
  if (nameError) errors.personal_name = nameError;

  const phoneError = validatePhoneNumber(profile.contact_number);
  if (phoneError) errors.contact_number = phoneError;

  const emailError = validateEmail(profile.email);
  if (emailError) errors.email = emailError;

  const colonyNameError = validateRequired(profile.colony_name, 'Colony name');
  if (colonyNameError) errors.colony_name = colonyNameError;

  const colonyAddressError = validateRequired(profile.colony_address, 'Colony address');
  if (colonyAddressError) errors.colony_address = colonyAddressError;

  // Validate numeric fields
  const buildingsError = validateNumeric(profile.number_of_buildings, 'Number of buildings', 1, 1000);
  if (buildingsError) errors.number_of_buildings = buildingsError;

  const occupiedUnitsError = validateNumeric(profile.occupied_residential_units, 'Occupied units', 0, 10000);
  if (occupiedUnitsError) errors.occupied_residential_units = occupiedUnitsError;

  const unoccupiedUnitsError = validateNumeric(profile.unoccupied_residential_units, 'Unoccupied units', 0, 10000);
  if (unoccupiedUnitsError) errors.unoccupied_residential_units = unoccupiedUnitsError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateAuthorityProfile = (profile: any) => {
  const errors: Record<string, string> = {};

  const nameError = validateRequired(profile.personal_name, 'Personal name');
  if (nameError) errors.personal_name = nameError;

  const phoneError = validatePhoneNumber(profile.contact_number);
  if (phoneError) errors.contact_number = phoneError;

  const emailError = validateEmail(profile.email);
  if (emailError) errors.email = emailError;

  const departmentError = validateRequired(profile.department, 'Department');
  if (departmentError) errors.department = departmentError;

  const positionError = validateRequired(profile.position, 'Position');
  if (positionError) errors.position = positionError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};