// Validate Indian contact number (starts with 6-9, total 10 digits)
export const isValidPhone = (phone) => {
    const phoneRegex = /^[5-9]\d{9}$/;
    return phoneRegex.test(phone);
};

// Validate Indian pincode (6 digits)
export const isValidPincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

// Validate email address
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

//Validate name
export const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s.'-]{1,50}$/;
    return nameRegex.test(name);
};

//Validate age (1-120)
export const isValidAge = (age) => {
    const ageRegex = /^(?:[1-9]|[1-9][0-9]|1[01][0-9]|120)$/;
    return ageRegex.test(String(age));
};

// Validate designation
export const isValidDesignation = (designation) => {
    const designationRegex = /^[A-Za-z][A-Za-z.\s]{0,49}$/;
    return designationRegex.test(designation);
};

// Validate address
export const isValidAddress = (address) => {
    const addressRegex = /^[A-Za-z0-9][A-Za-z0-9\s.,\-/#()]{1,98}$/;
    return addressRegex.test(address);
};

//Validate 4 digit otp
export const isValidOtp = (otp) => {
    const otpRegex = /^[0-9]{4}$/;
    return otpRegex.test(otp);
};
