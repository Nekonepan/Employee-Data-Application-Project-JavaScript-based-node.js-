# 🗂️ Employee Data Management App - Node.js CLI Based

A feature-rich CLI (Command Line Interface) application for managing employee data using **JavaScript (Node.js)**. This app is a **rewrite and improvement** of my previous project written in **C++**, with added enhancements like bulk input, interactive editing, real file persistence, and modular design.

---

## 📌 Project Description

This project simulates a basic employee database management system that runs entirely in the terminal. It's designed for learning purposes, suitable for beginner-to-intermediate developers who want to understand:

- How to structure CLI apps in Node.js
- How to manage text-file-based data without a database
- How to modularize code and separate logic
- How to mimic real-world HR-like data operations

---

## 🧬 Origin & Reference

This Node.js project is a **refactored and modernized version** of my previous C++ project:

### 🔁 Rewritten From:
- [Project-Algoritma-Pemrograman](https://github.com/Nekonepan/College/tree/main/C%2B%2B/Project-Algoritma-Pemrograman)

### 🎯 Enhancements Compared to C++ version:
| Feature                       | C++ Version                   | Node.js Version                  |
|-------------------------------|-------------------------------|----------------------------------|
| Save to File                  | ✅ TXT                       | ✅ TXT                           |
| Employee Input                | ✅ Manual                    | ✅ Multi-input                   |
| ID / Name Search              | ✅ (Just ID)                 | ✅ ID & Name                     |
| Edit Data                     | ❌ None                      | ✅ Yes                           |
| Sort Data                     | ✅ Yes (Without Saving Data) | ✅ With Saving Data              |
| Table View                    | ✅ Fixed                     | ✅ Flexible with console.table() |
| Input Validation              | ❌ Limited                   | ✅ Interactive                   |
| Backup / Log                  | ❌ None                      | ✅ Yes (Folder `logs/`)          |

---

## 🚀 How to Run the Project

### 1. **Clone this repository**
```
git clone https://github.com/Nekonepan/Employee-Data-Application-Project-JavaScript-based-node.js-.git
cd Employee-Data-Application-Project-JavaScript-based-node.js-
```
### 2. **Install dependencies**
```
npm install
```
### 3. **Run the app**
```
node main.js
```
> 📌 You'll be guided through an interactive menu system.
  
---

## ⚙️ Setup Requirements

- ✅ Node.js installed (v14+ recommended)
- ✅ Basic terminal or command prompt
- ✅ (Optional) Text editor like VS Code

---

## 📂 Folder Structure

```
├── main.js                   # Main application logic
├── data-karyawan.txt         # Primary employee data file
├── backup/                   # Folder for backups
├── logs/                     # Log of deleted or modified data
├── package.json              # Metadata and dependencies
└── node_modules/             # Installed dependencies
```

---

## ✅ Features Implemented

| Feature                           | Status   |
| ----------------------------------|----------|
| Input multiple data entries       | ✅      |
| Edit data with confirmation       | ✅      |
| Search by ID or Name              | ✅      |
| Sort (ascending/descending by ID) | ✅      |
| Validasi field kosong & format    | ✅      |
| Konfirmasi sebelum simpan         | ✅      |
| Modular functions per feature     | ✅      |
| File backup & logging             | ✅      |

---

## ⚙️ How the App Works

Here’s a simplified breakdown of the logic flow behind the app:

1. 📂 **Program loads existing employee data** from `data-karyawan.txt` at startup.
2. 📜 A **main menu** is displayed using `inquirer`, with options like View, Add, Search, Edit, Sort, and Exit.
3. 📥 When adding data:
   - User is asked how many records to add
   - Each input is validated (non-empty, phone format, unique ID)
   - Data is optionally saved after confirmation
4. 🔍 When searching:
   - User can search by ID or Name (case-insensitive, partial match supported)
5. ✏️ When editing:
   - User selects the data to edit
   - Empty inputs are ignored (retain original value)
   - Confirmation is required before saving
6. 🔃 When sorting:
   - User can choose Ascending or Descending by ID
   - Sorted result can be saved or discarded
7. 📁 Data is stored persistently in text format with `|` separators

The application runs in a loop until the user chooses to exit.

---

## 📝 Data Format

Data is stored in the `data-karyawan.txt` file with the format:
```
ID|NAMA|JABATAN|TELP
```

Example:
```
A123|Nekonepan|Manager|081234567890
B321|Lutfan Alaudin|HRD|080987654321
```

---

## 📊 Summary & Takeaways

- 🔧 Implementing modular practices in JavaScript CLI
- 💾 Simulating a CRUD system without a database
- 🧠 Focusing on algorithmic logic, not UI
- 🧰 Migrating from procedural C++ to modular JavaScript
- ✅ Finished with clean documentation and structure

---

## 🌱 Potential Future Enhancements

| Development Ideas                       | Status  |
|-----------------------------------------|---------|
| 🔒 Login & user access rights          | ⏺️ ToDo |
| 🧾 Export data to CSV or JSON          | ⏺️ ToDo |
| 🌐 Migrate to Express + MongoDB API    | ⏺️ ToDo |
| 📦 Create CLI global package via `npm` | ⏺️ ToDo |
| 🧪 Unit testing (Jest)                 | ⏺️ ToDo |

---

## 🙋 Author's Note

This project is currently marked as complete but may receive further updates.
Feel free to fork, remix, or use it for your own learning.

If you want to know what the previous version of C++ looked like before it was refactored into Node.js, you can look at these two files:
- [data-karyawan-alpro.cpp](https://github.com/Nekonepan/College/blob/main/C%2B%2B/Project-Algoritma-Pemrograman/Data-Karyawan/data-karyawan-alpro.cpp)
- [data-karyawan-alpro-array2D.cpp](https://github.com/Nekonepan/College/blob/main/C%2B%2B/Project-Algoritma-Pemrograman/Data-Karyawan-2D/data-karyawan-alpro-array2D.cpp)

---

## 🙏 Final Words

This project started as a simple C++ console app and has now evolved into a more modular, maintainable, and interactive CLI application using JavaScript and Node.js. It was built as a personal learning project, but it’s fully functional and easy to expand.

Whether you're here to learn, improve it, or just curious, thank you for stopping by!

If you like this project or find it useful, feel free to:

- ⭐ Star the repository
- 🛠️ Fork it and build your own version
- 📬 Reach out for questions or collaboration

# Happy coding! 💻✨
