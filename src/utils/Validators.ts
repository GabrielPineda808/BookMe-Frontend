// Matches backend regex
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";

  if (password.length < 8 || password.length > 128)
    return "Password must be between 8 and 128 characters";

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!regex.test(password))
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email format";

  return null;
}

