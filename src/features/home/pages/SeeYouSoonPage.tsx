import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

// Lista de nombres del equipo
const teamNames = [
    "Karen Duque", "Cristian Delgado", "Valentina Cuevas", "Fabian Gonzalez",
    "Yan Ortega", "Leyder Castellanos", "Kevin Madrid", "Johan Triana",
    "Didier Tabaco", "Gilberth Lizcano", "Andrés Jaimes", "Cristian Fajardo",
    "David Burbano", "Jeison Rodríguez", "Daniel Silva", "Carlos Rincones",
    "Gerson Villamizar", "César Durán", "Daniel Dávila", "Juan Rodriguez",
    "Jesús González", "Gonzalo Niño", "Jholman Sogamoso", "Jhoan Parra",
    "Jhordan Cáceres", "Oscar Gaitán", "Sergio Isidro", "Olga Blanco",
    "Alejandro Jaimes", "Fabio Barajas", "Jorge Florez", "Gustavo Gomez",
    "Danna Hernandez"
];

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

interface FloatingItem {
    name: string;
    lane: number;
    delay: number;
    duration: number;
    offset: number;
}

// Componente para un nombre flotante individual
const FloatingName = ({ item, isMobile, totalColumns }: { item: FloatingItem; isMobile: boolean; totalColumns: number }) => {
    // Calculamos la posición para que esté centrada en su carril
    const leftPosition = useMemo(() => {
        const colWidth = 100 / totalColumns;
        const centerOfLane = item.lane * colWidth + (colWidth / 2);
        // Desplazamiento limitado entre -20% y +20% del ancho de columna para mantenerlo dentro
        // item.offset es 0-1, restamos 0.5 para tener -0.5 a 0.5
        const randomShift = (item.offset - 0.5) * (colWidth * 0.4); 
        return centerOfLane + randomShift;
    }, [item, totalColumns]);

    return (
        <motion.div
            className={`absolute whitespace-nowrap text-primary/40 font-semibold select-none pointer-events-none ${
                isMobile ? 'text-[10px] opacity-80' : 'text-sm md:text-base'
            }`}
            style={{
                left: `${leftPosition}%`,
                transform: 'translateX(-50%)', // Centrar el elemento en su posición
                filter: isMobile ? 'blur(0px)' : 'blur(0.5px)',
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
                y: '-100%',
                opacity: [0, isMobile ? 0.9 : 0.7, isMobile ? 0.9 : 0.7, 0]
            }}
            transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay,
                ease: 'linear',
            }}
        >
            {item.name}
        </motion.div>
    );
};

export default function SeeYouSoonPage() {
    const isMobile = useIsMobile();
    const [items, setItems] = useState<FloatingItem[]>([]);

    useEffect(() => {
        const columns = isMobile ? 3 : 6;
        // Crear pool de carriles balanceados
        let lanes: number[] = [];
        const namesCount = teamNames.length;
        const minPerLane = Math.floor(namesCount / columns);
        
        // Llenar carriles base
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < minPerLane; j++) lanes.push(i);
        }
        // Llenar sobrantes
        const remaining = namesCount - lanes.length;
        for (let i = 0; i < remaining; i++) lanes.push(i % columns);
        
        // Mezclar carriles
        lanes = lanes.sort(() => Math.random() - 0.5);
        
        // Mezclar nombres para asignarles carriles aleatorios
        const shuffledNames = [...teamNames].sort(() => Math.random() - 0.5);
        
        const newItems = shuffledNames.map((name, i) => ({
            name,
            lane: lanes[i],
            delay: Math.random() * 20, // Delay aleatorio entre 0 y 20s
            duration: 25 + Math.random() * 15, // Duración aleatoria entre 25 y 40s (más lento)
            offset: Math.random() // Offset aleatorio dentro del carril
        }));
        
        setItems(newItems);
    }, [isMobile]);

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
                ease: "easeInOut" as const
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
                {items.map((item, index) => (
                    <FloatingName 
                        key={`${item.name}-${index}`} 
                        item={item} 
                        isMobile={isMobile}
                        totalColumns={isMobile ? 3 : 6}
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

