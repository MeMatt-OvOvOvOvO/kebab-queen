import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QueryClientWrapper } from "@/components/QueryClientWrapper";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientWrapper>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      <Footer />
    </QueryClientWrapper>
  );
}
