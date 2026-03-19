import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-bold text-primary-foreground">P</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">Paythra</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Stats
          </a>
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a href="#features" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#stats" className="text-sm text-muted-foreground" onClick={() => setIsOpen(false)}>Stats</a>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start">Log in</Button>
            </Link>
            <Link to="/signup" onClick={() => setIsOpen(false)}>
              <Button size="sm" className="w-full bg-gradient-primary">Get Started Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
