import React, { useState } from "react";


const RegistroForm = () => {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    sexo: "",
    programa: "",
    dia: "",
    mes: "",
    anio: "",
    terminos: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, type } = e.target;

  const value =
    type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // Aquí iría la lógica de envío
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gradient-to-r from-pink-50 to-white relative">
      {/* Formulario */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 md:px-16">
        <div className="max-w-md w-full mx-auto">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Completa tu registro</h1>
          <p className="text-gray-600 mb-6">
            Cuéntanos un poco sobre ti para que podamos personalizar tu experiencia.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              placeholder="Ingresa tus nombres"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Ingresa tus apellidos"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            />
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value="">Selecciona tu género</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
            </select>
            <select
              name="programa"
              value={form.programa}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value="">Selecciona tu Programa Académico</option>
              <option value="ingenieria">Ingeniería</option>
              <option value="medicina">Medicina</option>
              <option value="arquitectura">Arquitectura</option>
            </select>

            {/* Fecha de nacimiento */}
            <div className="flex gap-2">
              <input
                type="text"
                name="dia"
                value={form.dia}
                onChange={handleChange}
                placeholder="DD"
                className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
              <input
                type="text"
                name="mes"
                value={form.mes}
                onChange={handleChange}
                placeholder="MM"
                className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
              <input
                type="text"
                name="anio"
                value={form.anio}
                onChange={handleChange}
                placeholder="AAAA"
                className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
                required
              />
            </div>

            {/* Términos */}
            <label className="flex items-center space-x-2 text-gray-600">
              <input
                type="checkbox"
                name="terminos"
                checked={form.terminos}
                onChange={handleChange}
                required
              />
              <span>He leído y acepto los Términos y Condiciones y la Política de Privacidad</span>
            </label>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>

      {/* Imagen de la derecha */}
      <div className="flex-1 hidden md:flex items-end justify-end relative">
        <img
          src="/registro-illustration.png"
          alt="Ilustración"
          className="w-[500px] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default RegistroForm;
