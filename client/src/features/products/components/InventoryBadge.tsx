
interface InventoryBadgeProps {
  quantity: number | null;
  tracksInventory: boolean;
}

export function InventoryBadge({
  quantity,
  tracksInventory,
}: InventoryBadgeProps) {
  if (!tracksInventory) {
    return (
      <span
        title="Inventory tracking is disabled"
        className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
      >
        Not tracked
      </span>
    );
  }

  if (quantity === null) {
    return (
      <span className="text-sm text-slate-400">
        Unknown
      </span>
    );
  }

  const color =
    quantity === 0
      ? "bg-rose-100 text-rose-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span
      className={`inline-flex min-w-12 justify-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {quantity}
    </span>
  );
}
