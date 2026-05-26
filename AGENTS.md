"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import confetti from "canvas-confetti";

interface ParticleType {
  id: number;
  x: number;
  y: number;
}

interface HeartType {
  id: number;
  left: string;
  delay: number;
  duration: number;
}

function FloatingHeart({
  delay,
  left,
  duration,
}: {
  delay: number;
  left: string;
  duration: number;
}) {
  return (
    <motion.div
      initial={{ y: "100vh", opacity: 0 }}
      animate={{
        y: "-10vh",
        opacity: [0, 0.4, 0.4, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
      className="fixed text-pink-500/20 text-2xl pointer-events-none z-0"
      style={{ left }}
    >
      ♡
    </motion.div>
  );
}

function Particle({ x, y }: { x: number; y: number }) {
  const randomX = useMemo(() => (Math.random() - 0.5) * 160, []);
  const randomY = useMemo(() => Math.random() * 160, []);

  return (
    <motion.div
      initial={{
        x,
        y,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: x + randomX,
        y: y - randomY,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="fixed w-2 h-2 bg-pink-400 rounded-full pointer-events-none z-[9999]"
    />
  );
}

function GlitchText({ text }: { text: string }) {
  return (
    <motion.span
      animate={{
        textShadow: [
          "0 0 20px rgba(244,114,182,0.6)",
          "2px 2px 20px rgba(168,85,247,0.9)",
          "0 0 20px rgba(244,114,182,0.6)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      className="bg-gradient-to-r from-pink-300 to-violet-400 bg-clip-text text-transparent"
    >
      {text}
    </motion.span>
  );
}

export default function Home() {
  const [particles, setParticles] = useState<ParticleType[]>([]);
  const [showSecret, setShowSecret] = useState(false);

  const hearts: HeartType[] = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        delay: i * 1.2,
        duration: Math.random() * 3 + 5,
      })),
    []
  );

  const handlePageClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const x = e.clientX;
    const y = e.clientY;

    const newParticles = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      x,
      y,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter(
          (p) =>
            !newParticles.find((n) => n.id === p.id)
        )
      );
    }, 800);
  };

  const handleScrollButton = () => {
    const section = document.getElementById("cards-section");

    section?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleFinalSurprise = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    confetti({
      particleCount: 150,
      spread: 80,
      origin: {
        y: 0.6,
      },
      colors: ["#ff69b4", "#a855f7", "#ffffff"],
    });

    setShowSecret(true);
  };

  return (
    <main
      onClick={handlePageClick}
      className="relative min-h-screen overflow-x-hidden bg-black text-white"
    >
      {/* PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((p) => (
          <Particle
            key={p.id}
            x={p.x}
            y={p.y}
          />
        ))}
      </div>

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"
        />

        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute w-[400px] h-[400px] bg-violet-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]"
        />
      </div>

      {/* FLOATING HEARTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <FloatingHeart
            key={heart.id}
            delay={heart.delay}
            left={heart.left}
            duration={heart.duration}
          />
        ))}
      </div>

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-pink-300 tracking-[0.3em] uppercase text-sm"
        >
          for someone special
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl text-6xl md:text-8xl font-black leading-tight"
        >
          Out of <GlitchText text="billions" />
          <br />
          of people...
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 max-w-xl text-lg text-gray-400"
        >
          somehow, my favorite notification became yours.
        </motion.p>

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleScrollButton();
          }}
          className="mt-10 rounded-full bg-white text-black px-8 py-4 font-bold"
        >
          scroll down ↓
        </motion.button>
      </section>

      {/* CARDS */}
      <section
        id="cards-section"
        className="relative z-10 grid gap-6 px-6 pb-32 md:grid-cols-3 max-w-6xl mx-auto"
      >
        {[
          "your laugh.exe",
          "late night chats",
          "the way you say wkwk",
          "thinking about you",
          "your energy >>>",
          "you replying fast",
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              y: 40,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            whileHover={{
              scale: 1.03,
            }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-bold">
              {item}
            </h2>

            <p className="mt-4 text-gray-400">
              somehow this became one of my favorite things lately.
            </p>
          </motion.div>
        ))}
      </section>

      {/* FINAL */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center pb-20">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          className="rounded-[35px] border border-pink-400/20 bg-white/5 p-10 backdrop-blur-3xl max-w-xl w-full"
        >
          <p className="text-pink-300 uppercase tracking-[0.3em] text-xs">
            final message
          </p>

          <h2 className="mt-6 text-5xl font-black">
            I really like
            <br />
            talking to you.
          </h2>

          <div className="mt-10">
            <AnimatePresence mode="wait">
              {!showSecret ? (
                <motion.button
                  key="button"
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={handleFinalSurprise}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-8 py-4 font-bold"
                >
                  click me ♡
                </motion.button>
              ) : (
                <motion.div
                  key="message"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >
                  <p className="text-xl font-bold text-pink-400">
                    specially made for you ✨
                  </p>

                  <p className="mt-3 text-gray-400">
                    honestly...
                    i hope we keep talking longer.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </main>
  );
}