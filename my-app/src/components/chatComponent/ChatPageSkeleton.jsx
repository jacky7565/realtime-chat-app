export const ChatPageSkeleton=()=> {
  return (
    <div className="h-screen flex bg-slate-100 animate-pulse">

      {/* Sidebar Skeleton */}
      <aside className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-400 border-2 border-white"></div>
              </div>

              {/* Text */}
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area Skeleton */}
      <main className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="p-4 bg-white border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4">
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-1/4 bg-gray-300 rounded-lg ml-auto"></div>
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="h-10 bg-gray-200 rounded-full"></div>
        </div>

      </main>
    </div>
  );
}
