// src/hooks/types.ts
export interface Message {
    id: number;
    contenido: string;
    remitente_email: string;
    es_mio: boolean; // Calculado por el Backend
    fecha: string;
    leido: boolean;
    estado?: MessageStatus;
}

export type MessageStatus = 
    | 'sending' 
    | 'sent' 
    | 'delivered' 
    | 'read' 
    | 'failed';