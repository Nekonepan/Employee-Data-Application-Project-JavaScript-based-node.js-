const prompt = require('prompt-sync')();
const inquirer = require('inquirer');
const fs = require('fs');
const { type } = require('os');

const isi_file = fs.readFileSync('data-karyawan.txt', 'utf-8');
const baris = isi_file.trim().split('\n');

let data = [];

for (let i = 0; i < baris.length; i++) {
  let kolom = baris[i].split('|');

  data.push({
    ID: kolom[0],
    NAMA: kolom[1],
    JABATAN: kolom[2],
    TELP: kolom[3]
  });
}

async function main_menu() {
  const { menu } = await inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'Pilih Menu : ',
      choices: [
        'Tampilkan Semua Data',
        'Tambah Data Baru',
        'Cari Karyawan',
        'Keluar'
      ]
    }
  ]);

  switch (menu) {
    case 'Tampilkan Semua Data':
      tampilkan_data();
      break;

    case 'Tambah Data Baru':
      tambah_data();
      break;

    case 'Cari Karyawan':
      cari_data();
      break;

    case 'Keluar':
      console.log('Keluar dari program.');
      process.exit();
  }

  await main_menu();
}

main_menu();

function tampilkan_data() {
  console.log("Data Karyawan : ");
}

async function tambah_data() {
  console.log("Untuk Tambah Data");
}

async function cari_data() {
  console.log("Untuk Cari Data");
}