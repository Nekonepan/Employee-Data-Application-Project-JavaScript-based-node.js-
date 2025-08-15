const prompt = require("prompt-sync")();
const inquirer = require("inquirer");
const fs = require("fs");
const { type } = require("os");
const { measureMemory } = require("vm");
const { captureRejectionSymbol } = require("events");

const file_path = "data-karyawan.json";
const backup_path = "backup/data-karyawan-backup.json";
const log_path = "logs/data-terhapus.json";

let data = read_data();

if (!fs.existsSync(file_path)) {
  console.warn(`File "${file_path}" tidak ditemukan. Membuat file baru...`);
  fs.writeFileSync(file_path, "");
}

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

if (!fs.existsSync("backup")) {
  fs.mkdirSync("backup");
}

// BACA DATA ======================================================================================
function read_data() {
  try {
    if (!fs.existsSync(file_path)) {
      fs.writeFileSync(file_path, "[]");
      return [];
    }
    const content = fs.readFileSync(file_path, "utf-8").trim();
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error("Gagal membaca atau parsing file JSON:", err.message);
    return [];
  }
}
// ================================================================================================

// SIMPAN DATA KE FILE ============================================================================
function write_data() {
  try {
    fs.writeFileSync(file_path, JSON.stringify(data, null, 2));
    backup_data();
    console.log("Data berhasil disimpan ke file.");
  } catch (err) {
    console.error(`Gagal untuk menyimpan file : ${err.message}`);
  }
}
// ================================================================================================

