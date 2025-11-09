/**
 * Parse Supabase auth errors from URL hash parameters
 * Format: #error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
 */
export interface AuthError {
  error: string;
  error_code?: string;
  error_description?: string;
}

export function parseAuthErrorFromUrl(): AuthError | null {
  const hash = window.location.hash;

  if (!hash || !hash.includes('error=')) {
    return null;
  }

  // Remove the # and parse parameters
  const params = new URLSearchParams(hash.substring(1));

  const error = params.get('error');
  const errorCode = params.get('error_code');
  const errorDescription = params.get('error_description');

  if (!error) {
    return null;
  }

  return {
    error,
    error_code: errorCode || undefined,
    error_description: errorDescription || undefined,
  };
}

export function clearAuthErrorFromUrl() {
  // Clear the hash to remove error parameters
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

export function getAuthErrorMessage(authError: AuthError): string {
  // Map error codes to user-friendly messages
  if (authError.error_code === 'otp_expired') {
    return 'Your email link has expired. Please request a new one.';
  }

  if (authError.error_code === 'email_not_confirmed') {
    return 'Please check your email and click the confirmation link.';
  }

  if (authError.error === 'access_denied') {
    return 'Access denied. Please try signing in again.';
  }

  // Fallback to the error description if available
  if (authError.error_description) {
    return decodeURIComponent(authError.error_description.replace(/\+/g, ' '));
  }

  return 'Authentication error. Please try again.';
}
