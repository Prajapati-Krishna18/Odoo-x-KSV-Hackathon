import { redirect } from "next/navigation";

export default function Page({ params }: { params: { rfqId: string } }) {
  redirect(`/procurement/quotations/compare/${params.rfqId}`);
}
