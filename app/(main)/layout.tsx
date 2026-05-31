import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { QueryClientWrapper } from "@/components/QueryClientWrapper";
import { GlobalStateProvider } from "@/context/GlobalStateContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientWrapper>
      <GlobalStateProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
            {children}
          </main>
          <Footer />
        </div>
        <BottomNav />
      </GlobalStateProvider>
    </QueryClientWrapper>
  );
}
