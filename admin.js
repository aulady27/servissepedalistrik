document.addEventListener("DOMContentLoaded", function () {
  let url =
    "https://script.google.com/macros/s/AKfycby9G3BiVYNdPu7ErGNoKh3IQWvyFyMBmZW96Iy-frFlNDwVV5XlR-072KdRFqXwUgot/exec";

  // Create WhatsApp modal elements
  const whatsappModal = document.createElement('div');
  whatsappModal.id = 'whatsappModal';
  whatsappModal.className = 'modal';
  whatsappModal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h3>Kirim Notifikasi ke Teknisi</h3>
      <p id="modalMessage"></p>
      <div class="modal-actions">
        <button id="confirmSendBtn" class="btn-confirm">
          <i class="bi bi-whatsapp"></i> Kirim
        </button>
        <button id="cancelSendBtn" class="btn-cancel">Batal</button>
      </div>
    </div>
  `;
  document.body.appendChild(whatsappModal);

  // Modal control variables
  let currentServiceData = null;
  const modalMessage = document.getElementById("modalMessage");
  const modal = document.getElementById("whatsappModal");

  // Modal event listeners
  document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = "none";
  });
  
  document.getElementById("cancelSendBtn").addEventListener('click', () => {
    modal.style.display = "none";
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // fungsi untuk mengambil data dari spreadsheet
  function getData(callback) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => callback(data))
      .catch((error) => console.error("Error:", error));
  }

  // GET Data untuk Admin JS
  getData(updateTable);

  // Format Tanggal
  function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID");
  }

  function updateTable(data) {
    let tableBody = document.getElementById("dataTable");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach((row) => {
      let statusClass = getStatusClass(row.status);

      let tr = document.createElement("tr");
      tr.innerHTML = `
              <td>${row.no_seri}</td>
              <td>${row.nama}</td>
              <td>${row.nama_toko}</td>
              <td>${row.alamat}</td>
              <td>${row.no_hp}</td>
              <td>${row.merk}</td>
              <td>${row.tipe}</td>
              <td>${formatDate(row.tanggal)}</td> 
              <td>${row.jenis_service}</td>
              <td>${row.keterangan}</td>
              <td class="flex-center">
                <div class="${statusClass} status"></div>
                <p>${row.status}</p>
              </td>
              <td>
                <button class="btn-whatsapp" title="Kirim notifikasi ke teknisi">
                  <i class="bi bi-whatsapp"></i>
                </button>
              </td>
            `;
      tableBody.appendChild(tr);

      // Add event listener to WhatsApp button
      const whatsappBtn = tr.querySelector('.btn-whatsapp');
      whatsappBtn.addEventListener('click', () => {
        showWhatsAppModal(row);
      });
    });
  }

  function showWhatsAppModal(serviceData) {
    currentServiceData = serviceData;
    modalMessage.innerHTML = `
      Konfirmasi pengiriman notifikasi ke teknisi untuk service:<br><br>
      <strong>No Seri:</strong> ${serviceData.no_seri}<br>
      <strong>Nama:</strong> ${serviceData.nama}<br>
      <strong>Merk:</strong> ${serviceData.merk} ${serviceData.tipe}
    `;
    modal.style.display = "block";
  }

  // Send WhatsApp notification
  document.getElementById("confirmSendBtn").addEventListener('click', () => {
    if (currentServiceData) {
      sendWhatsAppNotification(currentServiceData);
      modal.style.display = "none";
    }
  });

  function sendWhatsAppNotification(serviceData) {
    // Technician's WhatsApp number
    const teknisiPhoneNumber = "085956752301";
    
    // Format WhatsApp message
    const today = new Date().toLocaleDateString("id-ID");
    const message = `*NOTIFIKASI SERVICE BARU*%0A%0A
📅 *Tanggal:* ${today}%0A
🆔 *No Seri:* ${serviceData.no_seri}%0A
👤 *Nama Pelanggan:* ${serviceData.nama}%0A
📱 *No. HP Pelanggan:* ${serviceData.no_hp}%0A
🏬 *Nama Toko:* ${serviceData.nama_toko}%0A
🏍 *Merk/Tipe:* ${serviceData.merk} ${serviceData.tipe}%0A
🔧 *Jenis Service:* ${serviceData.jenis_service}%0A
📝 *Keterangan:* ${serviceData.keterangan}%0A%0A
⚠️ *Segera diproses dan update statusnya*%0A
Terima kasih.`;
    
    // Create WhatsApp link
    const whatsappUrl = `https://wa.me/${teknisiPhoneNumber}?text=${message}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  }
});

// Fungsi untuk menentukan kelas status berdasarkan statusnya
function getStatusClass(status) {
  let statusLower = status.toLowerCase();
  if (statusLower === "pending") return "status-pending";
  if (statusLower === "proses") return "status-proses";
  if (statusLower === "selesai") return "status-selesai";
  return "";
}

// Fungsi untuk menampilkan tabel berdasarkan Pencarian JS
function searchTable() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let table = document.getElementById("dataTable");
  let rows = table.getElementsByTagName("tr");

  // Looping untuk filter baris
  for (let i = 0; i < rows.length; i++) {
    let rowText = rows[i].innerText.toLowerCase();
    if (rowText.includes(input)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

// Add CSS for WhatsApp button and modal
const style = document.createElement('style');
style.textContent = `
  .btn-whatsapp {
    background-color: #25D366;
    color: white;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    transition: background-color 0.2s;
  }
  .btn-whatsapp:hover {
    background-color: #128C7E;
  }
  .btn-whatsapp i {
    font-size: 16px;
  }
  .modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }
  .modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  .btn-confirm {
    background-color: #25D366;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn-cancel {
    background-color: #f44336;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
`;
document.head.appendChild(style);