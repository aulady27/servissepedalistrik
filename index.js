document.addEventListener("DOMContentLoaded", function () {
  let url =
    "https://script.google.com/macros/s/AKfycby9G3BiVYNdPu7ErGNoKh3IQWvyFyMBmZW96Iy-frFlNDwVV5XlR-072KdRFqXwUgot/exec";

  // kirim data ke spreedseat
  function postData(formElement) {
    let formData = new FormData(formElement);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log({ status: { ...data } });
        alert("Data berhasil dikirim!");
        formElement.reset();
      })
      .catch((error) => console.error("Error:", error));
  }

  // POST Data ke Google Sheets = JS
  let serviceForm = document.getElementById("serviceForm");
  if (serviceForm) {
    serviceForm.addEventListener("submit", function (e) {
      e.preventDefault();
      postData(serviceForm);
    });
  }
});

// Dynamic Tipe Berdasarkan Merek = JS
document.getElementById("merk")?.addEventListener("change", function () {
  let tipeSelect = document.getElementById("tipe");
  tipeSelect.innerHTML = `<option value="">Pilih Tipe</option>`;

  let tipeOptions = {
    Ofero: ["Ledo 3","Galaxy 2", "Galaxy 3", "Magical 1", "Magical 2", "Magical 2 Pro", "Magical 3", "Stareer"],
    Yadea: ["Dingding", "Minio", "X-Bull", "GT-30", "GQ9"],
  };

  let selectedMerk = this.value;
  if (tipeOptions[selectedMerk]) {
    tipeOptions[selectedMerk].forEach((tipe) => {
      let option = document.createElement("option");
      option.value = tipe;
      option.textContent = tipe;
      tipeSelect.appendChild(option);
    });
  }
});
