import React from "react";
import { createPortal } from "react-dom";
import "./ModalCerrarSesion.css";

interface ModalCerrarSesionProps {
  onCancel: () => void;
}

export default function ModalCerrarSesion({ onCancel }: ModalCerrarSesionProps) {
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    console.error("No se encontró el elemento #modal-root");
    return null;
  }

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-card">

        <h3 className="modal-titulo">
          ¿Estás seguro que quieres cerrar sesión?
        </h3>

        <div className="modal-botones">
          <button className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>

          <button className="btn-confirmar">
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>,
    modalRoot
  );
}
