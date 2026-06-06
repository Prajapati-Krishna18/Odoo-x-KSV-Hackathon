import { RoleShell } from "@/components/layout/role-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function ProcurementLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RoleShell role="procurement">{children}</RoleShell>
    </ToastProvider>
  );
}
