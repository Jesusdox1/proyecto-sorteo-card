// frontend/app.js
document.getElementById('form-registro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const telefono = document.getElementById('telefono').value;
    const errorSpan = document.getElementById('telefono-error');

    if (!/^\d{10}$/.test(telefono)) {
        errorSpan.textContent = 'El número de teléfono debe tener 10 dígitos';
        return;
    }

    // Verificación adicional: ¿El número empieza con 5-9?
    if (!/^[5-9]\d{9}$/.test(telefono)) {
        errorSpan.textContent = 'El número debe empezar con un dígito entre 5 y 9.';
        return;
    }

    errorSpan.textContent = '';  // Limpiar cualquier mensaje de error
    
    // Enviar los datos al servidor
    fetch('http://localhost:5000/api/registro', {  // Cambiado a Railway
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telefono })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Número de teléfono registrado exitosamente.') {
            alert(data.message);
            window.location.href = `formulario.html?telefono=${telefono}`;
        } else {
            alert(data.message);  // Aquí se muestra el mensaje de error
        }
    })
    .catch(error => {
        console.error('Error:', error);  // Asegúrate de revisar este log
        alert('Ocurrió un error al registrar el número.');
    });    
});

