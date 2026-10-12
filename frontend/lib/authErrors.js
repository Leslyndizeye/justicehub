/** Account screens display curated copy, never a provider's message or stack. */
export function authErrorMessage(error, action = 'login') {
  switch (error?.code) {
    case 'auth/invalid-email':
    case 'auth/missing-email':
      return 'Enter a valid email address.';
    case 'auth/email-already-in-use':
      return 'An account already uses this email. Please sign in or reset your password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return action === 'forgot' ? 'Check your email address and try requesting a reset link again.' : 'The email or password is incorrect. Please try again.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Choose a stronger password with at least 8 characters, uppercase and lowercase letters, a number, and a symbol.';
    case 'auth/missing-password':
      return 'Enter your password.';
    case 'auth/network-request-failed':
    case 'unavailable':
      return 'We could not connect. Check your internet connection and try again.';
    case 'auth/too-many-requests':
    case 'resource-exhausted':
      return 'Too many attempts. Please wait a few minutes before trying again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in window. Allow pop-ups for this site and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again when you are ready.';
    case 'auth/account-exists-with-different-credential':
      return 'Use the sign-in method you originally chose for this email.';
    case 'auth/unauthorized-domain':
    case 'auth/operation-not-allowed':
    case 'auth/configuration-not-found':
      return 'This sign-in option is temporarily unavailable. Try your email and password, or contact support.';
    case 'auth/expired-action-code':
    case 'auth/invalid-action-code':
      return 'This reset link has expired or is invalid. Please request a new one.';
    case 'auth/user-disabled':
      return 'Unable to sign in to this account. Please contact support.';
    default:
      return {
        signup: 'We could not finish creating your account. Try signing in, or try again later.',
        forgot: 'We could not send the reset link. Please try again later.',
        confirmReset: 'We could not update your password. Please try again or request a new reset link.',
        resetLink: 'We could not check the reset link. Please try again or request a new one.',
        google: 'We could not complete sign-in. Please try again or sign in with your email and password.',
      }[action] || 'We could not sign you in. Please try again later.';
  }
}
