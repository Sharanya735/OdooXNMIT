import { useState } from "react";
import { Heart, ShoppingCart, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import jacketImg from "@/assets/items/jacket.jpg";
import bicycleImg from "@/assets/items/bicycle.jpg";
import backpackImg from "@/assets/items/backpack.jpg";
import mugImg from "@/assets/items/mug.jpg";

interface FavoriteItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  condition: string;
  category: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      title: "Vintage Denim Jacket",
      price: 45,
      originalPrice: 120,
      image: jacketImg,
      condition: "Like New",
      category: "Fashion",
    },
    {
      id: 4,
      title: "Classic Bicycle",
      price: 180,
      originalPrice: 450,
      image: bicycleImg,
      condition: "Good",
      category: "Sports & Outdoors",
    },
    {
      id: 5,
      title: "Leather Backpack",
      price: 55,
      originalPrice: 140,
      image: backpackImg,
      condition: "Like New",
      category: "Fashion",
    },
    {
      id: 6,
      title: "Ceramic Coffee Set",
      price: 25,
      originalPrice: 60,
      image: mugImg,
      condition: "Excellent",
      category: "Home & Living",
    },
  ]);

  const removeFromFavorites = (id: number) => {
    setFavorites((items) => items.filter((item) => item.id !== id));
    toast.success("Removed from favorites");
  };

  const handleAddToCart = (itemTitle: string) => {
    toast.success(`${itemTitle} added to cart!`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              My Favorites
            </h1>
          </div>

          {favorites.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">
                You haven't added any favorites yet
              </p>
              <Button asChild>
                <a href="/shop">Browse Items</a>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => {
                const discount = Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                );
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden group hover:shadow-[var(--shadow-hover)] transition-all"
                  >
                    <div className="relative overflow-hidden bg-muted/50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => removeFromFavorites(item.id)}
                        className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <X className="w-5 h-5 text-foreground" />
                      </button>
                      <Badge className="absolute top-4 left-4 bg-primary">
                        {discount}% OFF
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 text-foreground">
                            {item.title}
                          </h3>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ${item.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.originalPrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Condition: {item.condition}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item.title)}
                          className="gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
