import { InstallPanel, PlatformBadge } from "../components/app/NativeApp";
import { Section } from "../components/ui";

export function InstallPage() {
  return (
    <>
      <header className="border-b border-hairline px-5 pt-24 pb-12 sm:px-7 sm:pt-32">
        <div className="mx-auto max-w-[1200px]">
          <p className="num text-[10.5px] tracking-[0.22em] text-edge uppercase">MYLO Edge app</p>
          <h1 className="mt-4 max-w-3xl text-[32px] leading-tight font-semibold text-ink sm:text-[46px]">Install MYLO Edge on your device.</h1>
          <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-muted">Add MYLO Edge to your Home Screen or desktop to run the terminal full screen and keep the app available offline.</p>
          <div className="mt-8"><PlatformBadge /></div>
        </div>
      </header>
      <Section>
        <div className="mx-auto max-w-2xl">
          <InstallPanel />
        </div>
      </Section>
    </>
  );
}
