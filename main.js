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

  const { jumlah_data } = await inquirer.prompt([
    {
      name: "jumlah_data",
      message: "Masukkan jumlah data yang ingin ditambahkan : ",
      validate: (value) => {
        const valid = Number.isInteger(Number(value)) && Number(value) > 0;
        return (
          valid || "Masukkan jumlah data yang ingin ditambahkan lebih dari 0"
        );
      },
    },
  ]);

  let new_data = [];

  for (let i = 0; i < Number(jumlah_data); i++) {
    console.log(`\nData ke-${i + 1}`);

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
      continue;
    }
    // -------------------------------------------------------------

    // CEK ID YANG DUPLIKAT ATAU SUDAH DIPAKAI -------------------------
    const duplicated_id =
      data.find((item) => item.ID === hasil.ID) ||
      new_data.find((item) => item.ID === hasil.ID);
    if (duplicated_id) {
      console.log(`ID "${hasil.ID}" sudah digunakan. Gunakan ID lain.`);
      continue;
    }
    // -----------------------------------------------------------------

    // SETELAH LOLOS VALIDASI ----------------------------------------------------
    new_data.push({
      ID: hasil.ID,
      NAMA: hasil.NAMA,
      JABATAN: hasil.JABATAN,
      TELP: hasil.TELP,
    });

    console.log("Data berhasil ditambahkan.");
    // ---------------------------------------------------------------------------
  }

  if (new_data.length === 0) {
    console.log("\nTidak ada data valid yang berhasil ditambahkan.");
    return;
  }

  console.log("\n========== RINGKASAN DATA YANG AKAN DITAMBAHKAN ==========");
  console.table(new_data);

  // KONFIRMASI AKSI ------------------------------------------
  const { save_confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "save_confirm",
      message: "Apakah anda ingin menyimpan data ini ke file?",
    },
  ]);
  // ----------------------------------------------------------

  if (save_confirm) {
    data = data.concat(new_data);
    let write_data =
      data
        .map((item) => `${item.ID}|${item.NAMA}|${item.JABATAN}|${item.TELP}`)
        .join("\n") + "\n";

    fs.writeFileSync("data-karyawan.txt", write_data);
    console.log("========== DATA BERHASIL DITAMBAHKAN DAN DISIMPAN ==========");
  } else {
    console.log("Penyimpanan dibatalkan. Data tidak disimpan.");
  }
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

    // KONFIRMASI AKSI -----------------------------------------------------------------------------------------------------
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
      break;
    }

    case "Descending (Z-A)": {
      console.log("\n");
      await sort_by_id_descending();
      await hasil_sorting();
      console.log("\n");
      break;
    }

    case "Kembali": {
      return;
    }
  }
}
// ================================================================================================

// EDIT DATA KARYAWAN =============================================================================
async function edit_data() {
  console.log("========== EDIT DATA KARYAWAN ==========");

  const { methode } = await inquirer.prompt([
    {
      type: "list",
      name: "methode",
      message: "Pilih metode pencarian data yang akan diedit : ",
      choices: ["Berdasarkan ID", "Berdasarkan Nama", "Batal"],
    },
  ]);

  if (methode === "Batal") {
    return;
  }

  let find_data = null;

  switch (methode) {
    case "Berdasarkan ID": {
      const { cari_id } = await inquirer.prompt([
        { name: "cari_id", message: "Masukkan ID karyawan : " },
      ]);

      find_data = data.find(
        (item) => item.ID.toLowerCase() === cari_id.trim().toLowerCase()
      );
      break;
    }

    case "Berdasarkan Nama": {
      const { cari_nama } = await inquirer.prompt([
        { name: "cari_nama", message: "Masukkan nama karyawan : " },
      ]);

      const hasil = data.filter((item) =>
        item.NAMA.toLowerCase().includes(cari_nama.trim().toLowerCase())
      );

      if (hasil.length === 0) {
        console.log("Data tidak ditemukan.");
        return;
      }

      const { selected } = await inquirer.prompt([
        {
          type: "list",
          name: "selected",
          message: "Pilih data yang ingin diedit : ",
          choices: hasil.map((item) => `${item.ID} - ${item.NAMA}`),
        },
      ]);

      const id_terpilih = selected.split(" - ")[0];
      find_data = data.find((item) => item.ID === id_terpilih);
      break;
    }
  }

  if (!find_data) {
    console.log("Data tidak ditemukan.");
    return;
  }

  console.log("========== DATA YANG AKAN DIEDIT ==========");
  console.table([find_data]);

  const hasil_edit = await inquirer.prompt([
    {
      name: "ID",
      message: `ID baru [ENTER jika tidak ingin mengubah] (${find_data.ID}) : `,
    },
    {
      name: "NAMA",
      message: `Nama baru [ENTER jika tidak ingin mengubah] (${find_data.NAMA}) : `,
    },
    {
      name: "JABATAN",
      message: `Jabatan baru [ENTER jika tidak ingin mengubah] (${find_data.JABATAN}) : `,
    },
    {
      name: "TELP",
      message: `No. Telp baru [ENTER jika tidak ingin mengubah] (${find_data.TELP}) : `,
    },
  ]);

  // SIMPAN PERUBAHAN JIKA FIELD TIDAK KOSONG -----------------------
  const new_ID = hasil_edit.ID.trim() || find_data.ID;
  const new_NAMA = hasil_edit.NAMA.trim() || find_data.NAMA;
  const new_JABATAN = hasil_edit.JABATAN.trim() || find_data.JABATAN;
  const new_TELP = hasil_edit.TELP.trim() || find_data.TELP;
  // ----------------------------------------------------------------

  // VALIDASI ID DUPLIKAT JIKA ID DIGANTI ---------------------------------
  if (new_ID !== find_data.ID && data.some((item) => item.ID === new_ID)) {
    console.log(`ID "${new_ID}" sudah digunakan.`);
    return;
  }
  // ----------------------------------------------------------------------

  console.log("========== BERIKUT PERUBAHAN YANG AKAN DISIMPAN ==========");
  console.table([
    {
      ID: new_ID,
      NAMA: new_NAMA,
      JABATAN: new_JABATAN,
      TELP: new_TELP,
    },
  ]);

  // KONFIRMASI SIMPAN ------------------------------------------------
  const { save_confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "save_confirm",
      message: "Apakah anda yakin ingin menyimpan perubahan ke file?",
    },
  ]);

  if (!save_confirm) {
    console.log("Perubahan dibatalkan. Tidak ada data yang disimpan.");
    return;
  }
  // ------------------------------------------------------------------

  // SIMPAN PERUBAHAN KE ARRAY JIKA SETUJU ---
  find_data.ID = new_ID;
  find_data.NAMA = new_NAMA;
  find_data.JABATAN = new_JABATAN;
  find_data.TELP = new_TELP;
  // -----------------------------------------

  const new_file_data =
    data
      .map((item) => `${item.ID}|${item.NAMA}|${item.JABATAN}|${item.TELP}`)
      .join("\n") + "\n";

  fs.writeFileSync("data-karyawan.txt", new_file_data);
  console.log("Data berhasil diperbarui dan disimpan ke file.");
}
// ================================================================================================

