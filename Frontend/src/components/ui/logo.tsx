import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizes = {
  xs: 80,
  sm: 120,
  md: 180,
  lg: 260,
  xl: 340,
};

export function Logo({ className, href, size = "md" }: LogoProps) {
  const w = sizes[size];
  const content = (
    <div className={cn("relative", className)} style={{ width: w, height: Math.round(w * 1024 / 1536) }}>
      <Image
        src="/Logo.png"
        alt="VendorBridge"
        fill
        className="object-contain"
        priority
      />
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
