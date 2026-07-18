// ACA Scorecard configuration. This is the only file you should need to touch
// to connect services. No secret keys ever go in this file or anywhere else
// in the app: the Kit form ID is public by design.
const CONFIG = {
  // Phase 4: the numeric form ID from your Kit form's embed code.
  // Leave empty and the email capture card stays hidden.
  KIT_FORM_ID: '',

  // Phase 5: where "Join the waitlist" points (Kit landing page).
  // Leave empty and the waitlist block stays hidden.
  WAITLIST_URL: '',

  // v1 ships with the paid gate OFF and disconnected. Turning this on does
  // nothing until a payment link is wired in; that is deliberate.
  PAYWALL_ENABLED: false,

  // Used in the share message. Update if the final URL differs.
  SHARE_URL: 'https://sheamcaleese.github.io/aca-scorecard/'
};
if (typeof module !== 'undefined') module.exports = CONFIG;
