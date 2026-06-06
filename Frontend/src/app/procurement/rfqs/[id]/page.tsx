import { RFQDetailView } from "@/components/views/detail-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RFQDetailView id={id} prefix="procurement" />;
}
