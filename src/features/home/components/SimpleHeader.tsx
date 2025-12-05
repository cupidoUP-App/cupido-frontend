import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const SimpleHeader = () => {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Volver al inicio
                    </span>
                </Link>

                <Link to="/" className="flex items-center gap-2">
                    <img
                        src="https://i.postimg.cc/htWQx7q5/logo-Fix.webp"
                        alt="CUPIDO Logo"
                        className="h-12 w-auto"
                    />
                </Link>
            </div>
        </motion.header>
    );
};
