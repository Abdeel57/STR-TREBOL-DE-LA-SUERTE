/**
 * Utilidades para formatear y validar números de teléfono mexicanos
 * México usa 10 dígitos locales + código de país 52 = 12 dígitos para WhatsApp
 */

/**
 * Normaliza un número de teléfono para México
 * Formato requerido por WhatsApp: 52XXXXXXXXXX (código de país + 10 dígitos, sin +)
 * 
 * @param phone - Número de teléfono en cualquier formato
 * @returns Número normalizado para WhatsApp (ej: 521234567890) o cadena vacía si no es válido
 */
export const formatPhoneNumberForMexico = (phone?: string): string => {
    if (!phone) return '';
    
    // Remover todos los caracteres no numéricos (espacios, guiones, paréntesis, +, etc.)
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Si no hay dígitos, retornar vacío
    if (!digitsOnly) return '';
    
    // Código de país de México
    const countryCode = '52';
    
    // Casos posibles:
    // 1. Número local de 10 dígitos (ej: 1234567890) → Agregar 52
    if (digitsOnly.length === 10) {
        return `${countryCode}${digitsOnly}`;
    }
    
    // 2. Número con código de país al inicio (ej: 521234567890 o 521234567890)
    if (digitsOnly.startsWith(countryCode) && digitsOnly.length === 12) {
        return digitsOnly; // Ya tiene el formato correcto
    }
    
    // 3. Número con código de país pero con formato diferente (ej: 0052, +52, etc.)
    if (digitsOnly.length > 10) {
        // Buscar si termina con 10 dígitos (asumir que los últimos 10 son el número local)
        const last10 = digitsOnly.slice(-10);
        if (last10.length === 10) {
            return `${countryCode}${last10}`;
        }
    }
    
    // 4. Si tiene menos de 10 dígitos, no es válido
    if (digitsOnly.length < 10) {
        console.warn('Número de teléfono muy corto para México:', phone);
        return '';
    }
    
    // 5. Por defecto, si tiene 10+ dígitos, usar los últimos 10 y agregar código de país
    const last10Digits = digitsOnly.slice(-10);
    return `${countryCode}${last10Digits}`;
};

/**
 * Valida si un número de teléfono mexicano es válido (10 dígitos)
 * 
 * @param phone - Número de teléfono a validar
 * @returns true si es válido, false en caso contrario
 */
export const isValidMexicanPhone = (phone?: string): boolean => {
    if (!phone) return false;
    const digitsOnly = phone.replace(/\D/g, '');
    // Debe tener exactamente 10 dígitos (número local) o 12 dígitos (con código de país)
    return digitsOnly.length === 10 || (digitsOnly.length === 12 && digitsOnly.startsWith('52'));
};

/**
 * Formatea un número de teléfono para mostrar (formato legible)
 * Ejemplo: 1234567890 → (12) 3456-7890
 * 
 * @param phone - Número de teléfono
 * @returns Número formateado para mostrar
 */
export const formatPhoneForDisplay = (phone?: string): string => {
    if (!phone) return '';
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Si tiene 10 dígitos, formatear como (XX) XXXX-XXXX
    if (digitsOnly.length === 10) {
        return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2, 6)}-${digitsOnly.slice(6)}`;
    }
    
    // Si tiene 12 dígitos (con código de país), mostrar solo los últimos 10 formateados
    if (digitsOnly.length === 12 && digitsOnly.startsWith('52')) {
        const localNumber = digitsOnly.slice(2);
        return `(${localNumber.slice(0, 2)}) ${localNumber.slice(2, 6)}-${localNumber.slice(6)}`;
    }
    
    // Si no coincide con ningún formato, devolver tal cual
    return phone;
};

/**
 * Genera un enlace de WhatsApp para un número de teléfono mexicano
 * 
 * @param phone - Número de teléfono
 * @param message - Mensaje opcional a incluir
 * @returns URL de WhatsApp o cadena vacía si el número no es válido
 */
export const generateWhatsAppLink = (phone?: string, message?: string): string => {
    const formattedPhone = formatPhoneNumberForMexico(phone);
    if (!formattedPhone) return '';
    
    const baseUrl = `https://wa.me/${formattedPhone}`;
    if (message) {
        const encodedMessage = encodeURIComponent(message);
        return `${baseUrl}?text=${encodedMessage}`;
    }
    return baseUrl;
};

