const prompt = require("prompt-sync")();
const inquirer = require("inquirer");
const fs = require("fs");
const { type } = require("os");

const isi_file = fs.readFileSync("data-karyawan.txt", "utf-8");
const baris = isi_file.trim().split("\n");

let data = [];

for (let i = 0; i < baris.length; i++) {
  let kolom = baris[i].split("|");

  data.push({
    ID: kolom[0],
    NAMA: kolom[1],
    JABATAN: kolom[2],
    TELP: kolom[3],
  });
}

// TAMPILKAN DATA =================================================================================
function tampilkan_data() {
  console.log("========== DATA KARYAWAN ==========");

  if (data.length === 0) {
    console.log("Data masih kosong !");
  } else {
    console.log("Jumlah Data : ", data.length);
    console.table(data);
  }
}
// ================================================================================================

// TAMBAH DATA BARU ===============================================================================
async function tambah_data() {
  console.log("========== TAMBAH DATA KARYAWAN ==========");

  const hasil = await inquirer.prompt([
    { name: "ID", message: "Masukkan ID : " },
    { name: "NAMA", message: "Masukkan Nama : " },
    { name: "JABATAN", message: "Masukkan Jabatan : " },
    { name: "TELP", message: "Masukkan No. Telp : " },
  ]);

  // CEK FIELD JIKA MASIH KOSONG ---------------------------------
  if (
    hasil.ID.trim() === "" ||
    hasil.NAMA.trim() === "" ||
    hasil.JABATAN.trim() === "" ||
    hasil.TELP.trim() === ""
  ) {
    console.log("Semua field wajib diisi. Data tidak tersimpan!");
    return;
  }
  // -------------------------------------------------------------

  // CEK ID YANG DUPLIKAT ATAU SUDAH DIPAKAI -------------------------
  const duplicated_id = data.find((item) => item.ID === hasil.ID);
  if (duplicated_id) {
    console.log(`ID "${hasil.ID}" sudah digunakan. Gunakan ID lain.`);
    return;
  }
  // -----------------------------------------------------------------

  // SETELAH LOLOS VALIDASI ----------------------------------------------------
  data.push({
    ID: hasil.ID,
    NAMA: hasil.NAMA,
    JABATAN: hasil.JABATAN,
    TELP: hasil.TELP,
  });

  let write_data =
    data
      .map((item) => `${item.ID}|${item.NAMA}|${item.JABATAN}|${item.TELP}`)
      .join("\n") + "\n";

  fs.writeFileSync("data-karyawan.txt", write_data);
  console.log("========== DATA BERHASIL DITAMBAHKAN DAN DISIMPAN ==========");
  // ---------------------------------------------------------------------------
}
// ================================================================================================

// CARI KARYAWAN BERDASARKAN ID ===================================================================
async function search_by_id() {
  const { cari_id } = await inquirer.prompt([
    { name: "cari_id", message: "Masukkan ID yang ingin dicari : " },
  ]);

  const hasil = data.find(
    (item) => item.ID.toLowerCase() === cari_id.trim().toLowerCase()
  );
  if (hasil) {
    console.log("========== DATA DITEMUKAN =========");
    console.log(`ID : "${cari_id}" ditemukan.`);
    console.table(hasil);
  } else {
    console.log(`Data dengan ID "${cari_id}" tidak ditemukan.`);
  }
}
// ================================================================================================

// CARI KARYAWAN BERDASARKAN NAMA =================================================================
async function search_by_name() {
  const { cari_nama } = await inquirer.prompt([
    {
      name: "cari_nama",
      message: "Masukkan Nama (atau sebagian) yang ingin dicari : ",
    },
  ]);

  const hasil = data.filter((item) =>
    item.NAMA.toLowerCase().includes(cari_nama.trim().toLowerCase())
  );

  if (hasil.length > 0) {
    console.log("========== DATA DITEMUKAN =========");
    console.log(`Nama : "${cari_nama}" ditemukan.`);
    console.table(hasil);
  } else {
    console.log(`Tidak ada data dengan nama : "${cari_nama}"`);
  }
}
// ================================================================================================

