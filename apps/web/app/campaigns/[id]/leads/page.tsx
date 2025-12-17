export default function CampaignLeadsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Campaign Leads {params.id}</h1>
      <p>Add and deduplicate leads for this campaign.</p>
    </div>
  );
}
