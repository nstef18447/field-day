interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  pending: "admin-status-pending",
  paid: "admin-status-paid",
  fulfilled: "admin-status-fulfilled",
  cancelled: "admin-status-cancelled",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`admin-status-badge ${statusColors[status] || ""}`}>
      {status}
    </span>
  );
}
