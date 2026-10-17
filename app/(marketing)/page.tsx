import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { WorkflowSection } from "@/components/landing/workflow-section";
import { FAQ } from "@/components/landing/faq";
import { CatalystCTA } from "@/components/landing/catalyst-cta";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <TrustBar />
      <FeaturesGrid />
      <WorkflowSection />
      <FAQ />
      <CatalystCTA />
    </div>
  );
}
