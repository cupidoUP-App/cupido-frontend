import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import Opciones from "./Opciones";
import NotificationsPage from "../../notifications/components/notificationsPage"; 
import { useNotification } from "../../notifications/hooks/useNotification";


interface SidebarProps {
  abrirModalCerrar: () => void;
  userId: string;
}

export default function Sidebar({ abrirModalCerrar, userId }: SidebarProps) {
  const [openOpciones, setOpenOpciones] = useState<boolean>(false);
  const [openNotificaciones, setOpenNotificaciones] = useState(false);
  const { notifications } = useNotification(userId);
  const unreadCount = notifications.filter(n => !n.read).length;

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
        {/*
        <div className="item disabled" title="Próximamente">
         <img 
          src="https://i.postimg.cc/Y9FKhwvs/notificaciones.png" 
           alt="Notificaciones"
           />
        </div>
        */}

        <button
        className="item"
        onClick={() => setOpenNotificaciones(true)}
        style={{ background: "none", border: "none", padding: 0, position: "relative" }}
        >
          <img 
          src="https://i.postimg.cc/Y9FKhwvs/notificaciones.png" 
          alt="Notificaciones" 
          className="item" 
        />
        
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        </button>


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

      {openNotificaciones && (
      <div className="overlay-notifs">
        <div className="notifs-wrapper">
          <NotificationsPage 
            userId={userId}
            onClose={() => setOpenNotificaciones(false)} // Añadimos prop para cerrar
          />
        </div>
    
  </div>
)}

    </div>
  );
}
