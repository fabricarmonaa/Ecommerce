import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { type CartItem } from "@/lib/cart";
import { type Configuration } from "@shared/schema";
import { MessageCircle } from "lucide-react";

interface WhatsAppCheckoutButtonProps {
  items: CartItem[];
  subtotal: number;
}

export function WhatsAppCheckoutButton({ items, subtotal }: WhatsAppCheckoutButtonProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const { data: config } = useQuery<Configuration[]>({
    queryKey: ["/api/configuration"],
  });

  useEffect(() => {
    const phoneConfig = config?.find(c => c.key === "whatsapp_number");
    if (phoneConfig) {
      setWhatsappNumber(phoneConfig.value);
    }
  }, [config]);

  const handleWhatsAppCheckout = () => {
    let message = "¡Hola! Quiero realizar el siguiente pedido:\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   - Talle: ${item.size}\n`;
      message += `   - Color: ${item.color}\n`;
      message += `   - Cantidad: ${item.quantity}\n`;
      message += `   - Precio: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Total: $${subtotal.toFixed(2)}*\n\n`;
    message += "¿Cuál es el costo de envío a mi dirección?";

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  if (!whatsappNumber) {
    return (
      <Button className="w-full" disabled data-testid="button-whatsapp-checkout">
        <MessageCircle className="mr-2 h-5 w-5" />
        Configuración de WhatsApp pendiente
      </Button>
    );
  }

  return (
    <Button
      className="w-full bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground"
      onClick={handleWhatsAppCheckout}
      data-testid="button-whatsapp-checkout"
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Completar por WhatsApp
    </Button>
  );
}
