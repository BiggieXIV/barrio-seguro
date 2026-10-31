/* ==========================================================================
   BARRIO SEGURO - LÓGICA DE VALIDACIÓN Y ENVÍO DE REPORTES A WHATSAPP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // CONFIGURACIÓN PRINCIPAL
    // --------------------------------------------------
    // Número de WhatsApp institucional / alcaldía (Formato internacional sin el signo '+')
    // Ejemplo para Nicaragua (+505): 50588888888
    const NUMERO_WHATSAPP_DESTINO = "50581451649"; 

    // Referencias a los elementos del formulario
    const formReporte = document.getElementById('formReporte');

    if (!formReporte) return; // Si no existe el formulario en la página actual, salir

    // --------------------------------------------------
    // EVENTO PRINCIPAL DE ENVÍO
    // --------------------------------------------------
    formReporte.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir el envío tradicional de formulario

        // Obtener y limpiar los valores ingresados por el usuario
        const tipoIncidencia = document.getElementById('tipoIncidencia').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const barrio = document.getElementById('barrio').value.trim();
        const coordenadas = document.getElementById('coordenadas').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const comentario = document.getElementById('comentario') ? document.getElementById('comentario').value.trim() : '';

        // --------------------------------------------------
        // VALIDACIONES ADICIONALES DE SEGURIDAD Y FORMATO
        // --------------------------------------------------
        if (!tipoIncidencia) {
            alert("Por favor, selecciona el tipo de incidencia o problema.");
            document.getElementById('tipoIncidencia').focus();
            return;
        }

        if (nombre.length < 3) {
            alert("Por favor, ingresa tu nombre completo.");
            document.getElementById('nombre').focus();
            return;
        }

        if (telefono.length < 8) {
            alert("Por favor, ingresa un número de teléfono válido de al menos 8 dígitos.");
            document.getElementById('telefono').focus();
            return;
        }

        if (!barrio) {
            alert("Por favor, ingresa el barrio o comunidad.");
            document.getElementById('barrio').focus();
            return;
        }

        if (!coordenadas) {
            alert("Por favor, haz clic en el botón 'Mapa' para seleccionar la ubicación exacta del problema.");
            return;
        }

        if (direccion.length < 10) {
            alert("Por favor, ingresa una dirección o punto de referencia detallado (mínimo 10 caracteres).");
            document.getElementById('direccion').focus();
            return;
        }

        // --------------------------------------------------
        // CONSTRUCCIÓN DEL ENLACE A GOOGLE MAPS
        // --------------------------------------------------
        // Las coordenadas vienen en formato "Lat, Lng" desde mapa.js
        const enlaceGoogleMaps = `https://www.google.com/maps?q=${encodeURIComponent(coordenadas)}`;

        // --------------------------------------------------
        // CONSTRUCCIÓN DEL MENSAJE ESTRUCTURADO DE WHATSAPP
        // --------------------------------------------------
        let mensajeWhatsApp = `*🚨 NUEVO REPORTE CIUDADANO - BARRIO SEGURO 🚨*\n\n`;
        mensajeWhatsApp += `*⚠️ Tipo de Incidencia:* ${tipoIncidencia}\n`;
        mensajeWhatsApp += `*👤 Denunciante:* ${nombre}\n`;
        mensajeWhatsApp += `*📞 Teléfono:* ${telefono}\n`;
        mensajeWhatsApp += `*🏡 Barrio/Comunidad:* ${barrio}\n`;
        mensajeWhatsApp += `*📍 Dirección / Referencia:* ${direccion}\n`;
        
        // Agregar comentario si el usuario escribió algo
        if (comentario !== "") {
            mensajeWhatsApp += `*💬 Comentarios Adicionales:* ${comentario}\n`;
        } else {
            mensajeWhatsApp += `*💬 Comentarios Adicionales:* Sin comentarios adjuntos.\n`;
        }

        mensajeWhatsApp += `\n*🗺️ Ubicación GPS (Google Maps):*\n${enlaceGoogleMaps}\n\n`;
        mensajeWhatsApp += `_Enviado desde el portal web oficial de Barrio Seguro._`;

        // --------------------------------------------------
        // GENERACIÓN Y APERTURA DEL URL DE WHATSAPP
        // --------------------------------------------------
        // encodeURIComponent convierte espacios, saltos de línea y emojis en caracteres seguros de URL
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP_DESTINO}&text=${encodeURIComponent(mensajeWhatsApp)}`;

        // Mensaje de confirmación visual antes de redirigir
        const confirmar = confirm("¿Deseas enviar este reporte directo al número de atención comunitaria de WhatsApp?");
        
        if (confirmar) {
            // Abrir la ventana de WhatsApp en una pestaña nueva
            window.open(urlWhatsApp, '_blank');
        }
    });
});