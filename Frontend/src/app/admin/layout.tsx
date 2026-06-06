import { RoleShell } from "@/components/layout/role-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RoleShell role="admin">{children}</RoleShell>
    </ToastProvider>
  );
}
