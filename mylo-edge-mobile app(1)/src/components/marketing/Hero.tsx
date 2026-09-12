import { ArrowRight, PlayCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ASSETS } from "../../data/demo";
import { Button } from "../ui";
import { TerminalPreview } from "../product-demos/Terminal";

const TRUST = [
  "MARKET DATA",
  "TECHNICAL ANALYSIS",
  "RESEARCH CONSENSUS",
  "RISK ENGINE",
  "BACKTESTING",
  "PAPER TRADING",
];

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number, y = 16) => ({
    initial: reduce ? false : { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <div className="relative px-3 pt-3 sm:px-5 sm:pt-5">
      {/* One clipped canvas holds the copy, glass market sculpture and terminal. */}
      <section className="relative mx-auto min-h-[880px] max-w-[1360px] overflow-hidden rounded-[26px] border border-edge/10 bg-[#0c0e0d] shadow-[0_35px_100px_-55px_rgba(0,0,0,1)] sm:min-h-[930px] sm:rounded-[32px] lg:min-h-[900px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(91,143,217,0.06),transparent_30%),radial-gradient(circle_at_90%_50%,rgba(150,232,121,0.075),transparent_38%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-edge/25 to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-edge/20 via-transparent to-transparent" />
        </div>

        {/* Product copy mirrors the clean left-hand composition of the reference. */}
        <div className="relative z-20 max-w-[570px] px-6 pt-32 sm:px-12 sm:pt-40 lg:px-16 lg:pt-[184px] xl:px-20">
          <motion.div {...fade(0)} className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 bg-white/[0.04]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path
                  d="M4 17L9 11L13 14L20 6"
                  fill="none"
                  stroke="#96e879"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="6" r="2" fill="#e8ecf2" />
              </svg>
            </span>
            <p className="num text-[14px] font-semibold tracking-[0.19em] text-ink uppercase sm:text-[15px]">
              MYLO <span className="text-edge">EDGE</span>
            </p>
          </motion.div>

          <motion.h1
            {...fade(0.07)}
            className="mt-7 text-[39px] leading-[1.04] font-medium tracking-[-0.04em] text-ink sm:text-[55px] lg:text-[62px]"
          >
            Find your
            <br />
            market edge.
          </motion.h1>

          <motion.p
            {...fade(0.14)}
            className="mt-5 max-w-[470px] text-[15px] leading-relaxed text-ink-muted sm:text-[16px]"
          >
            Market intelligence for traders who want to understand the market,
            not just react to it.
          </motion.p>

          <motion.p
            {...fade(0.2)}
            className="num mt-3 text-[10.5px] tracking-[0.14em] text-ink-faint uppercase"
          >
            Data. Research. Risk. One clearer view.
          </motion.p>

          <motion.div
            {...fade(0.27)}
            className="mt-7 flex flex-col gap-3 min-[430px]:flex-row"
          >
            <Button
              to="/signup"
              size="lg"
              event="hero_explore"
              className="border-ink bg-ink text-void hover:bg-white"
            >
              Explore MYLO Edge
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              to="/how-it-works"
              variant="outline"
              size="lg"
              event="hero_how_it_works"
            >
              <PlayCircle className="h-4 w-4" />
              See how it works
            </Button>
          </motion.div>
        </div>

        {/* Generated 3D glass market object: the dominant visual anchor. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute top-[365px] right-[-100px] z-10 w-[440px] sm:top-[280px] sm:right-[-80px] sm:w-[520px] lg:top-[112px] lg:right-[10px] lg:w-[530px] xl:right-[52px] xl:w-[560px]"
          aria-hidden
        >
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgba(86,96,238,0.18),rgba(61,211,127,0.08),transparent)] blur-2xl" />
          <img
            src="/images/mylo-glass-market.png"
            alt=""
            width="1024"
            height="1280"
            fetchPriority="high"
            className="relative h-auto w-full object-contain opacity-75 mix-blend-screen sm:opacity-90 lg:opacity-100"
          />
        </motion.div>

        {/* The terminal rises from the bottom, as in the supplied visual. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 44, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-[650px] right-3 left-3 z-30 sm:top-[625px] sm:right-7 sm:left-7 lg:top-[555px] lg:right-8 lg:left-8 xl:right-10 xl:left-10"
        >
          <div className="pointer-events-none absolute -inset-8 -z-10 bg-[radial-gradient(closest-side,rgba(150,232,121,0.08),transparent)]" aria-hidden />
          <TerminalPreview asset={ASSETS[0]} label="PRODUCT DEMO · SIMULATED" />
        </motion.div>
      </section>

      {/* Compact trust rail below the visual composition. */}
      <div className="mx-auto max-w-[1200px] px-2 py-7 sm:px-7 sm:py-8">
        <p className="text-center text-[13px] text-ink-muted">
          Built around evidence, transparency and risk awareness.
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2.5">
          {TRUST.map((item) => (
            <li
              key={item}
              className="num text-[9.5px] tracking-[0.17em] text-ink-faint uppercase sm:text-[10.5px]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}