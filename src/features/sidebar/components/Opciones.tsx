import React, { useRef, useEffect } from "react";
import "./Opciones.css";

interface OpcionesProps {
  onClose: () => void;
  abrirModalCerrar: () => void;
}

export default function Opciones({ onClose, abrirModalCerrar }: OpcionesProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="opciones-menu" ref={menuRef}>
      <button
        className="opcion-item"
        onClick={() => {
          abrirModalCerrar();
          onClose();
        }}
      >
        Cerrar Sesion
      </button>

      <hr className="linea-separadora" />

      <button className="opcion-item opcion-desactivada" disabled>
        Bloquear Cuenta
      </button>
    </div>
  );
}
