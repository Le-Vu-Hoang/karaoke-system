import Header from "@/presentation/shared_ui/header";
import Hero from "@/presentation/features/home/components/hero";
import CategoryChips from "@/presentation/features/home/components/category-chips";
import WhyChooseUs from "@/presentation/features/home/components/why-choose-us";
import SpecialOffers from "@/presentation/features/home/components/special-offers";
import QuickBook from "@/presentation/features/home/components/quick-book";
import PartnerBanner from "@/presentation/features/home/components/partner-banner";
import Footer from "@/presentation/shared_ui/footer";
import FeaturedServices from "@/presentation/features/home/components/featured-service";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-1 flex flex-col">
        {/* Banner Hero & Search Form */}
        <Hero />

        {/* Category horizontal filters */}
        <CategoryChips />

        {/* Grid listing of Lounge rooms */}
        <FeaturedServices />

        {/* Benefits details list */}
        <WhyChooseUs />

        {/* Promos member offers */}
        <SpecialOffers />

        {/* Instant booking trigger */}
        <QuickBook />

        {/* Merchant venue partners list */}
        <PartnerBanner />
      </main>

      {/* Brand Footer links */}
      <Footer />
    </div>
  );
}
