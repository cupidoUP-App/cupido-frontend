import React, { useState } from 'react';
import { useToast } from "@hooks/use-toast";
import { useAppStore } from '@store/appStore';

const reportReasons = [
    'Spam o contenido no deseado',
    'Comportamiento inapropiado',
    'Perfil falso',
    'Odio y acoso',
    'Fraudes y estafas',
    'Información errónea',
    'Suicidio y autolesión',
    'Actividades y desafíos peligrosos',
    'Divulgación de datos personales',
    'Productos o servicios peligrosos',
    'Otro'
];

interface ReportsFormProps {
    onClose: () => void;
    reportedUserId: number;
}

const ReportsForm: React.FC<ReportsFormProps> = ({ onClose, reportedUserId }) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [additionalDetails, setAdditionalDetails] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { submitReport } = useAppStore();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Validaciones básicas
        if (!selectedReason.trim()) {
            toast({
                title: "Campo requerido",
                description: "Por favor selecciona una razón para el reporte",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            await submitReport({ 
                reason: selectedReason, 
                details: additionalDetails,
                reported_user_id: reportedUserId, 
            });
            
            toast({
                title: "Reporte enviado",
                description: "Gracias por ayudarnos a mantener la comunidad segura.",
            });
            
            // Reset form
            setSelectedReason('');
            setAdditionalDetails('');
            onClose();
            
        } catch (error: any) {
            console.error("Error al enviar reporte:", error);
            
            let errorMessage = "No pudimos enviar tu reporte. Intenta de nuevo.";
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.reason) {
                errorMessage = Array.isArray(error.response.data.reason)
                    ? error.response.data.reason[0]
                    : error.response.data.reason;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: "Error al enviar reporte",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedReason('');
        setAdditionalDetails('');
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="w-[439px] h-[680px] bg-[#F2D6CD] rounded-[40px] shadow-[2px_6px_4px_0px_rgba(0,0,0,0.35)] relative overflow-hidden">
                    {/* Botón de cerrar */}
                    <button
                        onClick={handleCancel}
                        className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 p-1 rounded-full hover:bg-rose-300 transition-colors z-10"
                        aria-label="Cerrar formulario"
                        disabled={isSubmitting}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="h-full flex flex-col p-6">
                        {/* Header */}
                        <div className="flex justify-center mb-6">
                            <img
                                src="src/assets/logo-login.webp"
                                alt="CUPIDO Logo"
                                className="w-[87px] h-[80px]"
                            />
                        </div>

                        <div className="mb-6 text-center">
                            <div className="text-black text-2xl font-medium font-['Poppins']">
                                Reportar usuario
                            </div>

                            <div className="text-black text-1xl font-normal font-['Poppins'] mt-2">
                                Ayudanos a mantener nuestra comunidad segura. Indica el motivo de tu reporte.
                            </div>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex-1 flex flex-col justify-between"
                        >
                            <div className="space-y-6">
                                {/* Campo de razón del reporte */}
                                <div className="space-y-2">
                                    <label className="block text-black text-sm font-medium font-['Poppins'] mb-2">
                                        Motivo del reporte
                                    </label>
                                    <select
                                        value={selectedReason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 bg-white border border-rose-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                                    >
                                        <option value="">Selecciona una razón</option>
                                        {reportReasons.map((reason) => (
                                            <option key={reason} value={reason}>
                                                {reason}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Campo de descripción adicional */}
                                <div className="space-y-2">
                                    <label className="block text-black text-sm font-medium font-['Poppins'] mb-2">
                                        Descripción adicional (opcional)
                                    </label>
                                    <textarea
                                        value={additionalDetails}
                                        onChange={(e) => setAdditionalDetails(e.target.value)}
                                        placeholder="Describe brevemente lo ocurrido"
                                        rows={4}
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 bg-white border border-rose-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E93923] focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col space-y-3 pt-6">
                                <button
                                    type="submit"
                                    disabled={!selectedReason || isSubmitting}
                                    className="w-full bg-[#E93923] hover:bg-[#d1321f] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? 'Enviando reporte...' : 'Enviar Reporte'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="w-full bg-transparent hover:bg-rose-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-700 font-semibold py-2.5 px-6 rounded-lg transition duration-200 text-sm border border-rose-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ReportsForm;