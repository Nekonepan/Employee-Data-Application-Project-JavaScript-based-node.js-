const inquirer = require("inquirer");
const fs = require("fs");

const file_path = "data/data-karyawan.json";
const backup_path = "backup/data-karyawan-backup.json";
const log_path = "logs/data-terhapus.json";

let data = read_data();

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

if (!fs.existsSync(file_path)) {
  console.warn(`File "${file_path}" tidak ditemukan. Membuat file baru...`);
  fs.writeFileSync(file_path, "[]");
}

if (!fs.existsSync("backup")) {
  fs.mkdirSync("backup");
}

if (!fs.existsSync(backup_path)) {
  console.warn(`File "${backup_path}" tidak ditemukan. Membuat file baru...`);
  fs.writeFileSync(backup_path, "[]");
}

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

if (!fs.existsSync(log_path)) {
  console.warn(`File "${log_path}" tidak ditemukan. Membuat file baru...`);
  fs.writeFileSync(log_path, "[]");
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
  if (!fs.existsSync(file_path)) {
    console.log("File data tidak ditemukan!");
    return;
  }

  if (data.length === 0) {
    console.log("Data masih kosong!");
    return;
  }

  console.log("========== DATA KARYAWAN ==========");
  console.log("Jumlah Data : ", data.length);
  console.table(data);
}
// ================================================================================================

// TAMBAH DATA BARU ===============================================================================
async function tambah_data() {
  console.log("========== TAMBAH DATA BARU ==========");

  try {
    const { count: count_raw } = await inquirer.prompt([
      {
        type: "input",
        name: "count",
        message:
          "Masukkan jumlah data yang akan diinput. [MASUKKAN 0 UNTUK BATAL] : ",
        validate: (val) => {
          const n = parseInt(String(val).trim(), 10);
          if (Number.isNaN(n) || n < 0) {
            return "Masukkan angka >= 0";
          }
          return true;
        },
      },
    ]);

    const count = parseInt(String(count_raw).trim(), 10);

    // BATAL JIKA INPUT = 0 ----------------
    if (count === 0) {
      console.log("Input data dibatalkan.");
      return;
    }
    // -------------------------------------

    let new_data = [];

    for (let i = 0; i < count; i++) {
      console.log(`\nInput data karyawan ke-${i + 1}:`);

      const { ID, NAMA, JABATAN, TELP } = await inquirer.prompt([
        {
          type: "input",
          name: "ID",
          message: "Masukkan ID karyawan :",
          validate: (val) => {
            if (!val.trim()) {
              return "ID tidak boleh kosong!";
            }
            if (!/^[A-Za-z0-9]+$/.test(val)) {
              return "ID hanya boleh huruf & angka!";
            }
            if (
              data.some(
                (karyawan) => karyawan.ID.toUpperCase() === val.toUpperCase()
              ) ||
              new_data.some(
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
          message: "Masukkan nama karyawan :",
          validate: (val) => {
            return val.trim() ? true : "Nama tidak boleh kosong!";
          },
        },
        {
          type: "input",
          name: "JABATAN",
          message: "Masukkan jabatan karyawan :",
          validate: (val) => {
            return val.trim() ? true : "Jabatan tidak boleh kosong!";
          },
        },
        {
          type: "input",
          name: "TELP",
          message: "Masukkan no telp karyawan :",
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

      new_data.push({
        ID: ID.trim().toUpperCase(),
        NAMA: NAMA.trim(),
        JABATAN: JABATAN.trim(),
        TELP: TELP.trim(),
      });
    }

    // KONFIRMASI SIMPAN ---------------------------------------------------------
    const { save_confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "save_confirm",
        message: `\nApakah anda yakin ingin menyimpan ${new_data.length} data ini?`,
      },
    ]);

    if (!save_confirm) {
      console.log("Data batal disimpan.");
      return;
    }

    data.push(...new_data);
    write_data();
    backup_data();

    console.log(`${new_data.length} data berhasil disimpan.`);
  } catch (err) {
    console.error("Terjadi kesalahan saat menambahkan data:", err.message);
  }
  // -----------------------------------------------------------------------------
}
// ================================================================================================

// CARI DATA KARYAWAN =============================================================================
async function cari_data() {
  if (data.length === 0) {
    console.log("Data masih kosong!");
    return;
  }

  console.log("========== CARI DATA KARYAWAN ==========");

  try {
    const { tipe } = await inquirer.prompt([
      {
        type: "list",
        name: "tipe",
        message: "Cari berdasarkan:",
        choices: ["ID", "Nama"],
      },
    ]);

    // INPUT KATA KUNCI -------------------------------
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
    // ------------------------------------------------

    // KATA KUNCI DI LOWERCASE ------------------------
    const keyword_lower = keyword.trim().toLowerCase();
    // ------------------------------------------------

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
}
// ================================================================================================

// SORTING DATA BERDASARKAN ID KARYAWAN ===========================================================
async function sort_by_id() {
  if (data.length === 0) {
    console.log("Data masih kosong!");
    return;
  }

  console.log("========== URUTKAN DATA BERDASARKAN ID ==========");

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
      data_sort.sort((a, b) =>
        a.ID.toUpperCase().localeCompare(b.ID.toUpperCase())
      );
    } else {
      data_sort.sort((a, b) =>
        b.ID.toUpperCase().localeCompare(a.ID.toUpperCase())
      );
    }

    console.log("\n========== HASIL SORTING ==========");
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
}
// ================================================================================================

// EDIT DATA KARYAWAN =============================================================================
async function edit_data() {
  if (data.length === 0) {
    console.log("Data masih kosong!");
    return;
  }

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
    console.log("Data saat ini :");
    console.table(current);

    // INPUT EDIT DATA BARU ------------------------------------------------------------
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
    // ---------------------------------------------------------------------------------

    const updated = {
      ID: ID && ID.trim() ? ID.trim().toUpperCase() : current.ID,
      NAMA: NAMA && NAMA.trim() ? NAMA.trim() : current.NAMA,
      JABATAN: JABATAN && JABATAN.trim() ? JABATAN.trim() : current.JABATAN,
      TELP: TELP && TELP.trim() ? TELP.trim() : current.TELP,
    };

    console.log("Data sebelumnya : \n");
    console.log(console.table(current));

    console.log("Data setelah di edit : \n");
    console.log(console.table([updated]));

    // KONFIRMASI SIMPAN ---------------------------------------------------
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
  // -----------------------------------------------------------------------
}
// ================================================================================================

// HAPUS DATA KARYAWAN ============================================================================
async function delete_data() {
  if (data.length === 0) {
    console.log("Data masih kosong!");
    return;
  }

  console.log("========== HAPUS DATA KARYAWAN ==========");

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

    // PILIH DATA JIKA LEBIH DARI SATU HASIL ----------------------------
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
    // ------------------------------------------------------------------

    console.table([target]);

    // KONFIRMASI HAPUS -------------------------------------------------
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

    // HAPUS DARI ARRAY DATA -----------------------------------
    data = data.filter((karyawan) => karyawan.ID !== target.ID);
    // ---------------------------------------------------------

    // SIMPAN KE LOG ------------------------------------------
    let logs = [];
    if (fs.existsSync(log_path)) {
      try {
        const log_content = fs.readFileSync(log_path, "utf-8");
        logs = JSON.parse(log_content);
        if (!Array.isArray(logs)) {
          logs = [];
        }
      } catch (err) {
        console.error("Gagal membaca log, membuat log baru.");
      }
    }
    logs.push({
      ...target,
      deleted_at: new Date().toISOString(),
    });

    fs.writeFileSync(log_path, JSON.stringify(logs, null, 2));
    console.log("Data telah ditambahkan ke log penghapusan.");
    // --------------------------------------------------------

    write_data();
    backup_data();

    console.log("Data karyawan berhasil dihapus.");
  } catch (err) {
    console.error("Terjadi kesalahan saat menghapus data:", err.message);
  }
  // --------------------------------------------------------------------
}
// ================================================================================================

// MENAMPILKAN STATISTIK KARYAWAN =================================================================
function show_statistic() {
  if (!fs.existsSync(file_path)) {
    console.log("File data tidak ditemukan!");
    return;
  }

  let data = read_data();
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
      Prefix_ID: prefix,
      Jumlah: jumlah,
    }))
  );
  // ------------------------------------------------------
}
// ================================================================================================

