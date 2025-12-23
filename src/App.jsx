import React, { useState, useRef, useEffect } from 'react';
import { Heart, MapPin, Calendar, Clock } from 'lucide-react';

// ==========================================
// TIMING CONFIGURATION - Mudah untuk di-edit
// ==========================================
const TIMING = {
  // Envelope animation timing
  ENVELOPE_FLAP_OPEN: 1500,        // Waktu tutup amplop membuka (ms)
  SEAL_DISAPPEAR: 1200,            // Waktu seal menghilang (ms)
  ENVELOPE_FADE_OUT: 1000,         // Waktu amplop fade ke atas (ms)
  
  // Names reveal timing
  NAMES_DELAY: 500,                // Delay sebelum nama mulai muncul setelah amplop hilang (ms)
  NAMES_FADE_IN: 1000,             // Durasi fade-in nama (ms)
  NAMES_DISPLAY: 3000,             // Durasi nama terlihat penuh (ms)
  NAMES_FADE_OUT: 800,             // Durasi fade-out nama (ms)
  
  // Calculate total time to video
  get TOTAL_TO_VIDEO() {
    return this.ENVELOPE_FLAP_OPEN + this.ENVELOPE_FADE_OUT + this.NAMES_DELAY + this.NAMES_FADE_IN + this.NAMES_DISPLAY + this.NAMES_FADE_OUT;
  }
};

