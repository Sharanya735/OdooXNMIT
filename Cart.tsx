import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import jacketImg from "@/assets/items/jacket.jpg";
import headphonesImg from "@/assets/items/headphones.jpg";
import lampImg from "@/assets/items/lamp.jpg";

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  condition: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Vintage Denim Jacket",
      price: 45,
      image: jacketImg,
      quantity: 1,
      condition: "Like New",
    },
    {
      id: 2,
      title: "Wireless Headphones",
      price: 65,
      image: headphonesImg,
      quantity: 1,
      condition: "Good",
    },
    {
      id: 3,
      title: "Modern Desk Lamp",
      price: 30,
      image: lampImg,
      quantity: 2,
      condition: "Excellent",
    },
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xl text-muted-foreground mb-4">
                Your cart is empty
              </p>
              <Button asChild>
                <a href="/shop">Continue Shopping</a>
              </Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Condition: {item.condition}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-2 border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <span className="text-xl font-bold text-primary">
                              ${item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card className="sticky top-4">
                  <CardContent className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      Order Summary
                    </h2>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">${subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-semibold">${shipping}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-primary">
                          ${total}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/shop">Continue Shopping</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
