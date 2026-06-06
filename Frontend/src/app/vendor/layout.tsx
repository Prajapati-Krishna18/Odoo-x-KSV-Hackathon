import { RoleShell } from "@/components/layout/role-shell";
import { ToastProvider } from "@/components/ui/toast";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <RoleShell role="vendor">{children}</RoleShell>
    </ToastProvider>
  );
}
