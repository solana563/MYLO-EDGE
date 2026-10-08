import { CloudOff, Home, RotateCcw, ServerCrash } from "lucide-react";
import { Button, Panel } from "../components/ui";
import { Link } from "../lib/router";
import { Logo } from "../components/navigation/Navbar";

function Shell({
  code,
  title,
  body,
  children,
  icon,
}: {
  code: string;
  title: string;
  body: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-24 pb-16 sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="absolute top-10 left-1/2 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,143,217,0.1),transparent)]" />
      </div>
      <div className="relative w-full max-w-lg text-center">
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <Panel className="p-8 sm:p-10">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-lg border border-hairline-strong bg-white/[0.03]">
            {icon}
          </span>
          <p className="num mt-6 text-[11px] tracking-[0.24em] text-ink-faint uppercase">
            Error {code}
          </p>
          <h1 className="mt-3 text-[26px] leading-tight font-semibold text-ink sm:text-[30px]">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-muted">
            {body}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{children}</div>
        </Panel>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <Shell
      code="404"
      title="Looks like this market moved."
      body="Let's get you back on track."
      icon={<Home className="h-4.5 w-4.5 text-edge" aria-hidden />}
    >
      <Button to="/" size="lg">
        Return Home
      </Button>
      <Button to="/resources" variant="outline" size="lg">
        Browse resources
      </Button>
    </Shell>
  );
}

export function ServerErrorPage() {
  return (
    <Shell
      code="500"
      title="Something failed on our side."
      body="The request could not be completed. Nothing about your account or data has been changed."
      icon={<ServerCrash className="h-4.5 w-4.5 text-bear" aria-hidden />}
    >
      <Button onClick={() => window.location.reload()} size="lg">
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
      <Button to="/" variant="outline" size="lg">
        Return Home
      </Button>
    </Shell>
  );
}

export function OfflinePage() {
  return (
    <Shell
      code="OFFLINE"
      title="No connection to market data."
      body="You appear to be offline. Cached pages remain available; live data will resume when the connection returns."
      icon={<CloudOff className="h-4.5 w-4.5 text-caution" aria-hidden />}
    >
      <Button onClick={() => window.location.reload()} size="lg">
        <RotateCcw className="h-4 w-4" />
        Retry
      </Button>
      <Button to="/" variant="outline" size="lg">
        Return Home
      </Button>
    </Shell>
  );
}
