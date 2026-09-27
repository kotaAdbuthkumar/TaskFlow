import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
    </div>
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
    <div className="pt-2 flex justify-between items-center">
      <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-100 dark:border-slate-800/60">
    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div></td>
    <td className="p-4"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div></td>
    <td className="p-4"><div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div></td>
    <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
    <td className="p-4"><div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div></td>
    <td className="p-4 text-right"><div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded inline-block"></div></td>
  </tr>
);

export const DashboardStatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl animate-pulse space-y-3"
      >
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
      </div>
    ))}
  </div>
);
