"use client";

import dynamic from "next/dynamic";
import type { PdfReaderProps } from "./PdfReader";

// pdf.js pesa: solo se descarga al abrir el lector y nunca se renderiza en el servidor.
// Mientras llega, se ve el esqueleto que la página pinta desde el servidor.
const PdfReader = dynamic(() => import("./PdfReader"), { ssr: false, loading: () => null });

export default function ReaderLoader(props: PdfReaderProps) {
  return <PdfReader {...props} />;
}
