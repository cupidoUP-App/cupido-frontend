import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { motion } from 'framer-motion';

export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-[#E7D8D8] overflow-x-hidden flex flex-col relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <SimpleHeader />

            <main className="flex-grow pt-32 pb-16 relative z-10">
                <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-12"
                    >
                        <motion.div variants={itemVariants} className="text-center space-y-4">
                            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
                                Nosotros
                            </span>
                            <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground">
                                ¿Quiénes somos?
                            </h1>
                            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-8 text-lg">
                            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3">
                                CUPIDO, es un proyecto de curso universitario creado en la Universidad de Pamplona con el apoyo
                                de estudiantes y docentes de Ingeniería en Sistemas y Derecho. Nuestro
                                objetivo es ofrecer un espacio digital seguro y ético que fortalezca la
                                interacción social entre estudiantes.
                            </p>

                            <div className="p-6 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                                <p className="italic text-foreground/80">
                                    Nos inspiramos en la idea de un <strong className="text-primary font-semibold">dating universitario responsable</strong>,
                                    que promueva la comunicación respetuosa, la sana interacción afectiva y
                                    el cuidado de la vida digital.
                                </p>
                            </div>

                            <p>
                                CUPIDO no tiene fines de lucro: es una iniciativa académica y social, que
                                integra tecnología, derecho y ética digital para proteger tu privacidad y
                                bienestar emocional.
                            </p>

                            <p>
                                Confiar en nosotros significa contar con un equipo de tu mismo campus, comprometido con la
                                seguridad de tus datos y el cumplimiento de las normas de protección de la información internacionales,
                                nacionales e institucionales.
                            </p>

                            <p>
                                Agradecemos tu confianza y esperamos que CUPIDO sea un espacio seguro y saludable para ti.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            <SimpleFooter />
            <ScrollToTopButton />
        </div>
    );
}
