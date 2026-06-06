import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SettingsSidebar } from "@/components/layout/app-shell";
import { teamMembers } from "@/lib/data";
import { formatRelative } from "@/lib/utils";

export default function TeamPage() {
  return (
    <div>
      <PageHeader
        title="Team"
        description={`${teamMembers.length} team members`}
        actions={<Button href="/settings/team">Invite member</Button>}
      />

      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1">
          <Card>
            <CardHeader title="Team members" />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Department</th>
                    <th className="px-6 py-3">Last active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <Link href="/settings/profile" className="font-medium text-indigo-600 hover:underline">
                          {member.name}
                        </Link>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{member.department}</td>
                      <td className="px-6 py-4 text-slate-500">{formatRelative(member.lastActive)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
