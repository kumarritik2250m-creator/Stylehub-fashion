# StyleHub / XPORD final integrated build

Base: original XPORD/StyleHub Firebase project. Customer pages are included as responsive desktop/mobile files and routed through compact wrapper pages. Existing Firebase config, Firestore rules, store/admin engine, policies and business details from the original project are preserved.

Important: Razorpay client key is retained from the original project. For production payment security, server-side order creation/signature verification must use the Razorpay secret on the deployment backend; never expose the secret in frontend files.
