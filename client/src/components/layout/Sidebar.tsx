
import {
  LayoutDashboard,
  Package,
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="bg-[#2b1d63] px-5 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-60 lg:shrink-0 lg:flex-col">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-300 text-2xl">
          🐱
        </div>

        <div>
          <h1 className="text-lg font-bold leading-tight">
            Meowcart
          </h1>
          <p className="text-sm text-violet-200">
            Store Dashboard
          </p>
        </div>
      </div>

      <nav className="space-y-2">
        <a
          href="#dashboard"
          className="flex items-center gap-3 rounded-xl bg-violet-500/50 px-4 py-3 text-sm font-semibold"
        >
          <LayoutDashboard size={19} />
          Dashboard
        </a>

        <a
          href="#products"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-violet-200 transition hover:bg-white/10"
        >
          <Package size={19} />
          Products Overview
        </a>
      </nav>

      <div className="mt-auto hidden border-t border-white/10 pt-5 text-xs text-violet-300 lg:block">
        Shopify Store Snapshot
      </div>
    </aside>
  );
}