// RESTORE DATA DARI BACKUP =======================================================================
async function restore_data() {
  try {
    if (!fs.existsSync(backup_path)) {
      console.log("File backup tidak ditemukan.");
      return;
    }

    let backup_pay_load;
    try {
      const backup_content = fs.readFileSync(backup_path, "utf-8");
      backup_pay_load = JSON.parse(backup_content);
      if (!Array.isArray(backup_pay_load)) {
        console.error("Format backup tidak valid (harus array!).");
        return;
      }
    } catch (err) {
      console.error("Gagal membaca atau mem-parsing file backup:", err.message);
      return;
    }

    if (!Array.isArray(backup_pay_load) || backup_pay_load.length === 0) {
      console.log("Data backup masih kosong!");
      return;
    }

    console.log("========== RESTORE DATA DARI BACKUP ==========");
    console.log(`Jumlah data di backup: ${backup_pay_load.length}`);
    console.table(backup_pay_load);

    // KONFIRMASI RESTORE -------------------------------------------------------------------------------
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

    // TULIS KE FILE UTAMA ---------------------------------------------
    try {
      fs.writeFileSync(file_path, JSON.stringify(backup_pay_load, null, 2));

      data = backup_pay_load;

      console.log("Data berhasil direstore dari backup.");
    } catch (err) {
      console.error("Gagal menulis data ke file utama:", err.message);
    }
  } catch (err) {
    console.error("Terjadi kesalahan saat restore data:", err.message);
  }
  // -------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------
}
// ================================================================================================

// MENU PILIHAN ===================================================================================
async function main_menu() {
  while (true) {
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
  }
}
// ================================================================================================

main_menu();