export default function WeddingInvitation() {
  const [stage, setStage] = useState('envelope'); // envelope, welcome, video, invitation
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeExiting, setWelcomeExiting] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [guestName, setGuestName] = useState("Bapak/Ibu/Saudara/i");
  const videoRef = useRef(null);

  // Deteksi apakah device adalah iOS
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Ambil nama tamu dari URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameFromUrl = params.get('name');
    if (nameFromUrl) {
      setGuestName(nameFromUrl);
    }
  }, []);
  
  const handleEnvelopeClick = () => {
    setEnvelopeOpen(true);
    
    // Setelah amplop fade, tampilkan welcome
    setTimeout(() => {
      setStage('welcome');
      setTimeout(() => {
        setShowWelcome(true);
      }, 100);
    }, TIMING.ENVELOPE_FLAP_OPEN + TIMING.ENVELOPE_FADE_OUT);
    
    // Mulai fade out welcome sebelum pindah ke video
    setTimeout(() => {
      setWelcomeExiting(true);
    }, TIMING.ENVELOPE_FLAP_OPEN + TIMING.ENVELOPE_FADE_OUT + TIMING.NAMES_DELAY + TIMING.NAMES_FADE_IN + TIMING.NAMES_DISPLAY);
    
    // Setelah welcome exit, pindah ke video
    setTimeout(() => {
      setStage('video');
    }, TIMING.TOTAL_TO_VIDEO);
  };

  // Auto-play video untuk Android, manual untuk iOS
  useEffect(() => {
    if (stage === 'video' && videoRef.current && !isIOS()) {
      // Android: Auto play dengan audio
      const playVideo = async () => {
        try {
          videoRef.current.muted = false;
          await videoRef.current.play();
          setVideoReady(true);
        } catch (error) {
          console.log('Autoplay failed, fallback to muted:', error);
          videoRef.current.muted = true;
          await videoRef.current.play();
          setVideoReady(true);
        }
      };
      playVideo();
    }
  }, [stage]);

  // Play video dengan audio setelah user klik tombol play (untuk iOS)
  const handlePlayVideo = async () => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false; // Unmute untuk audio
        await videoRef.current.play(); // Play dengan audio
        setVideoReady(true);
      } catch (error) {
        console.log('Video play error:', error);
        // Fallback: play muted jika gagal
        videoRef.current.muted = true;
        await videoRef.current.play();
        setVideoReady(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setStage('invitation');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Wedding Garden Background */}
      <div className="fixed inset-0">
        {/* Background Image with responsive sizing */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/background.png)',
            backgroundPosition: 'center center',
            backgroundSize: 'cover'
          }}
        >
          {/* Overlay untuk brightness control */}
          <div className="absolute inset-0 bg-white/10"></div>
        </div>

        {/* Sparkles overlay */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full shadow-lg"></div>
          </div>
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        
        {/* Animated butterflies */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`butterfly-${i}`}
            className="absolute z-50"
            style={{
              left: i % 2 === 0 ? '-10%' : 'auto',
              right: i % 2 === 1 ? '-10%' : 'auto',
              top: `${5 + i * 12}%`,
              animation: `butterfly ${10 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${i * 2.5}s`,
              opacity: 0.8
            }}
          >
            <svg width="45" height="45" viewBox="0 0 40 40" fill="none">
              <path d="M20 20C20 20 15 15 10 15C5 15 2 18 2 22C2 26 5 29 10 29C15 29 20 24 20 24" fill="#fbbf24" opacity="0.6"/>
              <path d="M20 20C20 20 25 15 30 15C35 15 38 18 38 22C38 26 35 29 30 29C25 29 20 24 20 24" fill="#fbbf24" opacity="0.6"/>
              <path d="M20 20C20 20 18 25 18 30C18 35 20 38 20 38C20 38 22 35 22 30C22 25 20 20 20 20" fill="#fb923c" opacity="0.7"/>
              <ellipse cx="20" cy="20" rx="2" ry="3" fill="#92400e"/>
            </svg>
          </div>
        ))}
        
        {/* ==================== ENVELOPE STAGE ==================== */}
        {stage === 'envelope' && (
          <div 
            className="transition-all w-full max-w-[95vw] sm:max-w-[550px] mx-auto"
            style={{
              opacity: envelopeOpen ? 0 : 1,
              transform: envelopeOpen ? 'translateY(-100px)' : 'translateY(0)',
              transition: `all ${TIMING.ENVELOPE_FADE_OUT}ms ease-in-out ${TIMING.ENVELOPE_FLAP_OPEN}ms`
            }}
            onClick={handleEnvelopeClick}
          >
            <div className="relative cursor-pointer group">
              
              <div className="relative w-full aspect-[550/380] perspective-1000">
                
                {/* Envelope body */}
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-amber-200/50 overflow-hidden">
                  
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle, #d4af37 2px, transparent 2px)',
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>

                  {/* Corner ornaments */}
                  <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-l-2 border-amber-300/50 rounded-tl-2xl"></div>
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 border-t-2 border-r-2 border-amber-300/50 rounded-tr-2xl"></div>
                  <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-l-2 border-amber-300/50 rounded-bl-2xl"></div>
                  <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 border-b-2 border-r-2 border-amber-300/50 rounded-br-2xl"></div>
                </div>

                {/* Envelope flap */}
                <div className="absolute top-0 left-0 w-full h-32 sm:h-48 overflow-hidden pointer-events-none">
                  <div 
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-200/80 via-amber-100/70 to-stone-100/60 origin-top border-l-2 border-r-2 border-t-2 border-amber-300/50"
                    style={{
                      clipPath: 'polygon(0 0, 50% 75%, 100% 0)',
                      transformStyle: 'preserve-3d',
                      transform: envelopeOpen ? 'rotateX(180deg) translateY(-100%)' : 'rotateX(0deg) translateY(0)',
                      opacity: envelopeOpen ? 0 : 1,
                      transition: `all ${TIMING.ENVELOPE_FLAP_OPEN}ms ease-in-out`
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center pt-4 sm:pt-8">
                      <div className="text-amber-700/40 text-[0.6rem] sm:text-xs tracking-[0.3em]">YOU'RE INVITED</div>
                    </div>
                  </div>
                </div>

                {/* Button "Buka Undangan" */}
                <div 
                  className="absolute top-28 sm:top-40 left-1/2 transform -translate-x-1/2"
                  style={{
                    transform: `translate(-50%, 0) scale(${envelopeOpen ? 0 : 1})`,
                    opacity: envelopeOpen ? 0 : 1,
                    transition: `all ${TIMING.SEAL_DISAPPEAR}ms ease-in-out`
                  }}
                >
                  <button className="px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 rounded-full shadow-2xl flex items-center justify-center border-2 sm:border-4 border-white group-hover:scale-110 transition-transform duration-300 hover:shadow-amber-300/50">
                    <span className="text-white font-semibold text-base sm:text-lg tracking-wide">Buka Undangan</span>
                  </button>
                </div>

                {/* Click instruction */}
                <div 
                  className="absolute -bottom-12 sm:-bottom-20 left-0 right-0 text-center"
                  style={{
                    opacity: envelopeOpen ? 0 : 1,
                    transition: 'opacity 300ms'
                  }}
                >
                  <p className="text-amber-700 text-sm sm:text-base font-light tracking-widest animate-pulse">Klik untuk Membuka</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== WELCOME STAGE ==================== */}
        {stage === 'welcome' && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-30"
            style={{
              opacity: showWelcome && !welcomeExiting ? 1 : 0,
              transform: showWelcome && !welcomeExiting ? 'scale(1)' : 'scale(0.95)',
              transition: welcomeExiting 
                ? `all ${TIMING.NAMES_FADE_OUT}ms ease-in` 
                : `all ${TIMING.NAMES_FADE_IN}ms ease-out`
            }}
          >
            {/* Animated particles background */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`welcome-particle-${i}`}
                className="absolute animate-float-slow"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  opacity: showWelcome && !welcomeExiting ? 0.6 : 0,
                  transition: `opacity ${TIMING.NAMES_FADE_IN}ms ease-out`
                }}
              >
                <div className="w-2 h-2 bg-amber-300 rounded-full blur-sm"></div>
              </div>
            ))}

            <div className="text-center px-8 relative z-10 max-w-2xl">
              <p 
                className="text-amber-700 text-sm tracking-[0.3em] mb-6 font-light"
                style={{
                  opacity: showWelcome && !welcomeExiting ? 1 : 0,
                  transform: showWelcome && !welcomeExiting ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all ${TIMING.NAMES_FADE_IN}ms ease-out 200ms`
                }}
              >
                UNDANGAN PERNIKAHAN
              </p>
              
              <h2 
                className="text-4xl md:text-5xl font-serif text-amber-800 mb-6 leading-relaxed" 
                style={{
                  fontFamily: "'Playfair Display', serif",
                  opacity: showWelcome && !welcomeExiting ? 1 : 0,
                  transform: showWelcome && !welcomeExiting ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all ${TIMING.NAMES_FADE_IN}ms ease-out 400ms`
                }}
              >
                Kepada Yth.
              </h2>
              
              <div 
                className="my-8"
                style={{
                  opacity: showWelcome && !welcomeExiting ? 1 : 0,
                  transform: showWelcome && !welcomeExiting ? 'scale(1)' : 'scale(0.5)',
                  transition: `all ${TIMING.NAMES_FADE_IN}ms ease-out 600ms`
                }}
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-300"></div>
                  <span className="text-2xl md:text-3xl font-serif text-amber-700 px-4">{guestName}</span>
                  <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-300"></div>
                </div>
              </div>
              
              <p 
                className="text-stone-600 text-lg md:text-xl leading-relaxed mb-6" 
                style={{
                  opacity: showWelcome && !welcomeExiting ? 1 : 0,
                  transform: showWelcome && !welcomeExiting ? 'translateY(0)' : 'translateY(30px)',
                  transition: `all ${TIMING.NAMES_FADE_IN}ms ease-out 800ms`
                }}
              >
                Tanpa mengurangi rasa hormat, kami mengundang<br/>
                Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami
              </p>

              <p 
                className="text-amber-800 text-3xl md:text-4xl font-serif mb-3"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  opacity: showWelcome && !welcomeExiting ? 1 : 0,
                  transform: showWelcome && !welcomeExiting ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all ${TIMING.NAMES_FADE_IN}ms ease-out 1000ms`
                }}
              >
                Raja & Bulan
              </p>

              <p 
                className="text-stone-600 text-lg tracking-widest"
                style={{
                  opacity: showWelcome && !welcomeExiting ? 1 : 0,
                  transform: showWelcome && !welcomeExiting ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all ${TIMING.NAMES_FADE_IN}ms ease-out 1200ms`
                }}
              >
                04 Januari 2026
              </p>
            </div>
          </div>
        )}

        {/* ==================== VIDEO STAGE ==================== */}
        {stage === 'video' && (
          <div 
            className="fixed inset-0 z-20"
            style={{
              opacity: stage === 'video' ? 1 : 0,
              transition: 'opacity 1500ms ease-in-out'
            }}
          >
            {/* Background layer */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/background.png)',
                backgroundPosition: 'center center',
                backgroundSize: 'cover'
              }}
            />
            
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10" />

            {/* Elegant Card Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-8">
              <div 
                className="relative w-full max-w-md max-h-[90vh]"
                style={{
                  opacity: stage === 'video' ? 1 : 0,
                  transform: stage === 'video' ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                  transition: 'all 800ms ease-out 200ms'
                }}
              >
                
                {/* Decorative frame corners */}
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-16 h-16 md:w-20 md:h-20 border-t-4 border-l-4 border-amber-300/60 rounded-tl-3xl z-10"></div>
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-16 h-16 md:w-20 md:h-20 border-t-4 border-r-4 border-amber-300/60 rounded-tr-3xl z-10"></div>
                <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-16 h-16 md:w-20 md:h-20 border-b-4 border-l-4 border-amber-300/60 rounded-bl-3xl z-10"></div>
                <div className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-16 h-16 md:w-20 md:h-20 border-b-4 border-r-4 border-amber-300/60 rounded-br-3xl z-10"></div>

                {/* Elegant Card */}
                <div className="relative w-full bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-200/50">
                  
                  {/* Inner decorative pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle, #d4af37 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  {/* Top ornamental header */}
                  <div className="absolute top-0 left-0 right-0 h-10 md:h-12 bg-gradient-to-b from-amber-50/80 to-transparent z-10">
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-px w-6 md:w-10 bg-gradient-to-l from-transparent to-amber-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Video container - Portrait ratio (9:16) */}
                  <div className="relative p-3 md:p-4">
                    <div className="relative w-full aspect-[9/16] max-h-[75vh]">
                      <div className="w-full h-full rounded-lg md:rounded-xl overflow-hidden shadow-inner bg-stone-100">
                        <video 
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          webkit-playsinline="true"
                          onEnded={handleVideoEnd}
                        >
                          <source src="/bulan_raja.mp4" type="video/mp4" />
                        </video>

                        {/* Play Button Overlay - hanya muncul di iOS */}
                        {!videoReady && isIOS() && (
                          <div 
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer z-20"
                            onClick={handlePlayVideo}
                          >
                            <div className="bg-white/95 rounded-full p-6 md:p-8 shadow-2xl hover:scale-110 transition-transform duration-300 border-4 border-amber-400 mb-6">
                              <svg className="w-12 h-12 md:w-16 md:h-16 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-white text-base md:text-lg font-medium tracking-wide animate-pulse px-4 text-center">
                              Tap untuk memutar video
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom ornamental footer */}
                  <div className="absolute bottom-0 left-0 right-0 h-10 md:h-12 bg-gradient-to-t from-amber-50/80 to-transparent z-10">
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-300"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Side ornaments */}
                  <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 hidden sm:block">
                    <div className="flex flex-col gap-2 opacity-30">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-amber-400"></div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 hidden sm:block">
                    <div className="flex flex-col gap-2 opacity-30">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-amber-400"></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Outer shadow/glow */}
                <div className="absolute inset-0 -z-10 blur-2xl bg-amber-200/20 scale-105 rounded-2xl md:rounded-3xl"></div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== INVITATION STAGE ==================== */}
        {stage === 'invitation' && (
          <div 
            className="w-full max-w-2xl"
            style={{
              opacity: stage === 'invitation' ? 1 : 0,
              transform: stage === 'invitation' ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.9)',
              transition: 'all 1200ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
              
              {/* Header */}
              <div className="relative bg-gradient-to-b from-amber-50 to-white pt-12 pb-8 px-8 text-center">
                <Heart className="w-10 h-10 text-rose-400 mx-auto mb-4 animate-pulse" fill="currentColor" />
                
                <p className="text-amber-700 text-sm tracking-[0.3em] mb-4 font-light">THE WEDDING OF</p>
                
                <h1 className="text-5xl font-serif text-amber-800 mb-3" style={{fontFamily: "'Playfair Display', serif"}}>
                  Raja & Bulan
                </h1>
                
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-300"></div>
                  <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />
                  <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-300"></div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-5 border border-stone-200 text-center">
                    <Calendar className="w-7 h-7 text-amber-600 mx-auto mb-3" />
                    <p className="text-sm text-stone-500 mb-1">Tanggal</p>
                    <p className="text-stone-700 font-medium">Minggu</p>
                    <p className="text-xl font-serif text-amber-800">04 Jan 2026</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-5 border border-stone-200 text-center">
                    <Clock className="w-7 h-7 text-amber-600 mx-auto mb-3" />
                    <p className="text-sm text-stone-500 mb-1">Waktu</p>
                    <p className="text-stone-700">Resepsi: 09.00</p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-xl p-6 border-2 border-stone-200">
                  <div className="flex items-start gap-3 mb-5">
                    <MapPin className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-serif text-stone-700 mb-2">Lokasi Acara</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        Kp.Irian No.2 RT.010/RW.004 Kel.Teluk Pucung, Kec.Bekasi Utara, Kota Bekasi<br/>
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white rounded-lg p-5 shadow border border-stone-200 text-center">
                    <p className="text-stone-600 text-sm mb-3">Scan untuk Google Maps</p>
                    <div className="w-36 h-36 bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg mx-auto flex items-center justify-center mb-4">
                      <MapPin className="w-12 h-12 text-stone-400" />
                    </div>
                    
                    <a 
                      href="https://maps.app.goo.gl/xQjhtfCZSUjF552s9?g_st=aw" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Buka Maps
                    </a>
                  </div>
                </div>

                {/* Quote */}
                <div className="text-center pt-6 border-t border-stone-200">
                  <p className="text-stone-600 text-sm italic leading-relaxed px-4">
                    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya"
                  </p>
                  <p className="text-stone-500 text-xs mt-2">QS. Ar-Rum: 21</p>
                  
                  <div className="mt-5">
                    <Heart className="w-6 h-6 text-rose-400 mx-auto mb-3" fill="currentColor" />
                    <p className="text-stone-600 text-sm">Merupakan suatu kehormatan bagi kami</p>
                    <p className="text-stone-600 text-sm">apabila Bapak/Ibu/Saudara/i berkenan hadir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
        
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -25px) rotate(5deg);
          }
          50% {
            transform: translate(-10px, -50px) rotate(-5deg);
          }
          75% {
            transform: translate(-20px, -25px) rotate(3deg);
          }
        }

        @keyframes butterfly {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 0.8;
          }
          15% {
            transform: translateX(15vw) translateY(-20px) rotate(8deg) scale(1.1);
          }
          30% {
            transform: translateX(35vw) translateY(-40px) rotate(-5deg) scale(0.95);
          }
          50% {
            transform: translateX(calc(50vw + 30%)) translateY(-25px) rotate(12deg) scale(1.05);
            opacity: 0.8;
          }
          70% {
            transform: translateX(calc(70vw + 40%)) translateY(-15px) rotate(-8deg) scale(1);
          }
          85% {
            transform: translateX(calc(90vw + 50%)) translateY(-35px) rotate(5deg) scale(0.9);
          }
          95% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(calc(110vw + 60%)) translateY(-50px) rotate(-15deg) scale(0.8);
            opacity: 0;
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}