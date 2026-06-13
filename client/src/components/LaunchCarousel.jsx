import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Componente Countdown interno para el Carousel
function CarouselCountdown({ targetDate, onExpire }) {
    const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTime({ days, hours, minutes, seconds });
                setIsExpired(false);
            } else {
                setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
                if (onExpire) onExpire();
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [targetDate, onExpire]);

    if (isExpired) {
        return <span className="text-white font-bold text-xl animate-pulse">¡Ya disponible!</span>;
    }

    return (
        <div className="flex justify-center items-center gap-2 sm:gap-4">
            {[
                { val: time.days, label: 'D' },
                { val: time.hours, label: 'H' },
                { val: time.minutes, label: 'M' },
                { val: time.seconds, label: 'S' }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-lg sm:text-2xl min-w-[50px] sm:min-w-[60px] text-center shadow-lg">
                        {String(item.val).padStart(2, '0')}
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function LaunchCarousel({ launches }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Estado local para controlar qué launches están "live" individualmente
    // Inicializamos un objeto mapa { [id]: boolean }
    const [liveStatus, setLiveStatus] = useState({});

    if (!launches || launches.length === 0) return null;

    const currentLaunch = launches[currentIndex];

    // Calcular targetDate para el item actual
    const targetDate = useMemo(() => {
        if (currentLaunch?.fechaLanzamiento) return new Date(currentLaunch.fechaLanzamiento);
        if (currentLaunch?.lanzamiento?.fecha) return new Date(currentLaunch.lanzamiento.fecha);
        const d = new Date(); d.setDate(d.getDate() + 7); return d;
    }, [currentLaunch]);

    // Verificar estado inicial
    useEffect(() => {
        const isNowLive = targetDate <= new Date();
        setLiveStatus(prev => ({
            ...prev,
            [currentLaunch._id]: isNowLive
        }));
    }, [targetDate, currentLaunch]);

    const handleExpire = () => {
        setLiveStatus(prev => ({
            ...prev,
            [currentLaunch._id]: true
        }));
    };

    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % launches.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + launches.length) % launches.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    // Helper para imágenes
    const getImageSrc = (src) => {
        if (!src) return '/placeholder.jpg';
        if (src.startsWith('http') || src.startsWith('data:')) return src;
        if (src.startsWith('/uploads')) return src;
        return `/uploads/${src}`;
    };

    const isLive = liveStatus[currentLaunch._id];

    return (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Navegación (solo si hay más de 1) */}
            {launches.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <ChevronLeft size={48} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                    >
                        <ChevronRight size={48} />
                    </button>
                </>
            )}

            {/* Contenido */}
            <div className={`transition-opacity duration-500 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <div className="relative w-full text-center">

                    {/* Indicadores de diapositiva */}
                    {launches.length > 1 && (
                        <div className="flex justify-center gap-2 mb-8">
                            {launches.map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1 cursor-pointer transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-gray-700 hover:bg-gray-500'}`}
                                />
                            ))}
                        </div>
                    )}

                    <h2 className="text-3xl md:text-5xl font-bold mb-12 uppercase tracking-tight text-white font-display">
                        {launches.length > 1 ? 'Nuevos Lanzamientos' : 'Nuevo Lanzamiento'}
                    </h2>

                    {/* IMAGEN — bloqueada con blur hasta que el contador llegue a 0 */}
                    {currentLaunch.imagenes && currentLaunch.imagenes.length > 0 && (
                        <div className="mb-12 relative inline-block" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                            <img
                                src={getImageSrc(currentLaunch.imagenes[0])}
                                alt={currentLaunch.nombre}
                                draggable={false}
                                style={{
                                    filter: !isLive ? 'blur(18px) grayscale(60%) brightness(0.7)' : 'none',
                                    transition: isLive ? 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                                    transform: isLive ? 'scale(1.05)' : 'scale(1)',
                                    transitionProperty: 'filter, transform',
                                    transitionDuration: '1.2s',
                                }}
                                className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                            />
                            {/* Candado — visible solo mientras el contador esté activo */}
                            {!isLive && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ borderRadius: '1rem' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <span style={{ color: 'rgba(201,168,76,0.8)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 10, fontFamily: 'Inter, sans-serif' }}>Próximamente</span>
                                </div>
                            )}
                        </div>
                    )}

                    {isLive ? (
                        // MODO LIVE
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="max-w-4xl mx-auto mb-8">
                                <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white font-serif bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                                    {currentLaunch.nombre}
                                </h3>
                                <p className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
                                    {currentLaunch.descripcionLanzamiento || currentLaunch.lanzamiento?.descripcion || currentLaunch.descripcion}
                                </p>
                                <div className="text-4xl font-bold text-brand-gold mb-10 tracking-tight">
                                    ${currentLaunch.precio?.toLocaleString()}
                                </div>
                            </div>

                            <Link
                                to={`/producto/${currentLaunch._id}`}
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black transition-all duration-200 bg-white font-display uppercase tracking-widest hover:bg-brand-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold overflow-hidden rounded-sm"
                            >
                                <span className="mr-2">Ver Detalle</span>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ) : (
                        // MODO TEASER
                        <div className="animate-in fade-in zoom-in duration-700">
                            <div className="mb-10 bg-white/5 backdrop-blur-sm p-8 rounded-2xl inline-block border border-white/10">
                                <p className="text-xs uppercase tracking-[0.3em] mb-6 text-brand-gold font-bold">
                                    Tiempo Restante para Revelación
                                </p>
                                <CarouselCountdown
                                    targetDate={targetDate}
                                    onExpire={handleExpire}
                                />
                            </div>
                            <div className="mt-8 text-gray-500 text-sm tracking-wide">
                                La espera valdrá la pena
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
