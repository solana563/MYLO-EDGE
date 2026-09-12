import { Hero } from "../components/marketing/Hero";
import {
  HowItWorks,
  LensFlow,
  MarketIntelligence,
  ProblemSection,
} from "../components/marketing/Narrative";
import {
  BullBearPanel,
  EdgeScoreSection,
  ResearchConsensus,
  RiskSection,
} from "../components/marketing/Evidence";
import {
  BacktestingSection,
  EventRadar,
  ModulesSection,
  OpportunityMap,
  PaperTradingSection,
  SignalForensics,
} from "../components/marketing/Products";
import {
  Audiences,
  CTA,
  FAQSection,
  Philosophy,
  Pricing,
  RiskDisclosureSection,
  Security,
} from "../components/marketing/Company";
import { InteractiveDemo } from "../components/product-demos/InteractiveDemo";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <LensFlow />
      <HowItWorks />
      <InteractiveDemo />
      <MarketIntelligence />
      <ResearchConsensus />
      <BullBearPanel />
      <EdgeScoreSection />
      <RiskSection />
      <PaperTradingSection />
      <BacktestingSection />
      <SignalForensics />
      <OpportunityMap />
      <EventRadar />
      <ModulesSection />
      <Audiences />
      <Philosophy />
      <Pricing compact />
      <Security />
      <RiskDisclosureSection />
      <FAQSection limit={6} />
      <CTA />
    </>
  );
}
