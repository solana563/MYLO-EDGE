import { PageHero } from "./Pages";
import { InstallPanel, PlatformBadge } from "../components/app/NativeApp";
import { Section } from "../components/ui";

export function InstallPage() {
  return (
    <>
      <PageHero
        eyebrow="MYLO Edge app"
        title="Install MYLO Edge on your device."
        sub="MYLO Edge is an installable app as well as a website. Add it to your Home Screen or desktop to run it full screen, launch it instantly, and keep recent pages available offline."
      >
        <PlatformBadge />
      </PageHero>
      <Section>
        <div className="mx-auto max-w-2xl">
          <InstallPanel />
        </div>
      </Section>
    </>
  );
}
