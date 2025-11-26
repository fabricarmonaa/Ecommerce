import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { type Product } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShoppingCart, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function ProductDetail() {
  const [, params] = useRoute("/producto/:id");
  const productId = params?.id;

  const [cartOpen, setCartOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      size: selectedSize,
      color: selectedColor,
      quantity,
      image: product.images[0],
    });

    setCartOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCartOpen(true)} onSearch={() => {}} searchQuery="" />
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-md" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header onCartClick={() => setCartOpen(true)} onSearch={() => {}} searchQuery="" />
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Producto no encontrado
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  const canAddToCart = selectedSize && selectedColor && quantity > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header onCartClick={() => setCartOpen(true)} onSearch={() => {}} searchQuery="" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <Card className="overflow-hidden p-0">
              <img
                src={product.images[mainImageIndex]}
                alt={product.name}
                className="aspect-[3/4] w-full object-cover"
                data-testid="img-main-product"
              />
            </Card>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all hover-elevate ${
                      index === mainImageIndex ? "border-primary" : "border-border"
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-product-name">
                {product.name}
              </h1>
              <p className="text-4xl font-condensed font-bold text-primary" data-testid="text-product-price">
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                Descripción
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
                Talle
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    data-testid={`button-size-${size}`}
                    className="min-w-[3rem]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    data-testid={`button-color-${color}`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
                Cantidad
              </h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-medium w-12 text-center" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Stock disponible: {product.stock}
              </p>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al Carrito
            </Button>

            {product.category && (
              <div className="pt-4 border-t">
                <Badge variant="secondary" data-testid="badge-category">
                  {product.category}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