// BACKUP DATA SEBELUMNYAA ========================================================================
function backup_data() {
  try {
    fs.copyFileSync(file_path, backup_path);
  } catch (err) {
    console.error(`Gagal melakukan backup : ${err.message}`);
  }
}
// ================================================================================================

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
  console.log("========== TAMBAH DATA BARU ==========");

  try {
    const { ID, NAMA, JABATAN, TELP } = await inquirer.prompt([
      {
        type: "input",
        name: "ID",
        message: "Masukkan ID karyawan:",
        validate: (val) => {
          if (!val.trim()) {
            return "ID tidak boleh kosong!";
          }
          if (!/^[A-Za-z0-9]+$/.test(val)) {
            return "ID hanya boleh huruf dan angka!";
          }
          if (
            data.some(
              (karyawan) => karyawan.ID.toUpperCase() === val.toUpperCase()
            )
          ) {
            return "ID sudah digunakan!";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "NAMA",
        message: "Masukkan nama karyawan:",
        validate: (val) => {
          if (!val.trim()) {
            return "Nama tidak boleh kosong!";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "JABATAN",
        message: "Masukkan jabatan karyawan:",
        validate: (val) => {
          if (!val.trim()) {
            return "Jabatan tidak boleh kosong!";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "TELP",
        message: "Masukkan no telp karyawan:",
        validate: (val) => {
          if (!val.trim()) {
            return "Nomor telepon tidak boleh kosong!";
          }
          if (!/^[0-9]+$/.test(val)) {
            return "Nomor telepon hanya boleh angka!";
          }
          return true;
        },
      },
    ]);

    const { konfirmasi } = await inquirer.prompt([
      {
        type: "confirm",
        name: "konfirmasi",
        message: "Apakah anda yakin ingin menyimpan data ini?",
      },
    ]);

    if (!konfirmasi) {
      console.log("Data batal disimpan.");
      return;
    }

    data.push({
      ID: ID.trim().toUpperCase(),
      NAMA: NAMA.trim(),
      JABATAN: JABATAN.trim(),
      TELP: TELP.trim(),
    });

    write_data();
    backup_data();

    console.log("Data berhasil disimpan.");
  } catch (err) {
    console.error("Terjadi kesalahan saat menambahkan data:", err.message);
  }

  // console.log("========== TAMBAH DATA KARYAWAN ==========");

  // const { jumlah_data } = await inquirer.prompt([
  //   {
  //     name: "jumlah_data",
  //     message: "Masukkan jumlah data yang ingin ditambahkan : ",
  //     validate: (value) => {
  //       const valid = Number.isInteger(Number(value)) && Number(value) > 0;
  //       return (
  //         valid || "Masukkan jumlah data yang ingin ditambahkan lebih dari 0"
  //       );
  //     },
  //   },
  // ]);

  // let new_data = [];

  // for (let i = 0; i < Number(jumlah_data); i++) {
  //   console.log(`\nData ke-${i + 1}`);

  //   const hasil = await inquirer.prompt([
  //     { name: "ID", message: "Masukkan ID : " },
  //     { name: "NAMA", message: "Masukkan Nama : " },
  //     { name: "JABATAN", message: "Masukkan Jabatan : " },
  //     { name: "TELP", message: "Masukkan No. Telp : " },
  //   ]);

  //   // CEK FIELD JIKA MASIH KOSONG ---------------------------------
  //   if (
  //     hasil.ID.trim() === "" ||
  //     hasil.NAMA.trim() === "" ||
  //     hasil.JABATAN.trim() === "" ||
  //     hasil.TELP.trim() === ""
  //   ) {
  //     console.log("Semua field wajib diisi. Data tidak tersimpan!");
  //     continue;
  //   }
  //   // -------------------------------------------------------------

  //   // CEK ID YANG DUPLIKAT ATAU SUDAH DIPAKAI -------------------------
  //   const duplicated_id =
  //     data.find((item) => item.ID === hasil.ID) ||
  //     new_data.find((item) => item.ID === hasil.ID);
  //   if (duplicated_id) {
  //     console.log(`ID "${hasil.ID}" sudah digunakan. Gunakan ID lain.`);
  //     continue;
  //   }
  //   // -----------------------------------------------------------------

  //   // SETELAH LOLOS VALIDASI ----------------------------------------------------
  //   new_data.push({
  //     ID: hasil.ID,
  //     NAMA: hasil.NAMA,
  //     JABATAN: hasil.JABATAN,
  //     TELP: hasil.TELP,
  //   });

  //   console.log("Data berhasil ditambahkan.");
  //   // ---------------------------------------------------------------------------
  // }

  // if (new_data.length === 0) {
  //   console.log("\nTidak ada data valid yang berhasil ditambahkan.");
  //   return;
  // }

  // console.log("\n========== RINGKASAN DATA YANG AKAN DITAMBAHKAN ==========");
  // console.table(new_data);

  // // KONFIRMASI AKSI ------------------------------------------
  // const { save_confirm } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "save_confirm",
  //     message: "Apakah anda ingin menyimpan data ini ke file?",
  //   },
  // ]);
  // // ----------------------------------------------------------

  // if (save_confirm) {
  //   data = data.concat(new_data);
  //   write_data();
  // } else {
  //   console.log("Penyimpanan dibatalkan. Data tidak disimpan.");
  // }
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

  try {
    const { tipe } = await inquirer.prompt([
      {
        type: "list",
        name: "tipe",
        message: "Cari berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    const { keyword } = await inquirer.prompt([
      {
        type: "input",
        name: "keyword",
        message: `Masukkan ${tipe} yang ingin dicari:`,
        validate: (val) => {
          if (!val.trim()) {
            return `${tipe} tidak boleh kosong!`;
          }
          return true;
        },
      },
    ]);

    const keyword_lower = keyword.trim().toLowerCase();

    let hasil = [];
    if (tipe === "ID") {
      hasil = data.filter((karyawan) =>
        karyawan.ID.toLowerCase().includes(keyword_lower)
      );
    } else {
      hasil = data.filter((karyawan) =>
        karyawan.NAMA.toLowerCase().includes(keyword_lower)
      );
    }

    if (hasil.length === 0) {
      console.log("Data tidak ditemukan.");
    } else {
      console.table(hasil);
    }
  } catch (err) {
    console.error("Terjadi kesalahan saat mencari data:", err.message);
  }

  // console.log("========= CARI DATA KARYAWAN =========");

  // const { methode } = await inquirer.prompt([
  //   {
  //     type: "list",
  //     name: "methode",
  //     message: "Pilih metode pencarian : ",
  //     choices: [
  //       "Cari berdasarkan ID",
  //       "Cari berdasarkan Nama",
  //       "Kembali ke menu",
  //     ],
  //   },
  // ]);

  // switch (methode) {
  //   case "Cari berdasarkan ID": {
  //     console.log("\n");
  //     await search_by_id();
  //     console.log("\n");
  //     break;
  //   }
  //   case "Cari berdasarkan Nama": {
  //     console.log("\n");
  //     await search_by_name();
  //     console.log("\n");
  //     break;
  //   }
  //   case "Kembali ke menu": {
  //     return;
  //   }
  // }
}
// ================================================================================================

// SORTING DATA BERDASARKAN ID KARYAWAN ===========================================================
async function sort_by_id() {
  console.log("========= URUTKAN DATA BERDASARKAN ID =========");

  try {
    const { arah } = await inquirer.prompt([
      {
        type: "list",
        name: "arah",
        message: "Pilih arah pengurutan data : ",
        choices: ["Ascending (A-Z)", "Descending (Z-A)"],
      },
    ]);

    const data_sort = [...data];

    if (arah === "Ascending (A-Z)") {
      data_sort.sort((a, b) => a.ID.localeCompare(b.ID));
    } else {
      data_sort.sort((a, b) => b.ID.localeCompare(a.ID));
    }

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

    if (action === "Simpan hasil sorting ke file") {
      const { confirm_action } = await inquirer.prompt([
        {
          type: "confirm",
          name: "confirm_action",
          message:
            "Apakah anda yakin ingin menyimpan data hasil sorting ke file? (Aksi ini akan menimpa semua data sebelumnya)",
        },
      ]);

      if (confirm_action) {
        data = data_sort;
        write_data();
        backup_data();
        console.log("Data telah disimpan ke file.");
      } else {
        console.log("Data tidak disimpan.");
      }
    } else {
      console.log("Data tidak disimpan.");
    }
  } catch (err) {
    console.error("Terjadi kesalahan saat mengurutkan data:", err.message);
  }

  // async function hasil_sorting(data_sort) {
  //   console.log("\n========= HASIL SORTING ==========");
  //   console.table(data_sort);

  //   const { action } = await inquirer.prompt([
  //     {
  //       type: "list",
  //       name: "action",
  //       message: "Simpan hasil sorting?",
  //       choices: ["Simpan hasil sorting ke file", "Jangan simpan"],
  //     },
  //   ]);

  //   // KONFIRMASI AKSI -----------------------------------------------------------------------------------------------------
  //   if (action === "Simpan hasil sorting ke file") {
  //     const { confirm_action } = await inquirer.prompt([
  //       {
  //         type: "confirm",
  //         name: "confirm_action",
  //         message:
  //           "Apakah anda yakin ingin menyimpan data hasil sorting ke file? (Aksi ini akan menimpa semua data sebelumnya)",
  //       },
  //     ]);
  //     // -------------------------------------------------------------------------------------------------------------------

  //     if (confirm_action) {
  //       data = data_sort;
  //       write_data();
  //     } else {
  //       console.log("Aksi dibatalkan. Data tidak disimpan.");
  //     }
  //   } else {
  //     console.log("Data tidak disimpan.");
  //   }
  // }

  // console.log("========= URUTKAN DATA BERDASARKAN ID ========");
  // const { menu } = await inquirer.prompt([
  //   {
  //     type: "list",
  //     name: "menu",
  //     message: "Pilih arah pengurutan data : ",
  //     choices: ["Ascending (A-Z)", "Descending (Z-A)", "Kembali"],
  //   },
  // ]);

  // switch (menu) {
  //   case "Ascending (A-Z)": {
  //     console.log("\n");
  //     const data_sort = [...data].sort((a, b) => a.ID.localeCompare(b.ID));
  //     await hasil_sorting(data_sort);
  //     console.log("\n");
  //     break;
  //   }

  //   case "Descending (Z-A)": {
  //     console.log("\n");
  //     const data_sort = [...data].sort((a, b) => b.ID.localeCompare(a.ID));
  //     await hasil_sorting(data_sort);
  //     console.log("\n");
  //     break;
  //   }

  //   case "Kembali": {
  //     return;
  //   }
  // }
}
// ================================================================================================

// EDIT DATA KARYAWAN =============================================================================
async function edit_data() {
  console.log("========== EDIT DATA KARYAWAN ==========");

  try {
    const { search_by } = await inquirer.prompt([
      {
        type: "list",
        name: "search_by",
        message: "Cari karyawan berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    let matches = [];

    if (search_by === "ID") {
      const { id_query } = await inquirer.prompt([
        {
          type: "input",
          name: "id_query",
          message: "Masukkan ID karyawan :",
          validate: (val) => {
            if (!val.trim()) {
              return "ID tidak boleh kosong!";
            }
            return true;
          },
        },
      ]);

      matches = data.filter(
        (k) => k.ID.toLowerCase() === id_query.trim().toLowerCase()
      );
    } else {
      const { name_query } = await inquirer.prompt([
        {
          type: "input",
          name: "name_query",
          message: "Masukkan nama :",
          validate: (val) => {
            if (!val.trim()) {
              return "Nama tidak boleh kosong!";
            }
            return true;
          },
        },
      ]);

      const key = name_query.trim().toLowerCase();
      matches = data.filter((k) => k.NAMA.toLowerCase().includes(key));
    }

    if (matches.length === 0) {
      console.log("Data tidak ditemukan.");
      return;
    }

    const { chosen } = await inquirer.prompt([
      {
        type: "list",
        name: "chosen",
        message: "Pilih data yang ingin diedit:",
        choices: matches.map((k) => ({
          name: `${k.ID} | ${k.NAMA} | ${k.JABATAN} | ${k.TELP}`,
          value: k.ID,
        })),
      },
    ]);

    const selected_index = data.findIndex((k) => k.ID === chosen);

    if (selected_index === -1) {
      console.log("Data yang dipilih tidak ditemukan.");
      return;
    }

    const current = data[selected_index];
    console.log("Data saat ini :", current);

    const { ID, NAMA, JABATAN, TELP } = await inquirer.prompt([
      {
        type: "input",
        name: "ID",
        message: `Masukkan ID baru (kosongkan untuk tetap "${current.ID}") :`,
        validate: (val) => {
          const t = val.trim();
          if (!t) {
            return true;
          }
          if (!/^[A-Za-z0-9]+$/.test(t)) {
            return "ID hanya boleh huruf dan angka!";
          }
          const exists = data.some(
            (k, idx) =>
              idx !== selected_index && k.ID.toLowerCase() === t.toLowerCase()
          );
          if (exists) {
            return "ID sudah digunakan!";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "NAMA",
        message: `Masukkan nama baru (kosongkan untuk tetap "${current.NAMA}") :`,
      },
      {
        type: "input",
        name: "JABATAN",
        message: `Masukkan jabatan baru (kosongkan untuk tetap "${current.JABATAN}") :`,
      },
      {
        type: "input",
        name: "TELP",
        message: `Masukkan no telp baru (kosongkan untuk tetap "${current.TELP}") :`,
        validate: (val) => {
          const t = val.trim();
          if (!t) {
            return true;
          }
          if (!/^[0-9]+$/.test(t)) {
            return "Nomor telepon hanya boleh angka!";
          }
          return true;
        },
      },
    ]);

    const { confirm } = await inquirer.prompt([
      { type: "confirm", name: "confirm", message: "Simpan perubahan?" },
    ]);

    if (!confirm) {
      console.log("Perubahan dibatalkan.");
      return;
    }

    data[selected_index] = {
      ID: ID && ID.trim() ? ID.trim().toUpperCase() : current.ID,
      NAMA: NAMA && NAMA.trim() ? NAMA.trim() : current.NAMA,
      JABATAN: JABATAN && JABATAN.trim() ? JABATAN.trim() : current.JABATAN,
      TELP: TELP && TELP.trim() ? TELP.trim() : current.TELP,
    };

    write_data();
    backup_data();

    console.log("Data karyawan berhasil diperbarui.");
  } catch (err) {
    console.error("Terjadi kesalahan saat mengedit data:", err.message);
  }

  // console.log("========== EDIT DATA KARYAWAN ==========");

  // const { methode } = await inquirer.prompt([
  //   {
  //     type: "list",
  //     name: "methode",
  //     message: "Pilih metode pencarian data yang akan diedit : ",
  //     choices: ["Berdasarkan ID", "Berdasarkan Nama", "Batal"],
  //   },
  // ]);

  // if (methode === "Batal") {
  //   return;
  // }

  // let find_data = null;

  // switch (methode) {
  //   case "Berdasarkan ID": {
  //     const { cari_id } = await inquirer.prompt([
  //       { name: "cari_id", message: "Masukkan ID karyawan : " },
  //     ]);

  //     find_data = data.find(
  //       (item) => item.ID.toLowerCase() === cari_id.trim().toLowerCase()
  //     );
  //     break;
  //   }

  //   case "Berdasarkan Nama": {
  //     const { cari_nama } = await inquirer.prompt([
  //       { name: "cari_nama", message: "Masukkan nama karyawan : " },
  //     ]);

  //     const hasil = data.filter((item) =>
  //       item.NAMA.toLowerCase().includes(cari_nama.trim().toLowerCase())
  //     );

  //     if (hasil.length === 0) {
  //       console.log("Data tidak ditemukan.");
  //       return;
  //     }

  //     const { selected } = await inquirer.prompt([
  //       {
  //         type: "list",
  //         name: "selected",
  //         message: "Pilih data yang ingin diedit : ",
  //         choices: hasil.map((item) => `${item.ID} - ${item.NAMA}`),
  //       },
  //     ]);

  //     const id_terpilih = selected.split(" - ")[0];
  //     find_data = data.find((item) => item.ID === id_terpilih);
  //     break;
  //   }
  // }

  // if (!find_data) {
  //   console.log("Data tidak ditemukan.");
  //   return;
  // }

  // console.log("========== DATA YANG AKAN DIEDIT ==========");
  // console.table([find_data]);

  // const hasil_edit = await inquirer.prompt([
  //   {
  //     name: "ID",
  //     message: `ID baru [ENTER jika tidak ingin mengubah] (${find_data.ID}) : `,
  //   },
  //   {
  //     name: "NAMA",
  //     message: `Nama baru [ENTER jika tidak ingin mengubah] (${find_data.NAMA}) : `,
  //   },
  //   {
  //     name: "JABATAN",
  //     message: `Jabatan baru [ENTER jika tidak ingin mengubah] (${find_data.JABATAN}) : `,
  //   },
  //   {
  //     name: "TELP",
  //     message: `No. Telp baru [ENTER jika tidak ingin mengubah] (${find_data.TELP}) : `,
  //   },
  // ]);

  // // SIMPAN PERUBAHAN JIKA FIELD TIDAK KOSONG -----------------------
  // const new_ID = hasil_edit.ID.trim() || find_data.ID;
  // const new_NAMA = hasil_edit.NAMA.trim() || find_data.NAMA;
  // const new_JABATAN = hasil_edit.JABATAN.trim() || find_data.JABATAN;
  // const new_TELP = hasil_edit.TELP.trim() || find_data.TELP;
  // // ----------------------------------------------------------------

  // // VALIDASI ID DUPLIKAT JIKA ID DIGANTI ---------------------------------
  // if (new_ID !== find_data.ID && data.some((item) => item.ID === new_ID)) {
  //   console.log(`ID "${new_ID}" sudah digunakan.`);
  //   return;
  // }
  // // ----------------------------------------------------------------------

  // console.log("========== BERIKUT PERUBAHAN YANG AKAN DISIMPAN ==========");
  // console.table([
  //   {
  //     ID: new_ID,
  //     NAMA: new_NAMA,
  //     JABATAN: new_JABATAN,
  //     TELP: new_TELP,
  //   },
  // ]);

  // // KONFIRMASI SIMPAN ------------------------------------------------
  // const { save_confirm } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "save_confirm",
  //     message: "Apakah anda yakin ingin menyimpan perubahan ke file?",
  //   },
  // ]);

  // if (!save_confirm) {
  //   console.log("Perubahan dibatalkan. Tidak ada data yang disimpan.");
  //   return;
  // }
  // // ------------------------------------------------------------------

  // // SIMPAN PERUBAHAN KE ARRAY JIKA SETUJU ---
  // find_data.ID = new_ID;
  // find_data.NAMA = new_NAMA;
  // find_data.JABATAN = new_JABATAN;
  // find_data.TELP = new_TELP;
  // // -----------------------------------------

  // write_data();
}
// ================================================================================================

// HAPUS DATA KARYAWAN ============================================================================
async function delete_data() {
  console.log("========= HAPUS DATA KARYAWAN =========");

  try {
    const { search_by } = await inquirer.prompt([
      {
        type: "list",
        name: "search_by",
        message: "Cari data berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    let results = [];

    if (search_by === "ID") {
      const { search_id } = await inquirer.prompt([
        {
          type: "input",
          name: "search_id",
          message: "Masukkan ID karyawan:",
          validate: (val) => (val.trim() ? true : "ID tidak boleh kosong!"),
        },
      ]);

      results = data.filter(
        (karyawan) =>
          karyawan.ID.toLowerCase() === search_id.trim().toLowerCase()
      );
    } else {
      const { search_name } = await inquirer.prompt([
        {
          type: "input",
          name: "search_name",
          message: "Masukkan nama karyawan :",
          validate: (val) => (val.trim() ? true : "Nama tidak boleh kosong!"),
        },
      ]);

      results = data.filter((karyawan) =>
        karyawan.NAMA.toLowerCase().includes(search_name.trim().toLowerCase())
      );
    }

    if (results.length === 0) {
      console.log("Data karyawan tidak ditemukan.");
      return;
    }

    // Pilih data jika lebih dari satu hasil
    let target;
    if (results.length > 1) {
      const { pilih } = await inquirer.prompt([
        {
          type: "list",
          name: "pilih",
          message: "Pilih data yang ingin dihapus:",
          choices: results.map(
            (k) => `${k.ID} | ${k.NAMA} | ${k.JABATAN} | ${k.TELP}`
          ),
        },
      ]);
      target = results.find(
        (k) => `${k.ID} | ${k.NAMA} | ${k.JABATAN} | ${k.TELP}` === pilih
      );
    } else {
      target = results[0];
    }

    console.table([target]);

    const { konfirmasi } = await inquirer.prompt([
      {
        type: "confirm",
        name: "konfirmasi",
        message: "Apakah anda yakin ingin menghapus data ini?",
      },
    ]);

    if (!konfirmasi) {
      console.log("Penghapusan dibatalkan.");
      return;
    }

    // Hapus dari array data
    data = data.filter((karyawan) => karyawan.ID !== target.ID);

    // Simpan ke log (append)
    const log_file = "logs/deleted-log.json";
    let logs = [];
    if (fs.existsSync(log_file)) {
      try {
        const log_content = fs.readFileSync(log_file, "utf-8");
        logs = JSON.parse(log_content);
      } catch (err) {
        console.error("Gagal membaca log, membuat log baru.");
      }
    }
    logs.push({
      ...target,
      deleted_at: new Date().toISOString(),
    });

    fs.writeFileSync(log_file, JSON.stringify(logs, null, 2));
    console.log("Data telah ditambahkan ke log penghapusan.");

    // Simpan perubahan utama & backup
    write_data();
    backup_data();

    console.log("Data karyawan berhasil dihapus.");
  } catch (err) {
    console.error("Terjadi kesalahan saat menghapus data:", err.message);
  }

  // console.log("========== HAPUS DATA KARYAWAN ==========");

  // const { methode } = await inquirer.prompt([
  //   {
  //     type: "list",
  //     name: "methode",
  //     message: "Pilih metode pencarian data yang akan dihapus : ",
  //     choices: ["Berdasarkan ID", "Berdasarkan Nama", "Batal"],
  //   },
  // ]);

  // let target = null;

  // switch (methode) {
  //   case "Berdasarkan ID": {
  //     const { cari_id } = await inquirer.prompt([
  //       { name: "cari_id", message: "Masukkan ID karyawan : " },
  //     ]);

  //     target = data.find(
  //       (item) => item.ID.toLowerCase() === cari_id.trim().toLowerCase()
  //     );
  //     break;
  //   }

  //   case "Berdasarkan Nama": {
  //     const { cari_nama } = await inquirer.prompt([
  //       {
  //         name: "cari_nama",
  //         message: "Masukkan nama (atau sebagian) karyawan : ",
  //       },
  //     ]);

  //     const hasil = data.filter((item) =>
  //       item.NAMA.toLowerCase().includes(cari_nama.trim().toLowerCase())
  //     );

  //     if (hasil.length === 0) {
  //       console.log("Data tidak ditemukan.");
  //       return;
  //     }

  //     const { selected } = await inquirer.prompt([
  //       {
  //         type: "list",
  //         name: "selected",
  //         message: "Pilih data yang ingin dihapus : ",
  //         choices: hasil.map((item) => `${item.ID} - ${item.NAMA}`),
  //       },
  //     ]);

  //     const id_terpilih = selected.split(" - ")[0];
  //     target = data.find((item) => item.ID === id_terpilih);
  //     break;
  //   }

  //   case "Batal": {
  //     return;
  //   }
  // }

  // if (!target) {
  //   console.log("Data tidak ditemukan.");
  //   return;
  // }

  // console.log("========== DATA YANG AKAN DIHAPUS ==========");
  // console.table([target]);

  // // KONFIRMASI HAPUS -------------------------------------------
  // const { delete_confirm } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "delete_confirm",
  //     message: "Apakah anda yakin ingin menghapus data ini?",
  //   },
  // ]);

  // if (!delete_confirm) {
  //   console.log("Penghapusan dibatalkan.");
  //   return;
  // }

  // data = data.filter((item) => item.ID !== target.ID);
  // console.log(`Data dengan ID "${target.ID}" berhasil dihapus.`);
  // // ------------------------------------------------------------

  // // KONFIRMASI SIMPAN KE FILE SETELAH HAPUS DATA ----------------------------
  // const { save_delete } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "save_delete",
  //     message: "Apakah ingin menyimpan hasil penghapusan ke file?",
  //   },
  // ]);

  // if (save_delete) {
  //   try {
  //     write_data();

  //     let logs = [];
  //     if (fs.existsSync(log_path)) {
  //       const log_content = fs.readFileSync(log_path, "utf-8");
  //       logs = log_content ? JSON.parse(log_content) : [];
  //     }
  //     logs.push(target);
  //     fs.writeFileSync(log_path, JSON.stringify(logs, null, 2));

  //     console.log("File telah diperbarui setelah penghapusan.");
  //     console.log(
  //       "Data yang terhapus telah dicatat di logs/data-terhapus.json"
  //     );
  //   } catch (err) {
  //     console.error("Gagal menyimpan file.", err.message);
  //   }
  // } else {
  //   console.log("Data di file tidak diubah.");
  // }
  // -------------------------------------------------------------------------
}
// ================================================================================================

// MENAMPILKAN STATISTIK KARYAWAN =================================================================
function show_statistic() {
  if (!fs.existsSync(file_path)) {
    console.log("File data tidak ditemukan!");
    return;
  }

  let data;
  try {
    const content = fs.readFileSync(file_path, "utf-8").trim();
    data = content ? JSON.parse(content) : [];
  } catch (err) {
    console.error("Gagal membaca atau parsing file JSON:", err.message);
    return;
  }

  if (data.length === 0) {
    console.log("Data masih kosong!");
    return;
  }

  console.log("========== STATISTIK DATA KARYAWAN ==========");
  console.log("Total Data Karyawan:", data.length);

  // STATISTIK PER JABATAN ----------------------------------
  const per_jabatan = data.reduce((acc, k) => {
    const jabatan = k.JABATAN.trim().toUpperCase();
    acc[jabatan] = (acc[jabatan] || 0) + 1;
    return acc;
  }, {});
  console.table(
    Object.entries(per_jabatan).map(([jabatan, jumlah]) => ({
      Jabatan: jabatan,
      Jumlah: jumlah,
    }))
  );
  // --------------------------------------------------------

  // STATISTIK PER ID -------------------------------------
  const per_prefix = data.reduce((acc, k) => {
    const prefix = k.ID.trim().charAt(0).toUpperCase();
    acc[prefix] = (acc[prefix] || 0) + 1;
    return acc;
  }, {});
  console.table(
    Object.entries(per_prefix).map(([prefix, jumlah]) => ({
      PrefixID: prefix,
      Jumlah: jumlah,
    }))
  );
  // ------------------------------------------------------

  // const total = data.length;

  // // STATISTIK PER JABATAN --------------------------------
  // const per_jabatan = {};
  // data.forEach((item) => {
  //   const jabatan = item.JABATAN;
  //   per_jabatan[jabatan] = (per_jabatan[jabatan] || 0) + 1;
  // });
  // // ------------------------------------------------------

  // // STATISTIK PER AWALAN ID --------------------------------
  // const per_awalan_id = {};
  // data.forEach((item) => {
  //   const awalan = item.ID[0].toUpperCase();
  //   per_awalan_id[awalan] = (per_awalan_id[awalan] || 0) + 1;
  // });
  // // --------------------------------------------------------

  // console.log(`\nTotal Karyawan : ${total}`);

  // console.log("\nJumlah per Jabatan : ");
  // console.table(per_jabatan);

  // console.log("\nJumlah berdasarkan awalan ID : ");
  // console.table(per_awalan_id);
}
// ================================================================================================

// RESTORE DATA DARI BACKUP =======================================================================
async function restore_data() {
  console.log("========= RESTORE DATA DARI BACKUP =========");

  try {
    if (!fs.existsSync(backup_path)) {
      console.log("File backup tidak ditemukan.");
      return;
    }

    // Baca data backup
    let backup_data;
    try {
      const backup_content = fs.readFileSync(backup_path, "utf-8");
      backup_data = JSON.parse(backup_content);
    } catch (err) {
      console.error("Gagal membaca atau mem-parsing file backup:", err.message);
      return;
    }

    console.log(`Jumlah data di backup: ${backup_data.length}`);
    console.table(backup_data.slice(0, 5));

    const { restore_confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "restore_confirm",
        message:
          "Apakah anda yakin ingin merestore data dari backup? (Aksi ini akan menimpa semua data utama)",
      },
    ]);

    if (!restore_confirm) {
      console.log("Proses restore dibatalkan.");
      return;
    }

    // Tulis ke file utama
    try {
      fs.writeFileSync(file_path, JSON.stringify(backup_data, null, 2));
      data = backup_data; // update data di memori
      console.log("Data berhasil direstore dari backup.");
    } catch (err) {
      console.error("Gagal menulis data ke file utama:", err.message);
    }
  } catch (err) {
    console.error("Terjadi kesalahan saat restore data:", err.message);
  }

  // console.log("========== RESTORE DATA DARI BACKUP ==========");

  // // CEK APAKAH BACKUP ADA ------------------------
  // if (!fs.existsSync(backup_path)) {
  //   console.warn("File backup tidak ditemukan");
  //   return;
  // }
  // // ----------------------------------------------

  // // KONFIRMASI PERTAMA -----------------------------------------------------------------------------
  // const { confirm_action } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "confirm_action",
  //     message:
  //       "[PERINGATAN] File backup akan menimpa file utama. Apakah Anda yakin ingin melanjutkan?",
  //   },
  // ]);
  // // ------------------------------------------------------------------------------------------------

  // if (!confirm_action) {
  //   console.log("Restore Data dibatalkan.");
  //   return;
  // }

  // // KONFIRMASI KEDUA ---------------------------------------------------
  // const { double_confirm_action } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     name: "double_confirm_action",
  //     message: "Apakah kamu yakin ingin mengembalikan data dari backup?",
  //   },
  // ]);
  // // --------------------------------------------------------------------

  // if (!double_confirm_action) {
  //   console.log("Restore Data dibatalkan.");
  //   return;
  // }

  // // SETELAH KONFIRMASI -------------------------------------------------
  // try {
  //   fs.copyFileSync(backup_path, file_path);
  //   console.log(
  //     "Restore data berhasil.File Utama telah ditimpa dengan File Backup"
  //   );
  //   console.log(`${data.length} data berhasil dimuat dari backup.`);

  //   try {
  //     data = JSON.parse(fs.readFileSync(file_path, "utf-8")) || [];
  //     console.log(`${data.length} data berhasil dimuat dari backup`);
  //   } catch (err) {
  //     console.error("Gagal memuat data dari file backup", err.message);
  //   }
  // } catch (err) {
  //   console.error("Gagal melakukan restore", err.message);
  // }
  // --------------------------------------------------------------------
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
        "2. Tampilkan Statistik Data Karyawan",
        "3. Tambah Data Baru",
        "4. Urutkan Data",
        "5. Cari Karyawan",
        "6. Edit Data",
        "7. Hapus Data",
        "8. Restore Data dari Backup",
        "9. Keluar",
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

    case "2. Tampilkan Statistik Data Karyawan": {
      console.log("\n");
      show_statistic();
      console.log("\n");
      break;
    }

    case "3. Tambah Data Baru": {
      console.log("\n");
      await tambah_data();
      console.log("\n");
      break;
    }

    case "4. Urutkan Data": {
      console.log("\n");
      await sort_by_id();
      console.log("\n");
      break;
    }

    case "5. Cari Karyawan": {
      console.log("\n");
      await cari_data();
      console.log("\n");
      break;
    }

    case "6. Edit Data": {
      console.log("\n");
      await edit_data();
      console.log("\n");
      break;
    }

    case "7. Hapus Data": {
      console.log("\n");
      await delete_data();
      console.log("\n");
      break;
    }

    case "8. Restore Data dari Backup": {
      console.log("\n");
      await restore_data();
      console.log("\n");
      break;
    }

    case "9. Keluar": {
      console.log("\n");
      console.log("Keluar dari program.");
      process.exit();
    }
  }

  await main_menu();
}
// ================================================================================================

main_menu();
