import { Suspense } from "react";
import MatchesContent from "./MatchesContent";

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center text-[#5a5a5c]">Loading matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
