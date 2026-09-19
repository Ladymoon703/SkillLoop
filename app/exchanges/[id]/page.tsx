import ExchangeView from "@/components/ExchangeView";
import { exchange } from "@/lib/data";

export default async function ExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <ExchangeView exchange={exchange} />;
}
