// frontend/formulario.js
document.getElementById('registro-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const urlParams = new URLSearchParams(window.location.search);
    const telefono = urlParams.get('telefono');

    console.log("Datos a enviar: ", { telefono, nombre, correo }); // Log para revisar los datos enviados

    if(nombre && correo && telefono) {
        // Enviar los datos al servidor
        const datos = {
            telefono,
            nombre,
            correo
        };

    fetch('/api/completar-registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })

        .then(response => {
            if (!response.ok) {
                throw new Error('Error al completar el registro.');
            }
            return response.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = 'gracias.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al completar el registro.');
        });
    }
});

