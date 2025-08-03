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
  console.log("\n========== DATA KARYAWAN ==========");

  if (data.length === 0) {
    console.log("Data masih kosong !");
  } else {
    console.log("Jumlah Data : ", data.length);
    console.table(data);
    console.log("\n");
  }
}
// ================================================================================================

// TAMBAH DATA BARU ===============================================================================
async function tambah_data() {
  console.log("\n========== TAMBAH DATA KARYAWAN ==========");

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
  console.log("========== DATA BERHASIL DITAMBAHKAN DAN DISIMPAN ==========\n");
  // ---------------------------------------------------------------------------
}
// ================================================================================================

// CARI DATA KARYAWAN =============================================================================
async function cari_data() {
  console.log("Untuk Cari Data");
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
    case "Tampilkan Semua Data":
      tampilkan_data();
      break;

    case "Tambah Data Baru":
      await tambah_data();
      break;

    case "Cari Karyawan":
      await cari_data();
      break;

    case "Keluar":
      console.log("Keluar dari program.");
      process.exit();
  }

  await main_menu();
}
// ================================================================================================

main_menu();
