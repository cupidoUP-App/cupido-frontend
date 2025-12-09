import React from "react";
import { createPortal } from "react-dom";
import "./ModalCerrarSesion.css";
import { useAppStore } from "@store/appStore";
import { useNavigate } from "react-router-dom";

interface ModalCerrarSesionProps {
  onCancel: () => void;
}

export default function ModalCerrarSesion({ onCancel }: ModalCerrarSesionProps) {
  const modalRoot = document.getElementById("modal-root");
  const { logout } = useAppStore();
  const navigate = useNavigate(); 

  if (!modalRoot) {
    return null;
  }

  const handleLogout = () => {
    logout();     
    onCancel();   
    navigate("/"); 
  };

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

          <button className="btn-confirmar" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>

      </div>
    </div>,
    modalRoot
  );
}
