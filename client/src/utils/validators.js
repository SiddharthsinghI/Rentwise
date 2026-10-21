export const validateProductForm = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Product name is required';
  } else if (values.name.trim().length < 5) {
    errors.name = 'Product name must be at least 5 characters';
  }

  if (!values.category) {
    errors.category = 'Please select a category';
  }

  if (values.pricePerDay === undefined || values.pricePerDay === '' || Number(values.pricePerDay) <= 0) {
    errors.pricePerDay = 'Daily rental price must be greater than $0';
  }

  if (values.securityDeposit === undefined || values.securityDeposit === '' || Number(values.securityDeposit) < 0) {
    errors.securityDeposit = 'Security deposit must be 0 or more';
  }

  if (!values.description || !values.description.trim()) {
    errors.description = 'Description is required';
  } else if (values.description.trim().length < 20) {
    errors.description = 'Description should be at least 20 characters for renters';
  }

  if (!values.imageUrl || !values.imageUrl.trim()) {
    errors.imageUrl = 'At least one product image URL is required';
  } else if (!/^https?:\/\/.+/i.test(values.imageUrl.trim())) {
    errors.imageUrl = 'Please enter a valid HTTP/HTTPS image URL';
  }

  if (!values.location || !values.location.trim()) {
    errors.location = 'Rental equipment location (City, State) is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBookingDates = (startDate, endDate) => {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!startDate) {
    errors.startDate = 'Start date is required';
  } else {
    const start = new Date(startDate);
    if (start < today) {
      errors.startDate = 'Start date cannot be in the past';
    }
  }

  if (!endDate) {
    errors.endDate = 'End date is required';
  } else if (startDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      errors.endDate = 'End date must be on or after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (email, password) => {
  const errors = {};
  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  if (!formData.name || !formData.name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!formData.role) {
    errors.role = 'Please select whether you want to Rent or List gear';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
