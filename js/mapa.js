/* ==========================================================================
   BARRIO SEGURO - LÓGICA DEL MAPA INTERACTIVO Y GEOLOCALIZACIÓN GPS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirMapa = document.getElementById('btnAbrirMapa');
    const modalMapa = document.getElementById('modalMapa');
    const btnCerrarMapa = document.getElementById('btnCerrarMapa');
    const btnConfirmarUbicacion = document.getElementById('btnConfirmarUbicacion');
    const btnMiUbicacion = document.getElementById('btnMiUbicacion');
    const inputCoordenadas = document.getElementById('coordenadas');

    if (!btnAbrirMapa || !modalMapa) return;

    let mapa = null;
    let marcador = null;
    
    // Coordenadas por defecto iniciales: Managua, Nicaragua
    const centroNicaragua = [12.1364, -86.2514];
    let coordenadasSeleccionadas = null;

    // --------------------------------------------------
    // ABRIR EL MODAL DEL MAPA
    // --------------------------------------------------
    btnAbrirMapa.addEventListener('click', () => {
        modalMapa.classList.add('active');

        if (!mapa) {
            mapa = L.map('mapaContenedor').setView(centroNicaragua, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapa);

            marcador = L.marker(centroNicaragua, { draggable: true }).addTo(mapa);

            marcador.on('dragend', (e) => {
                const posicion = marcador.getLatLng();
                coordenadasSeleccionadas = `${posicion.lat.toFixed(6)}, ${posicion.lng.toFixed(6)}`;
            });

            mapa.on('click', (e) => {
                marcador.setLatLng(e.latlng);
                coordenadasSeleccionadas = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
            });

            coordenadasSeleccionadas = `${centroNicaragua[0]}, ${centroNicaragua[1]}`;
        } else {
            setTimeout(() => {
                mapa.invalidateSize();
            }, 200);
        }
    });

    // --------------------------------------------------
    // BOTÓN: OBTENER UBICACIÓN GPS ACTUAL DEL USUARIO
    // --------------------------------------------------
    if (btnMiUbicacion) {
        btnMiUbicacion.addEventListener('click', () => {
            if (navigator.geolocation) {
                // Pedir coordenadas reales del dispositivo
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const nuevaPos = [lat, lng];

                        // Centrar mapa y mover marcador a la ubicación real
                        mapa.setView(nuevaPos, 16);
                        marcador.setLatLng(nuevaPos);
                        coordenadasSeleccionadas = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                        
                        alert("¡Ubicación GPS detectada con éxito!");
                    },
                    (error) => {
                        alert("No se pudo obtener tu ubicación. Asegúrate de permitir el acceso al GPS en tu navegador.");
                        console.error(error);
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                alert("Tu navegador no soporta geolocalización.");
            }
        });
    }

    // --------------------------------------------------
    // CERRAR EL MODAL SIN GUARDAR
    // --------------------------------------------------
    if (btnCerrarMapa) {
        btnCerrarMapa.addEventListener('click', () => {
            modalMapa.classList.remove('active');
        });
    }

    // --------------------------------------------------
    // CONFIRMAR UBICACIÓN SELECCIONADA
    // --------------------------------------------------
    if (btnConfirmarUbicacion) {
        btnConfirmarUbicacion.addEventListener('click', () => {
            if (coordenadasSeleccionadas) {
                inputCoordenadas.value = coordenadasSeleccionadas;
                modalMapa.classList.remove('active');
            } else {
                alert("Por favor, selecciona un punto válido en el mapa.");
            }
        });
    }

    // --------------------------------------------------
    // CERRAR MODAL AL HACER CLIC FUERA
    // --------------------------------------------------
    window.addEventListener('click', (e) => {
        if (e.target === modalMapa) {
            modalMapa.classList.remove('active');
        }
    });
});