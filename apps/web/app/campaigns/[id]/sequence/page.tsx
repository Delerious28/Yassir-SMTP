export default function CampaignSequencePage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sequence for {params.id}</h1>
      <p>Create subject/body templates and waiting rules.</p>
    </div>
  );
}
