export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0 animate-pulse">
      <div className="h-56 bg-peach-100/50" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-peach-100/50 rounded-full w-3/4" />
        <div className="h-3 bg-peach-100/50 rounded-full w-full" />
        <div className="h-3 bg-peach-100/50 rounded-full w-1/2" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-5 bg-peach-100/50 rounded-full w-20" />
          <div className="h-3 bg-peach-100/50 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 animate-pulse">
      <div className="w-20 h-20 bg-peach-100/50 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-peach-100/50 rounded-full w-3/4" />
        <div className="h-3 bg-peach-100/50 rounded-full w-1/2" />
        <div className="h-4 bg-peach-100/50 rounded-full w-20" />
      </div>
    </div>
  )
}
