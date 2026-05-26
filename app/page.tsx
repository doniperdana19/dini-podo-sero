"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import Marquee from "react-fast-marquee";
import { FaHeart } from "react-icons/fa"; // Memastikan icon FaHeart terimport untuk floating hearts

// Interface pendukung tipe data TypeScript agar terbebas dari error check Vercel
interface HeartType {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
}

export default function Home() {
  const [warning, setWarning] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [showMyPhoto, setShowMyPhoto] = useState(false); // State untuk pop-up foto kamu
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [hearts, setHearts] = useState<HeartType[]>([]); // State hearts dengan tipe data terdefinisi eksplisit
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Efek generator posisi acak untuk floating hearts background (Aman untuk SSR Next.js)
  useEffect(() => {
    const generatedHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      delay: i * 1.5,
      duration: Math.random() * 3 + 6,
      size: Math.random() * 15 + 15
    }));
    setHearts(generatedHearts);
  }, []);

  const triggerChaos = () => {
    confetti({
      particleCount: 250,
      spread: 180,
      origin: { y: 0.6 },
    });

    // Memicu pop-up foto kamu muncul ke layar
    setShowMyPhoto(true);
  };

  const toggleEnvelope = () => {
    setIsEnvelopeOpen(!isEnvelopeOpen);
    
    // Efek confetti kecil pas amplop dibuka
    if (!isEnvelopeOpen) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      // Play audio gema takbiran kalau file mp3-nya sudah kamu siapin di folder public
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => console.log("Audio play diblokir browser, butuh interaksi user dulu."));
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-pink-500/30">
      
      {/* Tag Audio untuk Backsound Takbiran */}
      <audio ref={audioRef} src="/takbiran.mp3" loop />

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 80, -80, 0], y: [0, -50, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-150px] left-[-100px] h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -80, 80, 0], y: [0, 50, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-3xl"
        />
      </div>

      {/* Floating Hearts Background (Memanfaatkan state hearts yang sudah diperbaiki tipenya) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: "-10vh", opacity: [0, 0.25, 0.25, 0] }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
            className="absolute text-pink-500/20"
            style={{ left: heart.left, bottom: 0 }}
          >
            <FaHeart style={{ width: heart.size, height: heart.size }} />
          </motion.div>
        ))}
      </div>

      {/* POP-UP FOTO KAMU (Dipicu tombol Jamaah Jangan Diklik) */}
      <AnimatePresence>
        {showMyPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 100 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative max-w-sm w-full bg-zinc-900 border-2 border-pink-500 rounded-[30px] p-6 text-center shadow-[0_0_20px_rgba(236,72,153,0.3)]"
            >
              {/* Box Wadah Foto */}
              <div className="overflow-hidden rounded-2xl border-4 border-white/10 aspect-[3/4] bg-neutral-800 flex items-center justify-center">
                <img
                  src="/foto-aku.jpeg" // Memakai ekstensi .jpeg sesuai file di folder public kamu
                  alt="Foto Ganteng Pembuat Web"
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.h2
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="mt-6 text-2xl font-black text-pink-400 tracking-wide uppercase"
              >
                🚨 KAN DIBILANG JANGAN! 🚨
              </motion.h2>

              <p className="mt-2 text-sm text-gray-300">
                Nekat banget malah diklik. Sekarang kamu terpaksa melihat ketampanan pembuat web ini 😎☝️
              </p>

              <button
                onClick={() => setShowMyPhoto(false)}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-3 font-bold text-sm uppercase tracking-wider text-white shadow-lg hover:brightness-110 transition"
              >
                Tutup, Ampun 😭🙏
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WARNING POPUP */}
      {warning && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.1, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="text-center">
            <motion.h1
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="text-5xl md:text-8xl font-black text-pink-500"
            >
              💨 Ari kamu DINI 💨
            </motion.h1>
            <p className="mt-4 text-2xl font-bold text-pink-300">
              podo sero overload kentut 😭
            </p>
          </div>
        </motion.div>
      )}

      {/* GIF CHAOS */}
      {showGif && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/90 px-6"
        >
          <img
            src="https://media.tenor.com/0AVbKGY_MxMAAAAC/cat-funny.gif"
            alt="funny"
            className="w-[300px] rounded-3xl"
          />
          <motion.h1
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="mt-8 text-center text-4xl font-black text-pink-400"
          >
            💨 PODO SERO OVERLOAD 💨
          </motion.h1>
          <button
            onClick={() => {
              setShowGif(false);
              if (audioRef.current) audioRef.current.pause();
            }}
            className="mt-8 rounded-full bg-pink-500 px-8 py-4 font-bold"
          >
            tutup 😭
          </button>
        </motion.div>
      )}

      {/* HERO SECTION */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-sm uppercase tracking-[0.4em] text-pink-400"
        >
          classified information
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl text-5xl font-black leading-tight md:text-8xl"
        >
          DINI HANDAYANI
          <br />
          DETECTION SYSTEM 🚨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 max-w-xl text-lg text-gray-400"
        >
          sistem mendeteksi manusia random
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={triggerChaos}
          className="mt-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 px-10 py-5 text-xl font-black shadow-2xl shadow-pink-500/30"
        >
          JAMA&apos;AH JANGAN DIKLIK 💀
        </motion.button>
      </section>

      {/* MARQUEE */}
      <Marquee
        speed={100}
        className="border-y border-pink-500/20 py-6 text-3xl font-black text-pink-400"
      >
        💨 DINI HANDAYANI PODOL SERO 💨 SELAMAT MALAM TAKBIRAN IDUL ADHA 👑 💨
      </Marquee>

      {/* CARDS SECTION */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-6 px-6 py-24 md:grid-cols-3">
        {[
          "kentut level: BENER sistem dini sok kentut ☢️",
          "status: bikin salting HUEE PADAHAL MAH LAGI BOONG INI 😭",
          "online 2 menit lalu 👀",
          "warning: terlalu lucu NAJONG  💀",
          "mood hari ini: GUA BENCI BAPAK KMU YAHH BAPAK BOWO TERCINTA KAMU NAJONG GUE TENDANG PELERNYA",
          "detected:takbi",
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-5 text-5xl"
            >
              💨
            </motion.div>
            <h2 className="text-3xl font-black">{item}</h2>
            <p className="mt-4 text-gray-400">
              sistem menyatakan Dini masih menjadi penyebab overthinking nasional 😭
            </p>
          </motion.div>
        ))}
      </section>

      {/* INTERACTIVE ENVELOPE (TAKBIRAN SPECIAL EDITION) */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 bg-gradient-to-b from-transparent via-pink-950/10 to-transparent py-20">
        <div className="text-center mb-10">
          <span className="text-xs bg-pink-500/20 text-pink-300 font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
            Spesial Malam Idul Adha 🌙
          </span>
          <h2 className="text-3xl md:text-5xl font-black mt-4">Ada Surat Buat Dini</h2>
          <p className="text-sm text-gray-400 mt-2">Klik amplop di bawah buat buka isinya</p>
        </div>

        <div className="relative w-full max-w-lg h-[450px] flex items-center justify-center">
          {/* Amplop Wadah */}
          <motion.div 
            onClick={toggleEnvelope}
            className="relative w-[340px] sm:w-[400px] h-[240px] bg-gradient-to-br from-pink-600 to-rose-700 rounded-2xl shadow-[0_20px_50px_rgba(236,72,153,0.3)] cursor-pointer z-30 flex flex-col items-center justify-center p-6 border border-pink-400/30"
            animate={{ y: isEnvelopeOpen ? 100 : [0, -10, 0] }}
            transition={{ duration: 3, repeat: isEnvelopeOpen ? 0 : Infinity, ease: "easeInOut" }}
          >
            {/* Segitiga Tutup Amplop */}
            <motion.div 
              className="absolute top-0 inset-x-0 h-0 w-0 border-t-[120px] border-t-pink-800 border-x-[170px] sm:border-x-[200px] border-x-transparent origin-top z-40 pointer-events-none"
              animate={{ rotateX: isEnvelopeOpen ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ transformOrigin: "top" }}
            />
            
            <p className="font-black text-xl tracking-wider drop-shadow">✉️ FOR YOU</p>
            <p className="text-xs text-pink-200 mt-1 uppercase font-bold tracking-widest">Klik untuk Buka</p>
          </motion.div>

          {/* Isi Surat Di Dalam Amplop (Lirik Takbiran Arab) */}
          <AnimatePresence>
            {isEnvelopeOpen && (
              <motion.div
                initial={{ y: 0, opacity: 0, scale: 0.9 }}
                animate={{ y: -110, opacity: 1, scale: 1 }}
                exit={{ y: 0, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 70, delay: 0.2 }}
                className="absolute w-[320px] sm:w-[380px] bg-zinc-900 border-2 border-pink-500/50 rounded-2xl p-6 shadow-2xl z-20 max-h-[380px] overflow-y-auto text-center"
              >
                <span className="text-2xl">🕋</span>
                <h3 className="text-xl font-black text-pink-400 mt-1">Gema Takbiran Terdeteksi</h3>
                
                <div className="my-6 space-y-4 border-t border-b border-white/10 py-4">
                  {/* Tulisan Arab */}
                  <p className="text-3xl font-serif text-amber-200 font-bold leading-loose tracking-wide direction-rtl text-center">
                    اللهُ أَكْبَرُ اللهُ أَكْبَرُ اللهُ أَكْبَرُ
                  </p>
                  {/* Transliterasi */}
                  <p className="text-xs text-pink-200 font-mono tracking-wide italic">
                    &quot;Allahu akbar, Allahu akbar, Allahu akbar...&quot;
                  </p>
                  {/* Terjemahan Modifikasi Lucu */}
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Artinya: Allah Maha Besar, gema takbiran berkumandang di mana-mana malam ini, tapi herannya pesona random Dini tetep ga berkurang dikit pun, walau aslinya bau podo sero sekebon 😭💨
                  </p>
                </div>
                
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
                  Selamat Hari Raya Idul Adha, Dini! ✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* FINAL SECTION */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-3xl rounded-[40px] border border-pink-500/20 bg-white/5 p-10 backdrop-blur-3xl"
        >
          <motion.h2
            animate={{
              textShadow: [
                "0 0 20px #ec4899",
                "0 0 40px #ec4899",
                "0 0 20px #ec4899",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl font-black text-pink-400 md:text-7xl"
          >
            FINAL WARNING ⚠️
          </motion.h2>

          <p className="mt-8 text-xl leading-relaxed text-gray-300">
            walaupun Dini suka kentut podo sero...
            <br />
            tetap aja orangnya bikin nyaman di hati semenjak takbiran ini berkumandang 😭
          </p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              confetti({
                particleCount: 400,
                spread: 200,
              });
              setShowGif(true);
            }}
            className="mt-10 rounded-full bg-pink-500 px-10 py-5 text-xl font-black"
          >
            pencet kalau Dini bau 💨
          </motion.button>
        </motion.div>
      </section>

    </main>
  );
}