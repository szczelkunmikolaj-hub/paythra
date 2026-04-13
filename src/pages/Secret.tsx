import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const members = [
  { name: "Nigo", color: "text-blue-400" },
  { name: "Cockzia", color: "text-green-400" },
  { name: "Trastero", color: "text-orange-400" },
  { name: "Molestador", color: "text-pink-400" },
  { name: "Cummings", color: "text-white-400" },
];

const Secret = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="max-w-md w-full text-center space-y-8"
      >
        <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
          <Sparkles className="mx-auto h-16 w-16 text-yellow-400" />
        </motion.div>

        <h1 className="font-display text-4xl font-bold text-white">🤫🫃🏿🍆🍑💦👧🏾 Secret</h1>

        <div className="space-y-2">
          <p className="text-lg text-gray-300 font-medium italic">The Moe Lesters</p>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Made by</p>
        </div>

        <div className="space-y-3">
          {members.map((m, i) => (
            <motion.p
              key={m.name}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.2 }}
              className={`text-2xl font-bold ${m.color}`}
            >
              {m.name}
            </motion.p>
          ))}
        </div>

        <Link to="/">
          <Button variant="ghost" className="text-gray-500 hover:text-white mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Secret;
