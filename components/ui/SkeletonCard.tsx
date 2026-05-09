"use client";

export function SkeletonCard({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-[#dce6f0]/60 animate-fade-in"
            style={{
              width: `${70 + ((i * 13) % 30)}%`,
              animationDelay: `${i * 150}ms`,
            }}
        />
      ))}
    </div>
  );
}

export function SkeletonSection({ lines = 2 }: { title?: string; lines?: number }) {
  return (
    <section className="space-y-3">
      <div className="h-4 w-32 rounded bg-[#dce6f0]/60 animate-fade-in" />
      <SkeletonCard lines={lines} />
    </section>
  );
}
