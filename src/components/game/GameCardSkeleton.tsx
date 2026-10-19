export default function GameCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[1.25rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="aspect-square w-full bg-slate-200" />
      <div className="flex flex-col gap-3 p-3 sm:p-4">
        <div className="h-4 w-3/4 rounded-md bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-lg bg-slate-200" />
          <div className="h-5 w-12 rounded-lg bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
