import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 15,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1] // Custom snappy ease
        }
    },
    out: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const PageTransition = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
