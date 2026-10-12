// Authentication and optional profile storage are separate operations. A
// profile write failure must not be reported as a failed Google sign-in.
export async function completeGoogleSignIn(signIn, saveProfile, onProfileError) {
  const result = await signIn();
  try {
    await saveProfile(result.user);
  } catch (error) {
    onProfileError?.(error);
  }
  return result;
}

// Log only a bounded provider code, never SDK messages, credentials or users.
export function authDiagnostic(error, stage) {
  const code = typeof error?.code === 'string' && /^(?:auth\/)?[a-z-]{3,60}$/.test(error.code) ? error.code : 'unknown';
  console.warn('Account operation failed:', {stage, code});
}
