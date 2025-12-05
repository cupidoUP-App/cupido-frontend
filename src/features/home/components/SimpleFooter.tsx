import { motion } from 'framer-motion';

export const SimpleFooter = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="py-8 border-t border-border/40 bg-muted/30 mt-auto"
        >
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} CUPIDO — Proyecto académico. Universidad de Pamplona.
                </p>
            </div>
        </motion.footer>
    );
};
