import { useState } from "react";
import { Package, Shirt, Monitor, Home, BookOpen, Waves, Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import jacketImg from "@/assets/items/jacket.jpg";
import headphonesImg from "@/assets/items/headphones.jpg";
import lampImg from "@/assets/items/lamp.jpg";
import bicycleImg from "@/assets/items/bicycle.jpg";
import backpackImg from "@/assets/items/backpack.jpg";
import mugImg from "@/assets/items/mug.jpg";

const categories = [
  { name: "Fashion", icon: Shirt, count: "12.5K items" },
  { name: "Electronics", icon: Monitor, count: "8.2K items" },
  { name: "Home & Living", icon: Home, count: "15.3K items" },
  { name: "Books & Media", icon: BookOpen, count: "6.7K items" },
  { name: "Sports & Outdoors", icon: Waves, count: "4.9K items" },
  { name: "Other", icon: Package, count: "9.1K items" },
];

const items = [
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
    id: 2,
    title: "Wireless Headphones",
    price: 65,
    originalPrice: 150,
    image: headphonesImg,
    condition: "Good",
    category: "Electronics",
  },
  {
    id: 3,
    title: "Modern Desk Lamp",
    price: 30,
    originalPrice: 80,
    image: lampImg,
    condition: "Excellent",
    category: "Home & Living",
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
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const handleAddToCart = (itemTitle: string) => {
    toast.success(`${itemTitle} added to cart!`);
  };

  const handleAddToFavorites = (itemTitle: string) => {
    toast.success(`${itemTitle} added to favorites!`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Categories Section */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Browse by Category
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find exactly what you're looking for in our curated collections
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.name;
                return (
                  <Card
                    key={category.name}
                    className={`p-6 text-center cursor-pointer group hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-1 border-2 ${
                      isSelected ? "border-primary" : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        isSelected ? null : category.name
                      )
                    }
                  >
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br transition-all ${
                        isSelected
                          ? "from-primary/30 to-accent/30"
                          : "from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20"
                      } flex items-center justify-center`}
                    >
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1 text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </Card>
                );
              })}
            </div>

            {selectedCategory && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                >
                  Clear Filter
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Trending Items Section */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                {selectedCategory
                  ? `${selectedCategory} Items`
                  : "Trending Pre-Loved Items"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover amazing finds from our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const discount = Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                );
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden group hover:shadow-[var(--shadow-hover)] transition-all hover:-translate-y-1"
                  >
                    <div className="relative overflow-hidden bg-muted/50">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleAddToFavorites(item.title)}
                        className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <Heart className="w-5 h-5 text-foreground" />
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
