import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./cart-item";
import { WhatsAppCheckoutButton } from "./whatsapp-checkout-button";
import { useCart } from "@/lib/cart";
import { ShoppingCart } from "lucide-react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, clearCart } = useCart();

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Agrega productos para comenzar tu compra
            </p>
            <Button onClick={onClose} data-testid="button-continue-shopping">
              Seguir Comprando
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span className="font-condensed text-2xl" data-testid="text-cart-subtotal">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                El envío se coordina por WhatsApp
              </p>

              <WhatsAppCheckoutButton items={items} subtotal={subtotal} />

              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
                data-testid="button-clear-cart"
              >
                Vaciar Carrito
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
