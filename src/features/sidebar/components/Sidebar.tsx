import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import Opciones from "./Opciones";

// === IMPORTACIÓN DE IMÁGENES DESDE /assets ===
import logoImg from "@assets/logo.png";
import homeImg from "@assets/home.png";
import chatImg from "@assets/chat.png";
import notificacionesImg from "@assets/notificaciones.png";
import perfilImg from "@assets/perfil.png";
import opcionesImg from "@assets/opciones.png";

interface SidebarProps {
  abrirModalCerrar: () => void;
}

export default function Sidebar({ abrirModalCerrar }: SidebarProps) {
  const [openOpciones, setOpenOpciones] = useState<boolean>(false);

  return (
    <div className="sidebar">
      
      {/* logo */}
      <div className="logo-area">
        <img src={logoImg} alt="Cupido Logo" className="logo" />
      </div>

      {/* menu */}
      <nav className="menu">

        <NavLink to="/match" className="item">
          <img src={homeImg} alt="Home" />
        </NavLink>

        <NavLink to="/chat" className="item">
          <img src={chatImg} alt="Chat" />
        </NavLink>

        <NavLink to="/notificaciones" className="item">
          <img src={notificacionesImg} alt="Notificaciones" />
        </NavLink>

        <NavLink to="/profile" className="item">
          <img src={perfilImg} alt="Perfil" />
        </NavLink>

      </nav>

      {/* opciones (configuraciones) */}
      <div className="bottom-menu">
        <button
          className="item"
          onClick={() => setOpenOpciones(!openOpciones)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img src={opcionesImg} alt="Opciones" />
        </button>
      </div>

      {/* popover opciones */}
      {openOpciones && (
        <Opciones
          onClose={() => setOpenOpciones(false)}
          abrirModalCerrar={abrirModalCerrar}
        />
      )}
    </div>
  );
}
