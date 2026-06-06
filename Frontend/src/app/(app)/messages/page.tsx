import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { messages } from "@/lib/data";
import { formatRelative } from "@/lib/utils";

export default function MessagesPage() {
  return (
    <div>
      <PageHeader
        title="Messages"
        description="Communicate with your vendors"
        actions={<Button href="/vendors">New message</Button>}
      />

      <Card>
        <CardBody className="p-0 divide-y divide-slate-100">
          {messages.map((m) => (
            <Link
              key={m.id}
              href={`/messages/${m.id}`}
              className={`flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors ${
                m.unread ? "bg-indigo-50/30" : ""
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {m.vendorName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-900 truncate">{m.subject}</p>
                  <span className="text-xs text-slate-400 shrink-0">{formatRelative(m.updatedAt)}</span>
                </div>
                <p className="text-sm text-indigo-600">{m.vendorName}</p>
                <p className="mt-1 text-sm text-slate-500 truncate">{m.preview}</p>
              </div>
              {m.unread && (
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />
              )}
            </Link>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
