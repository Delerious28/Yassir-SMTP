import Link from 'next/link';
export default function CampaignsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>
      <Link className="text-blue-600 underline" href="/campaigns/new">
        Create Campaign
      </Link>
    </div>
  );
}
