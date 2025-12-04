import { Github, Linkedin, Award } from 'lucide-react';
import { SimpleHeader } from '../components/SimpleHeader';
import { SimpleFooter } from '../components/SimpleFooter';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
    name: string;
    role: string;
    image: string;
    github?: string;
    linkedin?: string;
}

const teamMembers: TeamMember[] = [
    {
        name: "Nombre del Miembro",
        role: "Rol / Cargo",
        image: "https://i.pravatar.cc/300?img=1", // Placeholder
        github: "#",
        linkedin: "#"
    },
    {
        name: "Nombre del Miembro",
        role: "Rol / Cargo",
        image: "https://i.pravatar.cc/300?img=2", // Placeholder
        github: "#",
        linkedin: "#"
    },
    {
        name: "Nombre del Miembro",
        role: "Rol / Cargo",
        image: "https://i.pravatar.cc/300?img=3", // Placeholder
        github: "#",
        linkedin: "#"
    },
    // Add more members as needed
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-background overflow-x-hidden flex flex-col relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <SimpleHeader />

            <main className="flex-grow pt-32 pb-16 relative z-10">
                <div className="container mx-auto px-6 lg:px-8">

                    {/* Team Section */}
                    <section className="mb-24">
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
                                Conoce a las mentes detrás de CUPIDO, trabajando para crear un espacio seguro y ético.
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                        >
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                                    }}
                                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                    className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 group"
                                >
                                    <div className="aspect-square overflow-hidden bg-muted relative">
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                        />
                                    </div>
                                    <div className="p-6 text-center relative">
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-background p-2 rounded-full border border-border/50 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        </div>
                                        <h3 className="font-display font-bold text-xl text-foreground mb-1">{member.name}</h3>
                                        <p className="text-sm text-primary font-medium mb-4 uppercase tracking-wider text-xs">{member.role}</p>

                                        <div className="flex justify-center space-x-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                            {member.github && (
                                                <a
                                                    href={member.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                                                >
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.linkedin && (
                                                <a
                                                    href={member.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                                                >
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>

                    {/* Honorable Mention Section */}
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-3xl p-8 md:p-12 border border-primary/10 text-center relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 p-4 opacity-5 animate-pulse">
                                <Award className="w-64 h-64 text-primary" />
                            </div>

                            <div className="relative z-10">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                    className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 ring-4 ring-primary/5"
                                >
                                    <Award className="w-10 h-10 text-primary" />
                                </motion.div>
                                <h2 className="font-display font-bold text-3xl text-foreground mb-4">
                                    Mención de Honor
                                </h2>
                                <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
                                    Un reconocimiento especial a quienes han contribuido significativamente al desarrollo y éxito de este proyecto con su dedicación y esfuerzo.
                                </p>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-background/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-border/50 inline-flex flex-col md:flex-row items-center gap-6 text-left max-w-lg w-full"
                                >
                                    <div className="w-24 h-24 bg-muted rounded-full overflow-hidden shrink-0 border-4 border-background shadow-sm">
                                        <img
                                            src="https://i.pravatar.cc/300?img=12"
                                            alt="Honorable Mention"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-bold text-xl text-foreground">Nombre del Homenajeado</h3>
                                        <p className="text-primary font-medium mb-2">Contribución Especial</p>
                                        <p className="text-sm text-muted-foreground">"Por su inquebrantable apoyo y guía técnica durante las fases críticas del desarrollo."</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.section>

                </div>
            </main>

            <SimpleFooter />
            <ScrollToTopButton />
        </div>
    );
}
