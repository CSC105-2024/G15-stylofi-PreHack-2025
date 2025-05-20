import { motion } from "framer-motion";

const AnimatedContainer = ({ children }) => (
  <motion.div
    layout
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="bg-background/80 p-8 rounded-2xl shadow-lg w-full max-w-md"
  >
    {children}
  </motion.div>
);

export default AnimatedContainer;
