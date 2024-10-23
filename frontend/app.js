// frontend/app.js
document.getElementById('form-registro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const telefono = document.getElementById('telefono').value;
    const errorSpan = document.getElementById('telefono-error');

    // Validación del número de teléfono
    if (!/^[5-9]\d{9}$/.test(telefono)) {
        errorSpan.textContent = 'El número debe tener 10 dígitos y empezar con un dígito entre 5 y 9.';
        return;
    }

    errorSpan.textContent = '';  // Limpiar cualquier mensaje de error
    
    // Enviar los datos al servidor
    fetch('/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telefono })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error en la solicitud');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Número de teléfono registrado exitosamente.') {
            alert(data.message);
            window.location.href = `formulario.html?telefono=${telefono}`;
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error: ' + error.message);
    });
});