// CARI DATA KARYAWAN =============================================================================
async function cari_data() {
  console.log("========= CARI DATA KARYAWAN =========");

  const { methode } = await inquirer.prompt([
    {
      type: "list",
      name: "methode",
      message: "Pilih metode pencarian : ",
      choices: [
        "Cari berdasarkan ID",
        "Cari berdasarkan Nama",
        "Kembali ke menu",
      ],
    },
  ]);

  switch (methode) {
    case "Cari berdasarkan ID": {
      console.log("\n");
      await search_by_id();
      console.log("\n");
      break;
    }
    case "Cari berdasarkan Nama": {
      console.log("\n");
      await search_by_name();
      console.log("\n");
      break;
    }
    case "Kembali ke menu": {
      return;
    }
  }
}
// ================================================================================================

// SORTING DATA BERDASARKAN ID KARYAWAN ===========================================================
async function sort_by_id() {
  const data_sort = [...data];

  async function sort_by_id_ascending() {
    data_sort.sort((a, b) => a.ID.localeCompare(b.ID));
  }

  async function sort_by_id_descending() {
    data_sort.sort((a, b) => b.ID.localeCompare(a.ID));
  }

  async function hasil_sorting() {
    console.log("\n========= HASIL SORTING ==========");
    console.table(data_sort);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Simpan hasil sorting?",
        choices: ["Simpan hasil sorting ke file", "Jangan simpan"],
      },
    ]);

    // VALIDASI AKSI -----------------------------------------------------------------------------------------------------
    if (action === "Simpan hasil sorting ke file") {
      const { confirm_action } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm_action",
          message:
            "Apakah anda yakin ingin menyimpan data hasil sorting ke file? (Aksi ini akan menimpa semua data sebelumnya)",
        },
      ]);
      // -------------------------------------------------------------------------------------------------------------------

      if (confirm_action) {
        const new_data =
          data_sort
            .map(
              (item) => `${item.ID}|${item.NAMA}|${item.JABATAN}|${item.TELP}`
            )
            .join("\n") + "\n";

        fs.writeFileSync("data-karyawan.txt", new_data);
        data = data_sort;
        console.log("Data telah disimpan ke file.");
      } else {
        console.log("Aksi dibatalkan. Data tidak disimpan.");
      }
    } else {
      console.log("Data tidak disimpan.");
    }
  }

  console.log("========= URUTKAN DATA BERDASARKAN ID ========");
  const { menu } = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Pilih arah pengurutan data : ",
      choices: ["Ascending (A-Z)", "Descending (Z-A)", "Kembali"],
    },
  ]);

  switch (menu) {
    case "Ascending (A-Z)": {
      console.log("\n");
      await sort_by_id_ascending();
      await hasil_sorting();
      console.log("\n");
    }
    
    case "Descending (Z-A)": {
      console.log("\n");
      await sort_by_id_descending();
      await hasil_sorting();
      console.log("\n");
    }

    case "Kembali": {
      return;
    }
  }

  
}
// ================================================================================================

// MENU PILIHAN ===================================================================================
async function main_menu() {
  const { menu } = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Pilih Menu : ",
      choices: [
        "1. Tampilkan Semua Data",
        "2. Tambah Data Baru",
        "3. Urutkan Data",
        "4. Cari Karyawan",
        "5. Keluar",
      ],
    },
  ]);

  switch (menu) {
    case "1. Tampilkan Semua Data": {
      console.log("\n");
      tampilkan_data();
      console.log("\n");
      break;
    }

    case "2. Tambah Data Baru": {
      console.log("\n");
      await tambah_data();
      console.log("\n");
      break;
    }

    case "3. Urutkan Data": {
      console.log("\n");
      await sort_by_id();
      console.log("\n");
      break;
    }

    case "4. Cari Karyawan": {
      console.log("\n");
      await cari_data();
      console.log("\n");
      break;
    }

    case "5. Keluar": {
      console.log("\n");
      console.log("Keluar dari program.");
      process.exit();
    }
  }

  await main_menu();
}
// ================================================================================================

main_menu();
