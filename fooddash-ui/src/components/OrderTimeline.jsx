export default function OrderTimeline({ events }) {
  if (!events?.length) return null;
  return (
    <div className="mt-4 border-t pt-4">
      <h3
        className="font-bold text-sm text-gray-500 uppercase tracking-wide mb-
3"
      >
        Status History
      </h3>
      <div className="space-y-2">
        {events.map((ev) => (
          <div key={ev.id} className="flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 flex shrink-0" />
            <span className="font-medium">{ev.status.replace("_", " ")}</span>
            <span className="text-gray-400 text-xs ml-auto">
              {new Date(ev.created_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
// Add <OrderTimeline events={order.events} /> inside OrderPage
