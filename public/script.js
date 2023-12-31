// Función para generar un ID aleatorio para el voucher
function generateVoucherID() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Función para crear un nuevo voucher
  async function createVoucher(message) {  
    const id = generateVoucherID();
    const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const validUntil = document.getElementById('validUntil').value;
    console.log("Generated Voucher ID:", id);

    // Enviar petición al backend para crear un nuevo voucher
    const response = await fetch('https://vauchers1-0.onrender.com/create', {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, message, from_text: from, to_text: to, valid_until: validUntil })  // Agregar nuevos campos
    });

    if (response.ok) {
      // Generar QR con el ID del voucher
      new QRCode(document.getElementById("qrcode"), {
        text: `https://vauchers1-0.onrender.com/validate.html?voucher_id=${id}`,
        width: 128,
        height: 128
      });
      document.getElementById('createVoucher').style.display = 'none';

    
  
  // Mostrar alerta de éxito con Sweet Alert
  Swal.fire(
    '¡Creado!',
    'El voucher ha sido creado exitosamente.',
    'success'
  ).then(() => {
    // Crear el botón "Nuevo Voucher"
    const newVoucherButton = document.createElement('button');
    newVoucherButton.innerHTML = 'Nuevo Voucher';
    newVoucherButton.id = 'newVoucherButton';
    newVoucherButton.classList.add('center-button');
    newVoucherButton.addEventListener('click', function() {
      location.reload();
    });
    document.body.appendChild(newVoucherButton);
  
    // Crear el botón "Descargar Voucher"
    const downloadVoucherButton = document.createElement('button');
    downloadVoucherButton.innerHTML = 'Descargar Voucher';
    downloadVoucherButton.id = 'downloadVoucherButton';
    downloadVoucherButton.classList.add('center-button');
    downloadVoucherButton.addEventListener('click', function() {
      html2canvas(document.querySelector("#voucherCard")).then(canvas => {
        let imgData = canvas.toDataURL('image/png');
        let a = document.createElement('a');
        a.href = imgData;
        a.download = 'voucher.png';
        a.click();
      });
    });
    document.body.appendChild(downloadVoucherButton);
  });
  
} else {
  // Mostrar alerta de error con Sweet Alert
  Swal.fire(
    'Error',
    'Hubo un problema al crear el voucher.',
    'error'
  );
}
}// Función para mostrar el modal de Sweet Alert para el mensaje del premio
function showPrizePrompt() {
    Swal.fire({
      title: 'Ingrese el mensaje del premio',
      input: 'text',
      inputPlaceholder: 'Ejemplo: Premio: Camiseta Gratis'
    }).then((result) => {
      if (result.isConfirmed) {
        createVoucher(result.value);
      }
    });
  }
  
  // Añadir evento al botón para crear un nuevo voucher
  document.getElementById("createVoucher").addEventListener("click", showPrizePrompt);



// New code for handling metadata and card

// Show the modal when 'createVoucher' is invoked
function showMetadataModal() {
  const modal = document.getElementById('metadataModal');
  modal.style.display = 'block';
}


// Collect data from the modal
document.getElementById('submitMetadata').addEventListener('click', function() {
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const validUntil = document.getElementById('validUntil').value;
  
  // Update the card with collected data
  document.getElementById('fromText').textContent = `De parte de: ${from}`;
  document.getElementById('toText').textContent = `Para: ${to}`;
  document.getElementById('validUntilText').textContent = `Válido hasta: ${validUntil}`;
  
  // Hide the modal
  const modal = document.getElementById('metadataModal');
  modal.style.display = 'none';
  
  // Show the voucher card
  const voucherCard = document.getElementById('voucherCard');
  voucherCard.style.display = 'flex';
  // Show the "Crear Voucher" button
  document.getElementById('createVoucher').style.display = 'inline';
});


// Code to download the card as an image
// Placeholder: This part usually requires additional libraries like html2canvas or similar solutions


// Endpoint para obtener el historial de vouchers
// Función para mostrar el historial de vouchers
async function showHistory() {
  const response = await fetch('https://vauchers1-0.onrender.com/history');
  if (response.ok) {
    const vouchers = await response.json();
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';  // Limpiar el contenedor
    vouchers.forEach(voucher => {
      const voucherDiv = document.createElement('div');
      voucherDiv.innerHTML = `
        <strong>De:</strong> ${voucher.from_text} <br>
        <strong>Para:</strong> ${voucher.to_text} <br>
        <strong>Mensaje:</strong> ${voucher.message} <br>
        <strong>Validez:</strong> ${voucher.valid_until} <br>
        <hr>
      `;
      historyContainer.appendChild(voucherDiv);
    });
    historyContainer.style.display = 'block';
  } else {
    alert('Error al recuperar el historial');
  }
}

// Añadir evento al botón para mostrar el historial
document.getElementById("showHistory").addEventListener("click", showHistory);
document.getElementById('downloadVoucher').addEventListener('click', function() {
  html2canvas(document.querySelector("#voucherCard")).then(canvas => {
      let imgData = canvas.toDataURL('image/png');
      let a = document.createElement('a');
      a.href = imgData;
      a.download = 'voucher.png';
      a.click();
  });
});


var qrcode = new QRCode(document.getElementById("qrcode"), {
  text: "https://www.google.com",
  width: 128,
  height: 128,
  colorDark : "#000000",
  colorLight : "#ffffff",
});
