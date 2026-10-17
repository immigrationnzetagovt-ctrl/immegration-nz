import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function DemoDisclaimerBanner() {
  return (
    <aside
      aria-label="Educational Demo Notice"
      className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-amber-900 text-xs sm:text-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong className="font-semibold uppercase tracking-wider text-amber-800">
              Demo — Not an official immigration document:
            </strong>{' '}
            This portal is an educational software demonstration. All sample passport numbers and records are fictional.
          </span>
        </div>
        <div className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
          Educational Simulation
        </div>
      </div>
    </aside>
  );
}
