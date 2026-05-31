import { QueryClientWrapper } from "@/components/QueryClientWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientWrapper>
      {children}
    </QueryClientWrapper>
  );
}
