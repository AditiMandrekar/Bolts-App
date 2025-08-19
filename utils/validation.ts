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

export const validateNumeric = (value: string, fieldName: string): string | null => {
  if (!value) return `${fieldName} is required`;
  if (isNaN(Number(value))) return `${fieldName} must be a valid number`;
  if (Number(value) <= 0) return `${fieldName} must be greater than 0`;
  return null;
};

export const validatePhoneNumber = (phone: string): string | null => {
  if (!phone) return 'Phone number is required';
  if (!/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) return 'Please enter a valid phone number';
  return null;
};

export const validateEmployeeId = (employeeId: string): string | null => {
  if (!employeeId) return 'Employee ID is required';
  if (employeeId.length < 3) return 'Employee ID must be at least 3 characters';
  return null;
};

// Waste form specific validations
export const validateWasteForm = (formData: {
  wasteType: string;
  weight: string;
  colonyName: string;
}) => {
  const errors: Record<string, string> = {};

  const wasteTypeError = validateRequired(formData.wasteType, 'Waste type');
  if (wasteTypeError) errors.wasteType = wasteTypeError;

  const weightError = validateNumeric(formData.weight, 'Weight');
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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};