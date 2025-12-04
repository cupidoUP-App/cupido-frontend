import React, { useState } from 'react';

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (firma: string) => void;
  onReject: () => void;
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  isOpen,
  onClose,
  onAccept,
  onReject
}) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept(inputValue);
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
          <h2 className="text-2xl font-bold text-gray-900">ADVERTENCIA Y AUTORIZACIÓN DE TRATAMIENTO DE
            DATOS PERSONALES – CUPIDO</h2>
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
            {/*<h3 className="text-xl font-semibold mb-4">1. Aceptación de los Términos</h3>*/}
            <p className="mb-4">
              El software CUPIDO, en cumplimiento de la Ley 1581 de 2012, el Decreto 1377 de 2013,
              la Ley 2300 de 2023, la Circular Externa 002 de 2024 de la Superintendencia de Industria y
              Comercio (SIC) y la  <a className='font-bold' href="https://drive.google.com/file/d/1HJxuJaxnaDsad_JhiaZdMC6oUl_vgfwD/view?usp=drive_link">Política de Tratamiento, Autorización y Protección de Datos
                Personales del software CUPIDO,</a>informa que los datos personales que usted suministre
              serán recolectados, almacenados, usados y tratados exclusivamente para las siguientes
              finalidades: permitir su registro, autenticación y participación en la plataforma; facilitar la
              interacción social y académica dentro de un entorno universitario seguro; promover el uso
              ético y responsable de la información digital; generar estadísticas y estudios académicos de
              forma anónima y confidencial; y fortalecer las estrategias de bienestar, convivencia y salud
              emocional de la comunidad universitaria.
            </p>
            <p className="mb-4">
              Las siguientes acciones están estrictamente prohibidas dentro del uso del software
              CUPIDO:
            </p>

            <ol className="list-decimal list-inside mb-4 ml-4">
              <li>Compartir, solicitar o divulgar información sensible, íntima, privada o que
                comprometa la seguridad propia o de terceros.</li>
              <li>Utilizar la plataforma para acosar, amenazar, discriminar, suplantar identidad o
                realizar conductas inapropiadas, ofensivas o contrarias a la ley o a los principios
                institucionales.</li>
              <li>Recoger, almacenar, copiar o difundir datos personales de otros usuarios sin
                autorización expresa, así como usar la información con fines comerciales,
                publicitarios o ajenos al propósito académico del proyecto.</li>
            </ol>


            <p className="mb-4">
              En ningún caso <b>CUPIDO</b> venderá, transferirá o compartirá sus datos personales con fines
              comerciales o publicitarios. La plataforma garantiza la confidencialidad y protección de su
              información mediante medidas técnicas, humanas y administrativas adecuadas.
            </p>

            <h2 className="text-xl font-bold text-gray-800">ADVERTENCIA PREVIA SOBRE EL USO DEL CHAT Y RESPONSABILIDAD
              COMPARTIDA</h2>
            <p className="mb-4">
              Antes de continuar, CUPIDO advierte expresamente que para el uso del chat en el Software
              se recomienda precaución, sentido común, autocuidado y evaluación consciente del tipo de
              información que se comparte. CUPIDO no se hace responsable por la información privada,
              contenidos íntimos, datos sensibles o detalles personales que los usuarios decidan compartir
              voluntariamente con otros usuarios dentro de la plataforma. Dicha divulgación constituye
              un acto autónomo del titular, y como tal excede el control técnico y jurídico de CUPIDO.
              Esta advertencia se fundamenta en el principio de autonomía de la voluntad, la
              corresponsabilidad digital y la doctrina del control individual de los datos personales.
            </p>

            <p className="mb-4">
              Usted tiene derecho a conocer, actualizar, rectificar o eliminar sus datos personales, así
              como a revocar esta autorización en cualquier momento, conforme a los procedimientos
              establecidos en la <a className='font-bold' href="https://drive.google.com/file/d/1HJxuJaxnaDsad_JhiaZdMC6oUl_vgfwD/view?usp=drive_link">Política de Tratamiento, Autorización y Protección de Datos
                Personales del software CUPIDO.</a>
            </p>

            <p className="mb-4">
              Para ejercer sus derechos, puede comunicarse con Protección de Datos Personales de
              CUPIDO al correo: <a className='font-bold text-blue-500' href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=habeasdata@cupidocol.com">habeasdata@cupidocol.com</a>
            </p>

            <p className="mb-4">
              ∆ Al hacer clic en <b>"ACEPTO"</b>, usted declara que ha leído y comprendido esta advertencia y
              autoriza de manera libre, previa, expresa e informada el tratamiento de sus datos personales
              para las finalidades aquí señaladas junto con la Política de Tratamiento, Autorización y
              Protección de Datos Personales del software CUPIDO.
            </p>

            <p className="mb-4">
              ∆ Si selecciona <b>"RECHAZO"</b>, la plataforma no podrá registrar ni procesar su información
              personal, lo cual impedirá su participación activa en CUPIDO.
            </p>

            <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6'>
              <p className="text-yellow-800 text-sm font-semibold">
                Asegúrate de leer la <a className='text-blue-500' href="https://drive.google.com/file/d/1HJxuJaxnaDsad_JhiaZdMC6oUl_vgfwD/view?usp=drive_link">Política de Tratamiento, Autorización y Protección de Datos Personales del software CUPIDO.</a> antes de continuar.
              </p>
            </div>

            <div className="mb-4 mt-6">
              <label htmlFor="terms-input" className="flex justify-center items-center block text-sm font-medium text-gray-700 mb-6">
                Si estas de acuerdo, escribe tu firma (3-8 caracteres):
              </label>
              <input
                id="terms-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                minLength={3}
                maxLength={8}
                className="w-full px-3 py-2 flex border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent"
                placeholder="Firma"
              />
            </div>

          </div>
        </div>

        {/* Footer with Input and Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 ">
          <div className="flex justify-between">
            <div className="flex justify-initial space-x-4">
              <button
                onClick={handleReject}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
              >
                Rechazo
              </button>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleAccept}
                disabled={inputValue.length < 3 || inputValue.length > 8}
                className="px-6 py-2 bg-[#E93923] text-white rounded-lg hover:bg-[#d1321f] transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Acepto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;