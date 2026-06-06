import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { getMessage } from "@/lib/data";
import { formatRelative } from "@/lib/utils";

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = getMessage(id);
  if (!message) notFound();

  return (
    <div>
      <PageHeader
        title={message.subject}
        description={message.vendorName}
        breadcrumbs={[
          { label: "Messages", href: "/messages" },
          { label: message.subject },
        ]}
        actions={
          <>
            <Button variant="secondary" href={`/vendors/${message.vendorId}`}>
              View vendor
            </Button>
            <Button href="/purchase-orders/new">Create PO</Button>
          </>
        }
      />

      <Card>
        <CardBody className="space-y-6">
          {message.thread.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl p-4 ${
                msg.sender === "You"
                  ? "ml-8 bg-indigo-50 border border-indigo-100"
                  : "mr-8 bg-slate-50 border border-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-900">{msg.sender}</p>
                <p className="text-xs text-slate-400">{formatRelative(msg.sentAt)}</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{msg.body}</p>
            </div>
          ))}

          <form className="border-t border-slate-100 pt-6" action={`/messages/${id}`}>
            <textarea
              rows={3}
              placeholder="Type your reply..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="mt-3 flex gap-2">
              <Button type="submit">Send reply</Button>
              <Button variant="secondary" href="/rfqs/new">Create RFQ</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <p className="mt-4 text-sm text-slate-500">
        Related:{" "}
        <Link href={`/vendors/${message.vendorId}`} className="text-indigo-600 hover:underline">
          {message.vendorName}
        </Link>
        {" · "}
        <Link href="/purchase-orders" className="text-indigo-600 hover:underline">
          Purchase orders
        </Link>
      </p>
    </div>
  );
}
