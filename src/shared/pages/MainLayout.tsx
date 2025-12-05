import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@sidebar/components/Sidebar";
import ModalCerrarSesion from "@sidebar/components/ModalCerrarSesion";


const MainLayout = () => {
  const [modalCerrar, setModalCerrar] = useState(false);

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar solo se muestra aquí */}
      <Sidebar abrirModalCerrar={() => setModalCerrar(true)} userId="ID_DEL_USUARIO" />

      {/* Contenido principal */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      {/* Modal */}
      {modalCerrar && (
        <ModalCerrarSesion onCancel={() => setModalCerrar(false)} />
      )}
    </div>
  );
};

export default MainLayout;
