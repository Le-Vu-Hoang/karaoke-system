import Header from "@/presentation/shared_ui/header";
import Footer from "@/presentation/shared_ui/footer";
import ServiceHero from "@/presentation/features/service/components/service-hero";
import ServiceGrid from "@/presentation/features/service/components/service-grid";
import PartyCombos from "@/presentation/features/service/components/party-combos";
import ServiceMobileNav from "@/presentation/features/service/components/service-mobile-nav";
import { serviceRepository } from "@/infrastructure/repositories/service.repository";
import { Service, ServiceCategory } from "@/infrastructure/dtos/service.dto";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function ServicesPage() {
  let initialCategories: ServiceCategory[] = [];
  let initialServices: Service[] = [];

  try {
    const categoriesResponse = await serviceRepository.getCategories();
    initialCategories = categoriesResponse.data || [];
  } catch (error) {
    console.error("Failed to fetch categories on server:", error);
  }

  try {
    const servicesResponse = await serviceRepository.getServices();
    initialServices = servicesResponse.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch services on server:", error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-16 md:pb-0">
      {/* Navigation Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <ServiceHero />

        {/* Categories, Filters, & Services Catalog Grid */}
        <div className="py-12 md:py-16">
          <ServiceGrid 
            initialCategories={initialCategories}
            initialServices={initialServices}
          />
        </div>

        {/* Combo Packages */}
        <PartyCombos />
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Component (Client Component) */}
      <ServiceMobileNav />
    </div>
  );
}
