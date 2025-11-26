import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      href={`/producto/${product.id}`}
      data-testid={`card-product-${product.id}`}
    >
      <Card className="group overflow-hidden hover-elevate transition-all duration-300 hover:shadow-lg h-full">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-medium text-lg text-foreground line-clamp-2 min-h-[3.5rem]" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-condensed font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            {product.featured && (
              <Badge variant="secondary" className="text-xs">
                Destacado
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{product.category}</span>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-xs">
                Stock: {product.stock}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Sin stock
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
