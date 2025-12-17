export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {['Sent Today', 'Queued', 'Replies', 'Bounces'].map((label) => (
          <div key={label} className="bg-white shadow rounded p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
        ))}
      </div>
    </div>
  );
}
