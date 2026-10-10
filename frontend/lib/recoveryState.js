/** Keep provider messages, stack traces and setup instructions out of the UI. */
export function requestError(status, code = 'request_failed') {
  return Object.assign(new Error('The request could not be completed.'), { status, code });
}

export function recoveryState(error, { resource = 'page', online = true } = {}) {
  const status = Number(error?.status);
  const kind = status === 401 ? 'sign-in' : status === 403 ? 'forbidden'
    : status === 404 ? 'not-found' : !online ? 'offline'
    : resource === 'page' && !status && !(error instanceof TypeError) ? 'unexpected' : 'unavailable';
  const subject = resource === 'conversation' ? 'conversation' : resource === 'history' ? 'saved chats' : 'page';
  const copy = {
    'not-found': { code: '404', title: `We couldn’t find that ${subject}.`, description: resource === 'conversation'
      ? 'It may have been deleted, or the link may belong to another account. You can open a different chat or start a new one.'
      : 'The link may be outdated, or the address may have a typo. Let’s get you back to a familiar place.', retryable: false },
    'sign-in': { code: 'Sign in', title: 'Please sign in again.', description: 'Your session needs to be renewed before we can open your chats.', retryable: false },
    forbidden: { code: '403', title: 'This space isn’t available to your account.', description: 'Return to your workspace, or sign in with an account that has access.', retryable: false },
    offline: { code: 'Offline', title: 'You’re offline.', description: 'Reconnect to the internet, then try again. We’ll keep this page open for you.', retryable: true },
    unavailable: { code: 'Reconnect', title: resource === 'history' ? 'Your chats are temporarily unavailable.' : 'Let’s reconnect.', description: resource === 'history'
      ? 'We couldn’t reach your saved conversations. Try loading them again in a moment.'
      : 'We couldn’t open this conversation right now. Please try again in a moment.', retryable: true },
    unexpected: { code: '500', title: 'This page needs a fresh start.', description: 'An unexpected problem interrupted the page. Try again, or return home.', retryable: true },
  };
  return { kind, ...copy[kind] };
}
