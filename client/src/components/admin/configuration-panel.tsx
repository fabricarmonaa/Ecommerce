import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Configuration } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MessageCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function ConfigurationPanel() {
  const { toast } = useToast();
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const { data: config, isLoading, error } = useQuery<Configuration[]>({
    queryKey: ["/api/configuration"],
  });

  useEffect(() => {
    const phoneConfig = config?.find(c => c.key === "whatsapp_number");
    if (phoneConfig) {
      setWhatsappNumber(phoneConfig.value);
    }
  }, [config]);

  const mutation = useMutation({
    mutationFn: async (value: string) => {
      return await apiRequest("POST", "/api/configuration", {
        key: "whatsapp_number",
        value,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/configuration"] });
      toast({
        title: "Configuración guardada",
        description: "El número de WhatsApp se actualizó correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!whatsappNumber.trim()) {
      toast({
        title: "Error",
        description: "El número de WhatsApp es requerido",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(whatsappNumber);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </CardTitle>
          <CardDescription>
            Configura el número de WhatsApp para recibir pedidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Error al cargar la configuración</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="whatsapp">Número de WhatsApp (con código de país)</Label>
            <Input
              id="whatsapp"
              type="tel"
              placeholder="549XXXXXXXXXX"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              data-testid="input-whatsapp-number"
            />
            <p className="text-sm text-muted-foreground">
              Ejemplo: 549XXXXXXXXXX (Argentina con código de país 54 y prefijo 9)
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={mutation.isPending}
            data-testid="button-save-config"
          >
            {mutation.isPending ? "Guardando..." : "Guardar Configuración"}
          </Button>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Formato del mensaje de WhatsApp:</h4>
            <div className="bg-muted p-4 rounded-md text-sm space-y-2">
              <p>¡Hola! Quiero realizar el siguiente pedido:</p>
              <p className="ml-4">1. Nombre del producto</p>
              <p className="ml-6">- Talle: M</p>
              <p className="ml-6">- Color: Negro</p>
              <p className="ml-6">- Cantidad: 2</p>
              <p className="ml-6">- Precio: $XX.XX</p>
              <p className="font-semibold mt-2">Total: $XXX.XX</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
