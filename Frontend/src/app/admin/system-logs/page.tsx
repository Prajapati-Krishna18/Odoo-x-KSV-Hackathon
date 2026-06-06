import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";

const logs = [
  { id: 1, level: "INFO", message: "Odoo bi-directional sync completed", user: "System", time: "2026-06-06 09:14:02" },
  { id: 2, level: "INFO", message: "PO-2026-0142 approved by Jordan Kim", user: "Jordan Kim", time: "2026-06-06 08:30:15" },
  { id: 3, level: "WARN", message: "Nova Packaging compliance score below threshold", user: "System", time: "2026-06-05 16:00:00" },
  { id: 4, level: "INFO", message: "User Sam Patel created RFQ: Q3 Steel Sheet Procurement", user: "Sam Patel", time: "2026-06-05 14:22:11" },
  { id: 5, level: "ERROR", message: "Invoice INV-88205 marked overdue", user: "System", time: "2026-06-05 09:00:00" },
];

export default function Page() {
  return (
    <div>
      <PageHeader title="System Logs" description="Audit trail and platform events" />
      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <span className={`text-xs font-bold ${log.level === "ERROR" ? "text-red-600" : log.level === "WARN" ? "text-orange-600" : "text-emerald-600"}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-700">{log.message}</td>
                  <td className="px-6 py-3 text-slate-500">{log.user}</td>
                  <td className="px-6 py-3 text-slate-400">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
