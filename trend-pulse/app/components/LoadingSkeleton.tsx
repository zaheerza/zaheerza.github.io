export function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-[#222] bg-[#111] rounded-sm p-3 animate-pulse"
        >
          <div className="flex gap-2">
            <div className="w-5 h-3 bg-[#222] rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-[#222] rounded w-full" />
              <div className="h-3 bg-[#1a1a1a] rounded w-3/4" />
              <div className="flex gap-2 mt-2">
                <div className="h-4 w-16 bg-[#1a1a1a] rounded" />
                <div className="h-4 w-20 bg-[#1a1a1a] rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