async function delete_data() {
  console.log("========== HAPUS DATA KARYAWAN ==========");

  const { methode } = await inquirer.prompt([
    {
      type: "list",
      name: "methode",
      message: "Pilih metode pencarian data yang akan dihapus : ",
      choices: ["Berdasarkan ID", "Berdasarkan Nama", "Batal"],
    },
  ]);

  let target = null;

  switch (methode) {
    case "Berdasarkan ID": {
      const { cari_id } = await inquirer.prompt([
        { name: "cari_id", message: "Masukkan ID karyawan : " },
      ]);

      target = data.find(
        (item) => item.ID.toLowerCase() === cari_id.trim().toLowerCase()
      );
      break;
    }

    case "Berdasarkan Nama": {
      const { cari_nama } = await inquirer.prompt([
        {
          name: "cari_nama",
          message: "Masukkan nama (atau sebagian) karyawan : ",
        },
      ]);

      const hasil = data.filter((item) =>
        item.NAMA.toLowerCase().includes(cari_nama.trim().toLowerCase())
      );

      if (hasil.length === 0) {
        console.log("Data tidak ditemukan.");
        return;
      }

      const { selected } = await inquirer.prompt([
        {
          type: "list",
          name: "selected",
          message: "Pilih data yang ingin dihapus : ",
          choices: hasil.map((item) => `${item.ID} - ${item.NAMA}`),
        },
      ]);

      const id_terpilih = selected.split(" - ")[0];
      target = data.find((item) => item.ID === id_terpilih);
      break;
    }

    case "Batal": {
      return;
    }
  }

  if (!target) {
    console.log("Data tidak ditemukan.");
    return;
  }

  console.log("========== DATA YANG AKAN DIHAPUS ==========");
  console.table([target]);

  const { delete_confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "delete_confirm",
      message: "Apakah anda yakin ingin menghapus data ini?",
    },
  ]);

  if (!delete_confirm) {
    console.log("Penghapusan dibatalkan.");
    return;
  }

  data = data.filter((item) => item.ID !== target.ID);
  console.log(`Data dengan ID "${target.ID}" berhasil dihapus.`);

  const { save_delete } = await inquirer.prompt([
    {
      type: "confirm",
      name: "save_delete",
      message: "Apakah ingin menyimpan hasil penghapusan ke file?",
    },
  ]);

  if (save_delete) {
    const new_file_data =
      data
        .map((item) => `${item.ID}|${item.NAMA}|${item.JABATAN}|${item.TELP}`)
        .join("\n") + "\n";

    fs.writeFileSync("data-karyawan.txt", new_file_data);
    console.log("File berhasil diperbarui setelah penghapusan.");
  } else {
    console.log("Data di file tidak diubah.");
  }
}

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
        "5. Edit Data",
        "6. Hapus Data",
        "7. Keluar",
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

    case "5. Edit Data": {
      console.log("\n");
      await edit_data();
      console.log("\n");
      break;
    }

    case "6. Hapus Data": {
      console.log("\n");
      await delete_data();
      console.log("\n");
      break;
    }

    case "7. Keluar": {
      console.log("\n");
      console.log("Keluar dari program.");
      process.exit();
    }
  }

  await main_menu();
}
// ================================================================================================

main_menu();
