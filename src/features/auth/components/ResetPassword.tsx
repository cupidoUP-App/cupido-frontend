import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

const ResetPasswordView = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Estados para mostrar u ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Expresión regular para validar requisitos
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // Validar mientras el usuario escribe
    if (value.length === 0) {
      setPasswordError("");
      setIsValid(false);
      return;
    }

    if (!passwordRegex.test(value)) {
      setPasswordError(
        "Debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial."
      );
      setIsValid(false);
    } else {
      setPasswordError("");
      setIsValid(true);
    }

    // Si ya hay confirmación, verificar coincidencia
    if (confirmPassword && value !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden");
    } else {
      setConfirmError("");
    }
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);

    if (value.length === 0) {
      setConfirmError("");
      return;
    }

    if (value !== password) {
      setConfirmError("Las contraseñas no coinciden");
    } else {
      setConfirmError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Solo permitir envío si es válida y coincide
    if (isValid && password === confirmPassword) {
      console.log("Nueva contraseña:", password);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF0EC] relative overflow-hidden">
      {/* Fondos decorativos */}
      <img
        src="src/assets/image1-resetPassword.webp"
        alt="cupido_resetPassword"
        className="absolute bottom-0 right-0 w-40 sm:w-48 md:w-56 lg:w-64 h-auto opacity-80 select-none pointer-events-none"
      />
      <img
        src="src/assets/image2-resetPassword.webp"
        alt="cupido_resetPassword-2"
        className="absolute top-0 left-0 w-40 sm:w-48 md:w-56 lg:w-64 h-auto opacity-80 select-none pointer-events-none"
      />

      {/* Contenedor del formulario */}
      <div className="relative bg-[#FCE3DC] rounded-3xl shadow-lg p-10 w-[400px] font-[Poppins]">
        {/* Botones de navegación */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-gray-800"
          >
            <X />
          </button>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-6">
          <img
            src="src/assets/logo-login.webp"
            alt="Logo Cupido"
            className="mx-auto w-21 h-20 mb-3"
          />
          <h1 className="text-xl font-semibold text-gray-800">
            Restablecer Contraseña
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Ingresa tu nueva contraseña. Asegúrate de cumplir con los
            requisitos de seguridad.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nueva contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className={`mt-1 bg-white pr-10 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ?  <Eye size={18} />: <EyeOff size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirmar nueva contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                className={`mt-1 bg-white pr-10 ${
                  confirmError ? "border-red-500" : "border-gray-300"
                }`}
                value={confirmPassword}
                onChange={(e) => handleConfirmChange(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {confirmError && (
              <p className="text-xs text-red-500 mt-1">{confirmError}</p>
            )}
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            onClick={() => navigate("/")}
            disabled={!isValid || confirmError.length > 0}
            className="w-full bg-[#FF5733] text-white font-Poppins rounded-lg py-2 mt-8 transition-colors"
          >
            Actualizar contraseña
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          La contraseña debe tener al menos 8 caracteres, incluir una mayúscula,
          un número y un símbolo especial.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordView;
