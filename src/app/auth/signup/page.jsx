import { Suspense } from "react";
import SignUpPage from "./SignUpClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpPage />
    </Suspense>
  );
}
