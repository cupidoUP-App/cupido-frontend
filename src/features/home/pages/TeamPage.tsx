import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import team1 from '@assets/team1.webp';
import team2 from '@assets/team2.webp';
// Lazy load particles to reduce initial bundle size
const ParticlesComponent = lazy(() => import('@home/components/Particles').then(m => ({ default: m.ParticlesComponent })));
export default function TeamPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-[#E7D8D8] overflow-x-hidden flex flex-col relative">
            {/* Background Pattern */}
            <Suspense fallback={null}>
                <ParticlesComponent />
            </Suspense>
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <SimpleHeader />

            <main className="flex-grow pt-32 pb-16 relative z-10">
                <div className="container mx-auto px-6 lg:px-8">

                    {/* Intro Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide mb-4">
                            Talento Humano
                        </span>
                        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-6">
                            Nuestro Equipo
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Conoce a las mentes detrás de CUPIDO,trabajando juntos para crear un espacio agradable y seguro. Todos miembros de la UP,así como tu.
                        </p>
                    </motion.div>

                    {/* Group Photos Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">

                        {/* Photo 1 */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-video">
                                <img
                                    src={team1}
                                    alt="Equipo Cupido Grupo 1"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-medium text-lg">Innovación y Desarrollo</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Photo 2 */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-l from-primary to-accent rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 aspect-video">
                                <img
                                    src={team2}
                                    alt="Equipo Cupido Grupo 2"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-medium text-lg">Compromiso y Ética</p>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-center mt-16 max-w-3xl mx-auto"
                    >
                        <p className="text-lg text-muted-foreground italic">
                            "Hecho por estudiantes, para estudiantes"
                        </p>
                    </motion.div>

                </div>
            </main>

            <SimpleFooter />
            <ScrollToTopButton />
        </div>
    );
}
