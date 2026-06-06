import { RoleShell } from "@/components/layout/role-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RoleShell role="manager">{children}</RoleShell>
    </ToastProvider>
  );
}
