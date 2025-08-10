import React, { useState, useEffect } from "react";
import { Phone, Clock, Package, Calendar, Navigation, MapPin, Calculator, ExternalLink } from "lucide-react";
import VisitorCounter from "./VisitCounter";

// 💸 Tarifas actualizadas
const tarifaBaseMedellin = 60000;
const tarifaPorKm = 1800; // Actualizada
const recargoNocturno = 10000;
const recargoPor20Kg = 20000;
const rutaFijaGuarneMedellin = 60000; // Actualizada

export default function CalculadoraDomicilio() {
  const [kilometraje, setKilometraje] = useState(0);
  const [enlaceRuta, setEnlaceRuta] = useState("");
  const [hora, setHora] = useState(12);
  const [periodo, setPeriodo] = useState("PM");
  const [peso, setPeso] = useState(20);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [precio, setPrecio] = useState(0);
  const [usarRutaFija, setUsarRutaFija] = useState(false);

  // Abrir Google Maps para planificar ruta
  const abrirGoogleMaps = () => {
    const url = "https://maps.google.com/";
    window.open(url, "_blank");
  };

  // Calcular precio basado en reglas
  const calcularPrecio = (km) => {
    // Si es ruta fija Guarne-Medellín
    if (usarRutaFija) {
      setPrecio(rutaFijaGuarneMedellin);
      return;
    }
    
    if (km <= 0) {
      setPrecio(0);
      return;
    }
    
    let total = 0;
    const hora24 = periodo === "AM" ? (hora === 12 ? 0 : hora) : (hora === 12 ? 12 : hora + 12);

    if (km >= 35 && km <= 45 && peso <= 20) {
      total = tarifaBaseMedellin;
    } else {
      total = km * tarifaPorKm;
      if (hora24 < 6 || hora24 > 20) total += recargoNocturno;
      
      // Nuevo cálculo por peso: cada 20 kilos adicionales después del primer grupo de 20kg
      if (peso > 20) {
        const gruposAdicionales = Math.floor((peso - 20) / 20);
        total += gruposAdicionales * recargoPor20Kg;
      }
    }

    setPrecio(Math.round(total));
  };

  // Recalcular cuando cambian los parámetros
  useEffect(() => {
    if (usarRutaFija) {
      calcularPrecio(0); // No importa la distancia para ruta fija
    } else {
      calcularPrecio(kilometraje);
    }
  }, [kilometraje, hora, periodo, peso, usarRutaFija]);

  // Generar enlace de WhatsApp
  const generarMensajeWhatsApp = () => {
    const horaFormateada = `${hora}:00 ${periodo}`;
    
    let mensaje;
    if (usarRutaFija) {
      mensaje = `🚚 *Solicitud de Domicilio*

📍 *Ruta:* Guarne ↔ Medellín (Ruta Fija)
🕐 *Hora:* ${horaFormateada}
📅 *Fecha:* ${new Date(fecha).toLocaleDateString('es-CO')}
📦 *Peso:* ${peso} kg
💰 *Precio:* ${precio.toLocaleString()} COP

¡Hola! Estoy interesado en el servicio de domicilio para la ruta fija.`;
    } else {
      mensaje = `🚚 *Solicitud de Domicilio*

🕐 *Hora:* ${horaFormateada}
📅 *Fecha:* ${new Date(fecha).toLocaleDateString('es-CO')}
📦 *Peso:* ${peso} kg
📏 *Distancia:* ${kilometraje} km
💰 *Precio estimado:* ${precio.toLocaleString()} COP
${enlaceRuta ? `\n🗺️ *Ruta en Google Maps:*\n${enlaceRuta}` : ''}

¡Hola! Estoy interesado en este servicio de domicilio.`;
    }

    const url = `https://wa.me/573007756101?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  const puedeCalcular = usarRutaFija || kilometraje > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Navigation className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Calculadora de Domicilios</h1>
          </div>
          <p className="text-gray-600 text-lg">Planifica tu ruta y calcula el precio de tu envío</p>
        </div>
        <VisitorCounter />

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          
          {/* Ruta Fija Guarne-Medellín */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="rutaFija"
                checked={usarRutaFija}
                onChange={(e) => {
                  setUsarRutaFija(e.target.checked);
                  if (e.target.checked) {
                    setKilometraje(0);
                    setEnlaceRuta("");
                  }
                }}
                className="mt-1 h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="rutaFija" className="text-lg font-semibold text-green-800 cursor-pointer flex items-center gap-2">
                  🚚 Ruta Fija: Guarne ↔ Medellín
                </label>
                <p className="text-green-700 mt-2">
                  Precio fijo: <strong className="text-2xl">${rutaFijaGuarneMedellin.toLocaleString()} COP</strong>
                </p>
                <p className="text-sm text-green-600 mt-1">
                  ✓ Este precio cambiaria si hay una carga adicional por peso o si se aplica recargo nocturno.
                </p>
              </div>
            </div>
          </div>

          {/* Solo mostrar campos de planificación si no es ruta fija */}
          {!usarRutaFija && (
            <>
              {/* Planificación de ruta */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Planifica tu Ruta
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2 text-blue-700">
                    <p><strong>1.</strong> Haz clic en el botón para abrir Google Maps</p>
                    <p><strong>2.</strong> Planifica la ruta desde tu origen hasta el destino</p>
                    <p><strong>3.</strong> Anota el kilometraje que te muestra Google Maps</p>
                    <p><strong>4.</strong> Ingresa el kilometraje en el campo de abajo</p>
                    <p><strong>5.</strong> Copia el enlace de la ruta y pégalo en el campo correspondiente</p>
                  </div>
                  
                  <button
                    onClick={abrirGoogleMaps}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors duration-200"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Abrir Google Maps para Planificar Ruta
                  </button>
                </div>
              </div>

              {/* Campo para enlace de la ruta */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                  Enlace de la Ruta (Para el domiciliario)
                </label>
                
                <div className="relative">
                  <input
                    type="url"
                    value={enlaceRuta}
                    onChange={(e) => setEnlaceRuta(e.target.value)}
                    placeholder="Pega aquí el enlace de Google Maps de tu ruta..."
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                  />
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-purple-700 text-sm">
                    💡 <strong>Tip:</strong> En Google Maps, después de planificar tu ruta, toca "Compartir" y copia el enlace
                  </p>
                </div>
              </div>

              {/* Campo manual para kilometraje */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Kilometraje de la Ruta
                </label>
                
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="500"
                    value={kilometraje || ''}
                    onChange={(e) => setKilometraje(parseFloat(e.target.value) || 0)}
                    placeholder="Ingresa el kilometraje en km (Ej: 15.5)"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    km
                  </div>
                </div>

                {kilometraje > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Distancia confirmada: {kilometraje} km ✓</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Detalles del envío */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hora */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <Clock className="w-5 h-5 text-blue-600" />
                Hora del Envío
              </label>
              <div className="flex gap-2">
                <select
                  value={hora}
                  onChange={(e) => setHora(Number(e.target.value))}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  className="p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Peso */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <Package className="w-5 h-5 text-orange-600" />
                Peso (kg)
              </label>
              <input
                type="number"
                value={peso}
                min={1}
                max={500}
                step={1}
                onChange={(e) => setPeso(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                disabled={usarRutaFija}
              />
              {!usarRutaFija && (
                <p className="text-xs text-gray-500">
                  Cada 20kg adicionales: +${recargoPor20Kg.toLocaleString()}
                </p>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <Calendar className="w-5 h-5 text-purple-600" />
                Fecha del Servicio
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Información de tarifas */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Información de Tarifas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Costo por km: ${tarifaPorKm.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Recargo nocturno: ${recargoNocturno.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Cada 20kg adicionales: ${recargoPor20Kg.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Tarifa base de Guarne ↔ Medellín: ${tarifaBaseMedellin.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ <strong>Recargo nocturno:</strong> Se aplica desde las 8:01 PM hasta las 5:59 AM
              </p>
            </div>
          </div>

          {/* Resultado */}
          {puedeCalcular && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 text-center">
              <div className="space-y-2">
                {usarRutaFija ? (
                  <>
                    <div className="text-lg text-gray-600">
                      Ruta: <span className="font-semibold text-green-600">Guarne ↔ Medellín</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${precio.toLocaleString()} COP
                    </div>
                    <div className="text-gray-500">Precio fijo</div>
                  </>
                ) : (
                  <>
                    <div className="text-lg text-gray-600">
                      Distancia: <span className="font-semibold text-blue-600">{kilometraje} km</span>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      ${precio.toLocaleString()} COP
                    </div>
                    <div className="text-gray-500">Precio estimado</div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Botón WhatsApp */}
          <button
            onClick={generarMensajeWhatsApp}
            disabled={!puedeCalcular}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold text-lg flex justify-center items-center gap-3 transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
          >
            <Phone className="w-6 h-6" />
            {puedeCalcular ? "Contactar por WhatsApp" : "Ingresa el kilometraje para continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}