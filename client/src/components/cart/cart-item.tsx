import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { useCart, type CartItem as CartItemType } from "@/lib/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-24 object-cover rounded-md"
            data-testid={`img-cart-item-${item.productId}`}
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm leading-tight" data-testid={`text-cart-item-name-${item.productId}`}>
                {item.name}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={() => removeItem(item.productId, item.size, item.color)}
                data-testid={`button-remove-${item.productId}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <div>Talle: {item.size}</div>
              <div>Color: {item.color}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.productId, item.size, item.color, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                  data-testid={`button-decrease-${item.productId}`}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-8 text-center" data-testid={`text-quantity-${item.productId}`}>
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                  data-testid={`button-increase-${item.productId}`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-right">
                <div className="font-condensed font-bold text-lg" data-testid={`text-price-${item.productId}`}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  ${item.price.toFixed(2)} c/u
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
