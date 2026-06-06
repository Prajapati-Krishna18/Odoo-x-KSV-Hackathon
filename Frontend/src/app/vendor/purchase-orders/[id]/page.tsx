import { PODetailView } from "@/components/views/detail-pages";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PODetailView id={id} prefix="vendor" />;
}
