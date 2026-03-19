import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-xs font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">Paythra</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link to="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SubSense. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
