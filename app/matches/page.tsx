import { Suspense } from "react";
import MatchesContent from "./MatchesContent";

export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center text-[#64748b]">Loading matches...</div>}>
      <MatchesContent />
    </Suspense>
  );
}
