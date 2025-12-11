import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useMemo } from 'react';

// Lista de nombres del equipo
const teamNames = [
    "Karen Duque", "Cristian Jaimes", "Valentina Cuevas", "Fabian Gonzales",
    "Yan Ortega", "Leyder Castellanos", "Kevin Madrid", "Johan Triana",
    "Didier Duran", "Gilberth Lizcano", "Andrés Jaimes", "Cristian Valencia",
    "David Burbano", "Jeison Rodríguez", "Daniel Silva", "Carlos Rincones",
    "Gerson Villamizar", "César Durán", "Daniel Dávila", "Juan Rodriguez",
    "Jesús González", "Gonzalo Niño", "Jholman Sogamoso", "Jhoan Parra",
    "Jhordan Cáceres", "Oscar Gaitán", "Sergio Isidro", "Olga Blanco",
    "Alejandro Jaimes", "Fabio Barajas", "Jorge Florez", "Gustavo Gomez"
];

// Componente para un nombre flotante individual
const FloatingName = ({ name, index, total }: { name: string; index: number; total: number }) => {
    // Distribuir los nombres en diferentes posiciones horizontales
    const leftPosition = useMemo(() => {
        return (index % 6) * 16 + Math.random() * 10;
    }, [index]);
    
    // Diferentes duraciones para variedad
    const duration = useMemo(() => 20 + (index % 5) * 6, [index]);
    
    // Delay escalonado para que no aparezcan todos al mismo tiempo
    const delay = useMemo(() => (index / total) * 12, [index, total]);

    return (
        <motion.div
            className="absolute whitespace-nowrap text-primary/40 font-semibold text-base md:text-lg select-none pointer-events-none"
            style={{
                left: `${leftPosition}%`,
                filter: 'blur(0.5px)',
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
                y: '-100%',
                opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'linear',
            }}
        >
            {name}
        </motion.div>
    );
};

export default function SeeYouSoonPage() {
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

    const heartVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-[#E7D8D8] overflow-hidden flex flex-col relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-rose-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Credits Background */}
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                {teamNames.map((name, index) => (
                    <FloatingName 
                        key={name} 
                        name={name} 
                        index={index} 
                        total={teamNames.length} 
                    />
                ))}
            </div>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-16">
                <div className="container mx-auto max-w-3xl">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-10 text-center"
                    >
                        {/* Animated Heart Icon */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex justify-center"
                        >
                            <motion.div
                                variants={heartVariants}
                                initial="initial"
                                animate="animate"
                                className="p-6 bg-primary/10 rounded-full"
                            >
                                <Heart className="w-20 h-20 text-primary fill-primary/30" />
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
                                Gracias
                            </span>
                            <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground">
                                Nos vemos pronto
                            </h1>
                            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                        </motion.div>

                        {/* Description Card */}
                        <motion.div variants={itemVariants}>
                        <div className="p-8 bg-card/60 border border-border/50 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                                Cupido es un proyecto académico creado por estudiantes de Ingeniería del Software, 
                                su propósito más que ser un proyecto fue un reto individual en el cual todo el equipo 
                                dedicó su tiempo para entregar esto que fue Cupido, el proyecto es de código abierto 
                                y quedará para la universidad, les agradecemos por hacer parte de esto como usuarios, 
                                clientes, amigos, desarrolladores y posibles nuevas parejas.
                            </p>

                            <p className="mt-4">
                                <a 
                                    href="https://github.com/cupidoUP-App/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                                >
                                    Repositorio en GitHub
                                </a>
                            </p>

                            <p className="mt-2">
                                <a 
                                    href="https://instagram.com/cupidocol" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                                >
                                    Instagram
                                </a>
                            </p>

                            <p className="mt-2">
                                <a 
                                    href="mailto:cupidoup1@gmail.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
                                >
                                    cupidoup1@gmail.com
                                </a>
                            </p>

                            <p className="mt-6 text-primary font-semibold text-lg">
                                Ingenieria del Software II - 2025 - II
                            </p>
                            <p className="mt-2 text-foreground/50 text-xs">
                                Toda la información que fue suministrada por nuestros usuarios será eliminada por motivos de seguridad.
                            </p>
                        </div>
                        </motion.div>
                        {/* Footer message */}
                        <motion.div variants={itemVariants}>
                            <p className="text-foreground/60 text-sm">
                                Con amor, el{' '}
                                <a 
                                    href="/team" 
                                    className="text-primary hover:text-primary/80 underline transition-colors"
                                >
                                    equipo de Cupido
                                </a>{' '}
                                ❤️
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

