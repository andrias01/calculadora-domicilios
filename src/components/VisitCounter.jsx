import { useEffect, useState } from "react";
import { Eye, Loader2 } from "lucide-react";

const ActualizarVisitas = () => {
  const [visitas, setVisitas] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://ybywclqkltcivpcbmrtg.supabase.co/rest/v1/visitas";
  const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieXdjbHFrbHRjaXZwY2JtcnRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDcxMTgxNSwiZXhwIjoyMDcwMjg3ODE1fQ.-RaMogdxPiyBVlbTRazKp9fzA-7kLN23-nZAoWQYZVU";

  const fetchAndUpdate = async () => {
    try {
      // 1️⃣ Obtener el registro con id = 1
      const response = await fetch(`${API_URL}?select=id,cantidad_visitas&id=eq.1`, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.length === 0) {
        console.log("No se encontró el registro con id=1.");
        return;
      }

      const visita = data[0];
      const cantidadActual = parseInt(visita.cantidad_visitas || "0", 10);
      const nuevaCantidad = cantidadActual + 1;

      // 2️⃣ Actualizar solo ese registro
      await fetch(`${API_URL}?id=eq.1`, {
        method: 'PATCH',
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cantidad_visitas: nuevaCantidad.toString() })
      });

      // 3️⃣ Guardar en estado para mostrar en pantalla
      setVisitas(nuevaCantidad);
      // console.log(`Visita con id 1 actualizada a ${nuevaCantidad}`);
      console.log("Gracias por visitar mi web!");
      console.log("Gracias por encontrar este log secreto :)");
      console.log("Si encuentras este mensaje, eres una persona curiosa y genial! escribeme a la whatsapp https://wa.me/573007756101");
      console.log("¡Que tengas un día maravilloso!");
      console.log("🚀✨🌟");
      console.log("Personas que encontraron este mensaje: 1");
      console.log("1. Sebastian Hincapie");
      console.log("2. Juan Avendaño");
    } catch (error) {
      console.error("Error actualizando visitas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndUpdate();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 max-w-sm mx-auto border border-blue-100">
        {/* Header con icono */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Contador de Visitas
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            En tiempo real con Supabase
          </p>
        </div>

        {/* Área del contador - skeleton */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-300 mb-2 animate-pulse">
              --
            </div>
            <div className="text-gray-400">
              Cargando...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 max-w-sm mx-auto border border-blue-100">
      {/* Header con icono */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
          <Eye className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">
          Contador de Visitas
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          En tiempo real con Supabase
        </p>
      </div>

      {/* Contador principal */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {visitas}
          </div>
          <div className="text-gray-600 font-medium">
            Visitas totales
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActualizarVisitas;