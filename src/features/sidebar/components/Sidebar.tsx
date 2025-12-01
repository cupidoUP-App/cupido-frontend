import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import Opciones from "./Opciones";

interface SidebarProps {
  abrirModalCerrar: () => void;
}

export default function Sidebar({ abrirModalCerrar }: SidebarProps) {
  const [openOpciones, setOpenOpciones] = useState<boolean>(false);

  return (
    <div className="sidebar">
      
      {/* logo */}
      <div className="logo-area">
      <img 
        src="https://i.postimg.cc/nVsfPBTk/Logo.png" 
        alt="Cupido Logo" 
        className="logo" 
      />
      </div>

      {/* menu */}
      <nav className="menu">

        <NavLink to="/match" className="item">
        <img 
        src="https://i.postimg.cc/7LDxvhhQ/home.png" 
        alt="home (match)" 
        className="item" 
        />
        </NavLink>

        <NavLink to="/test-chat" className="item">
        <img 
        src="https://i.postimg.cc/dQdw0GdL/chat.png" 
        alt="chat" 
        className="item" 
        />
        </NavLink>

        {/*
        <NavLink to="/notificaciones" className="item">
        <img 
        src="https://i.postimg.cc/Y9FKhwvs/notificaciones.png" 
        alt="Notificaciones" 
        className="item" 
        />
        </NavLink>
        */}

        <div className="item disabled" title="Próximamente">
         <img 
          src="https://i.postimg.cc/Y9FKhwvs/notificaciones.png" 
           alt="Notificaciones"
           />
        </div>


        <NavLink to="/profile" className="item">
        <img 
        src="https://i.postimg.cc/c1ckTHGB/perfil.png" 
        alt="perfil" 
        className="item" 
        />
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
         <img 
        src="https://i.postimg.cc/TwfqWVwN/opciones.png" 
        alt="opciones" 
        className="item" 
        />
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
