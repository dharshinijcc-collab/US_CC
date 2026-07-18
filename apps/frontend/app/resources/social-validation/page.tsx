// ============================================================
// SOCIAL VALIDATION ENGINE — TEMPORARILY DISABLED
// Uncomment below to re-enable the Social Validation Engine page
// ============================================================

// import SocialValidationPage from "@/components/pages/social-validation/SocialValidationPage";
// export default function Page() {
//   return <SocialValidationPage />;
// }

import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/resources');
}
