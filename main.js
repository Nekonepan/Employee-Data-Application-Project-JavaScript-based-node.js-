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
    console.table([hasil]);
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

// MENU PILIHAN ===================================================================================
async function main_menu() {
  const { menu } = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Pilih Menu : ",
      choices: [
        "Tampilkan Semua Data",
        "Tambah Data Baru",
        "Cari Karyawan",
        "Keluar",
      ],
    },
  ]);

  switch (menu) {
    case "Tampilkan Semua Data": {
      console.log("\n");
      tampilkan_data();
      console.log("\n");
      break;
    }

    case "Tambah Data Baru": {
      console.log("\n");
      await tambah_data();
      console.log("\n");
      break;
    }

    case "Cari Karyawan": {
      console.log("\n");
      await cari_data();
      console.log("\n");
      break;
    }

    case "Keluar": {
      console.log("\n");
      console.log("Keluar dari program.");
      process.exit();
    }
  }

  await main_menu();
}
// ================================================================================================

main_menu();
