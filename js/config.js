// ACA Scorecard configuration. This is the only file you should need to touch
// to connect services. No secret keys ever go in this file or anywhere else
// in the app: the Kit form ID is public by design.
const CONFIG = {
  // The numeric form ID from your Kit form (see KIT_SETUP.md, step 2).
  // Leave empty and the email capture card stays hidden.
  KIT_FORM_ID: '',

  // Your Kit v3 PUBLIC API key (see KIT_SETUP.md, step 3). This key is
  // designed to be visible in client-side code. Never put the API secret
  // here or anywhere in this project.
  KIT_API_KEY: '',

  // Where "Join the waitlist" points (Kit landing page, KIT_SETUP.md step 5).
  // Leave empty and the waitlist block stays hidden.
  WAITLIST_URL: '',

  // v1 ships with the paid gate OFF and disconnected. Both values below must
  // be set for the gate to appear, and PAYMENT_LINK stays empty in v1;
  // that is deliberate. See README.md before touching these.
  PAYWALL_ENABLED: false,
  PAYMENT_LINK: '',

  // Used in the share message. Update if the final URL differs.
  SHARE_URL: 'https://sheamcaleese.github.io/aca-scorecard/'
};
if (typeof module !== 'undefined') module.exports = CONFIG;
