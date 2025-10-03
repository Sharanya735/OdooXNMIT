import { Button } from "@/components/ui/button";
import { Leaf, Menu, Search, Heart, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <Leaf className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-bold text-foreground">ReCircle</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/shop" className="text-foreground hover:text-primary transition-colors">Shop</Link>
              <Link to="#" className="text-foreground hover:text-primary transition-colors">Sell</Link>
              <Link to="#" className="text-foreground hover:text-primary transition-colors">About</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-muted rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Search items..."
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/favorites">
                <Heart className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/cart">
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link to="/auth">
                <User className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
