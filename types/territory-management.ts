export interface ZonaItem {
  id: string;
  nombre: string;
  ciudades: string[];
  nombreCoordinador?: string | null;
}

export interface ComunidadItem {
  id: string;
  nombre: string;
  ciudad: string;
  correoElectronico: string;
  direccion?: string | null;
  telefono?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  zona: {
    id: string;
    nombre: string;
  };
}

export interface ZonaPayload {
  nombre: string;
  ciudades: string[];
  nombreCoordinador?: string;
}

export interface ComunidadPayload {
  nombre: string;
  ciudad: string;
  correoElectronico: string;
  direccion?: string;
  telefono?: string;
  latitud?: number;
  longitud?: number;
  zonaId: string;
}
