import React from 'react';

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  isOpen,
  onClose,
  onAccept,
  onReject
}) => {
  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  const handleReject = () => {
    onReject();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Términos y Condiciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold mb-4">1. Aceptación de los Términos</h3>
            <p className="mb-4">
              Al registrarte en CUPIDO, aceptas cumplir y estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar nuestros servicios.
            </p>

            <h3 className="text-xl font-semibold mb-4">2. Uso del Servicio</h3>
            <p className="mb-4">
              CUPIDO es una plataforma diseñada exclusivamente para la comunidad universitaria de la 
              Universidad de Pamplona. El uso del servicio está restringido a estudiantes, profesores 
              y personal administrativo con correo institucional @unipamplona.edu.co.
            </p>

            <h3 className="text-xl font-semibold mb-4">3. Cuenta de Usuario</h3>
            <p className="mb-4">
              Debes proporcionar información precisa y completa durante el registro. Eres responsable 
              de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran 
              bajo tu cuenta.
            </p>

            <h3 className="text-xl font-semibold mb-4">4. Conducta del Usuario</h3>
            <p className="mb-4">
              Te comprometes a utilizar el servicio de manera respetuosa y ética. No está permitido:
            </p>
            <ul className="list-disc list-inside mb-4 ml-4">
              <li>Publicar contenido ofensivo, discriminatorio o inapropiado</li>
              <li>Suplantar la identidad de otras personas</li>
              <li>Realizar acoso o comportamiento inapropiado</li>
              <li>Compartir información personal de otros usuarios sin consentimiento</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">5. Privacidad y Datos</h3>
            <p className="mb-4">
              Respetamos tu privacidad y protegemos tus datos personales. Tu información será utilizada 
              únicamente para los fines del servicio y no será compartida con terceros sin tu 
              consentimiento, excepto cuando sea requerido por ley.
            </p>

            <h3 className="text-xl font-semibold mb-4">6. Propiedad Intelectual</h3>
            <p className="mb-4">
              Todo el contenido de CUPIDO, incluyendo logotipos, diseño y software, es propiedad de 
              la plataforma y está protegido por las leyes de propiedad intelectual.
            </p>

            <h3 className="text-xl font-semibold mb-4">7. Limitación de Responsabilidad</h3>
            <p className="mb-4">
              CUPIDO no se hace responsable por las interacciones entre usuarios. Es tu responsabilidad 
              ejercer criterio y precaución al interactuar con otros miembros de la comunidad.
            </p>

            <h3 className="text-xl font-semibold mb-4">8. Modificaciones</h3>
            <p className="mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Las 
              modificaciones serán notificadas a los usuarios y el uso continuado del servicio 
              constituye la aceptación de los nuevos términos.
            </p>

            <h3 className="text-xl font-semibold mb-4">9. Terminación</h3>
            <p className="mb-4">
              Podemos suspender o terminar tu acceso al servicio si violas estos términos y condiciones 
              o realizas actividades que consideremos inapropiadas.
            </p>

            <h3 className="text-xl font-semibold mb-4">10. Ley Aplicable</h3>
            <p className="mb-4">
              Estos términos se rigen por las leyes de Colombia. Cualquier disputa será resuelta en 
              los tribunales competentes de la ciudad de Pamplona.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-yellow-800 text-sm">
                <strong>Nota importante:</strong> Al hacer clic en "Aceptar", confirmas que has leído, 
                comprendido y aceptas todos los términos y condiciones mencionados anteriormente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReject}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2 bg-[#E93923] text-white rounded-lg hover:bg-[#d1321f] transition duration-200 font-medium"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;