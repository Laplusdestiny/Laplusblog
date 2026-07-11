export default function PostLoading() {
  return (
    <>
      <style>{`
        @keyframes loading-bar {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(0.7);
          }
          100% {
            transform: scaleX(0.9);
          }
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .loading-progress-bar {
          transform-origin: left;
          animation: loading-bar 2.5s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
        }
        .shimmer-block {
          position: relative;
          overflow: hidden;
          background-color: hsl(var(--secondary));
        }
        .shimmer-block::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 30%,
            rgba(255, 255, 255, 0.6) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.6s infinite;
          content: '';
        }
        .dark .shimmer-block::after {
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 30%,
            rgba(255, 255, 255, 0.15) 60%,
            rgba(255, 255, 255, 0) 100%
          );
        }
      `}</style>

      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-secondary/30">
        <div className="h-full w-full bg-foreground loading-progress-bar" />
      </div>

      <div className="bg-background px-4 py-10 md:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-base leading-7 text-foreground">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-muted-foreground mb-4">
            <span className="opacity-80">ホーム</span>
            <span className="text-[9px] opacity-60">/</span>
            <div className="h-3 w-32 shimmer-block rounded" />
          </div>

          {/* Blog Title Skeleton */}
          <div className="h-10 sm:h-12 w-11/12 shimmer-block rounded-lg mb-6" />

          {/* Blog Date & Update Skeleton */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border/40 pb-6 mb-8">
            <div className="h-3.5 w-32 shimmer-block rounded" />
            <span className="hidden md:inline text-muted-foreground/30">•</span>
            <div className="h-3.5 w-40 shimmer-block rounded hidden md:block" />
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            <div className="h-6 w-16 shimmer-block rounded-full" />
            <div className="h-6 w-20 shimmer-block rounded-full" />
            <div className="h-6 w-14 shimmer-block rounded-full" />
          </div>

          {/* Table of Contents Skeleton */}
          <div className="p-6 border border-border/40 rounded-xl bg-secondary/30 mb-10">
            <div className="h-4 w-12 shimmer-block rounded mb-4" />
            <div className="space-y-3">
              <div className="h-3 w-8/12 shimmer-block rounded" />
              <div className="h-3 w-6/12 shimmer-block rounded" />
              <div className="h-3 w-9/12 shimmer-block rounded pl-4 border-l border-border/60 ml-2" />
              <div className="h-3 w-5/12 shimmer-block rounded" />
            </div>
          </div>

          {/* Blog Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-full shimmer-block rounded" />
              <div className="h-4 w-full shimmer-block rounded" />
              <div className="h-4 w-11/12 shimmer-block rounded" />
              <div className="h-4 w-9/12 shimmer-block rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full shimmer-block rounded" />
              <div className="h-4 w-10/12 shimmer-block rounded" />
              <div className="h-4 w-8/12 shimmer-block rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full shimmer-block rounded" />
              <div className="h-4 w-full shimmer-block rounded" />
              <div className="h-4 w-1/2 shimmer-block rounded" />
            </div>
          </div>

          {/* Share Buttons Skeleton */}
          <div className="mx-auto mt-16 max-w-3xl border-t border-b border-border/40 py-8 flex flex-col items-center gap-4">
            <div className="h-3 w-32 shimmer-block rounded" />
            <div className="flex flex-wrap justify-center gap-4">
              <div className="h-10 w-10 rounded-full shimmer-block" />
              <div className="h-10 w-10 rounded-full shimmer-block" />
              <div className="h-10 w-10 rounded-full shimmer-block" />
              <div className="h-10 w-10 rounded-full shimmer-block" />
              <div className="h-10 w-10 rounded-full shimmer-block" />
            </div>
          </div>

          {/* Commit History Skeleton */}
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="border border-border/40 rounded-xl p-4 bg-secondary/10 flex justify-between items-center h-14 shimmer-block">
              <div className="h-4 w-28 bg-secondary/40 rounded" />
              <div className="h-3 w-4 bg-secondary/40 rounded" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
