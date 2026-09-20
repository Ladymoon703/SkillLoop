import ExchangeView from "@/components/ExchangeView";

export default async function ExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExchangeView exchangeId={id} />;
}
