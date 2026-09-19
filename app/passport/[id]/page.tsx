import PassportView from "@/components/PassportView";
import { getUser } from "@/lib/data";

export default async function PassportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exists = getUser(id);
  return <PassportView userId={exists ? id : "alex"} />;
}
