# 🗂️ Employee Data Management App - Node.js CLI Based

A feature-rich CLI (Command Line Interface) application for managing employee data using **JavaScript (Node.js)**. This app is a **rewrite and improvement** of my previous project written in **C++**, with added enhancements like bulk input, interactive editing, real file persistence, and modular design.

---

## 📌 Project Description

This project simulates a basic employee database management system that runs entirely in the terminal. It's designed for learning purposes, suitable for beginner-to-intermediate developers who want to understand:

- How to structure CLI apps in Node.js
- How to manage JSON-file-based data without a database
- How to modularize code and separate logic
- How to mimic real-world HR-like data operations

---

## 🧬 Origin & Reference

This Node.js project is a **refactored and modernized version** of my previous C++ project:

### 🔁 Rewritten From:
- [Project-Algoritma-Pemrograman](https://github.com/Nekonepan/College/tree/main/C%2B%2B/Project-Algoritma-Pemrograman)

### 🎯 Enhancements Compared to C++ Version:

| Feature              | C++ Version                   | Node.js Version                               |
|----------------------|-------------------------------|-----------------------------------------------|
| Save to File         | ✅ TXT                       | ✅ JSON (Array of Objects)                    |
| Employee Input       | ✅ Manual                    | ✅ Single & Bulk Input                        |
| ID / Name Search     | ✅ Only by ID                | ✅ By ID & Name (with list selection)         |
| Edit Data            | ❌ None                      | ✅ Full interactive editing                   |
| Sort Data            | ✅ Yes (no persistence)      | ✅ With option to save results to file        |
| Table View           | ✅ Static                    | ✅ Dynamic with `console.table()`             |
| Input Validation     | ❌ Very limited              | ✅ Rich & interactive validation              |
| Log Deleted Data     | ❌ None                      | ✅ Yes (`logs/deleted-logs.json`)             |
| Backup               | ❌ None                      | ✅ Yes (`backup/data-karyawan-backup.json`)   |
| Restore              | ❌ None                      | ✅ Yes (from backup file with confirmation)   |

---

## ⚙️ Setup Requirements

- ✅ Node.js installed (v14+ recommended)
- ✅ Basic terminal or command prompt
- ✅ (Optional) Text editor like VS Code

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

## 📂 Folder Structure

```
|-- main.js                          # Main application logic
|-- data/
    |-- data-karyawan.json           # Primary employee data file
|-- backup/
    |-- data-karyawan-backup.json    # Backup file
├── logs/
    |-- deleted-logs.json            # Log of deleted employee data
├── package.json                     # Metadata and dependencies
└── node_modules/                    # Installed dependencies
```

---

## ✅ Features Implemented

| Feature                                               | Status |
|-------------------------------------------------------|--------|
| Input single & multiple data entries                  | ✅    |
| Edit data with summary & confirmation                 | ✅    |
| Search by ID or Name (list selection if duplicate)    | ✅    |
| Sort data by ID (ascending/descending, optional save) | ✅    |
| Empty field validation & interactive prompts          | ✅    |
| Confirm before save or restore                        | ✅    |
| Modularized functions per feature                     | ✅    |
| File backup (JSON) & deleted data logging             | ✅    |


---

## ⚙️ How the App Works

Here’s a simplified breakdown of the logic flow behind the app:

1. 📂 **Program loads existing employee data** from `data-karyawan.json` at startup.
2. 📜 A **main menu** is displayed using `inquirer`, with options like View, Add, Search, Edit, Sort, Statistics, Backup/Restore, and Exit.
3. 📥 When adding data:
   - User is asked how many records to add (input `0` = cancel)
   - Each input is validated (non-empty, unique ID)
   - Data is optionally saved after confirmation
4. 🔍 When searching:
   - User can search by ID or Name (case-insensitive, partial match supported)
   - If multiple results are found (e.g., duplicate names), a list is displayed to select the correct record
5. ✏️ When editing:
   - User selects data from search results (by ID or Name)
   - Empty inputs are ignored (retain original value)
   - A summary table is shown after edit
   - Confirmation is required before saving
6. 🔃 When sorting:
   - User can choose Ascending or Descending by ID
   - Sorted result can be saved or discarded
7. 📊 Statistics:
   - Show total employee count
   - Group employees by job position
   - Count employees by ID prefix
8. 📁 Data is stored persistently in **JSON format** for easier read/write operations, backups, and logs.

The application runs in a loop until the user chooses to exit.


---

## 📝 Data Format

Data is stored in the `data-karyawan.json` file with the format:

```json
[
  {
    "ID": "A123",
    "NAMA": "Nekonepan",
    "JABATAN": "Manager",
    "TELP": "081234567890"
  },
  {
    "ID": "B321",
    "NAMA": "Lutfan Alaudin",
    "JABATAN": "HRD",
    "TELP": "080987654321"
  }
]
```

- Data is structured as an array of objects
- Each object represents one employee record
- This format makes it easier to read, write, backup, and restore data

Deleted data is stored in `logs/data-terhapus.json` with the format:

```json
[
  {
    "ID": "H739",
    "NAMA": "Farhan Wulandari",
    "JABATAN": "Supervisor",
    "TELP": "08323250265",
    "deletedAt": "2025-08-18T10:30:45.123Z"
  }
]
```

- Each deleted record is logged with the same structure as the main data
- An additional field `"deletedAt"` records the exact time the deletion occurred

---

## 📊 Summary & Takeaways

- 🔧 Implemented **modular practices** in a Node.js CLI application  
- 💾 Built a **CRUD system without a database**, using JSON file persistence  
- 🧠 Focused on **algorithmic logic** and data handling, not UI/Frontend  
- 🧰 Migrated from **procedural C++ (TXT storage)** → **modular JavaScript (JSON storage)**  
- 📁 Added features: **backup system** and **deletion logs with timestamp**  
- ✅ Finished with clean documentation, maintainable structure, and extensible design  

---

## 🌱 Potential Future Enhancements

| Development Ideas                        | Status  |
|------------------------------------------|---------|
| 🔒 Add login system & user access rights | ⏺️ ToDo |
| 🧾 Export employee data to CSV/Excel     | ⏺️ ToDo |
| 🌐 Migrate backend to Express + MongoDB  | ⏺️ ToDo |
| 📦 Publish as a global CLI via `npm`     | ⏺️ ToDo |
| 🧪 Add unit testing with Jest            | ⏺️ ToDo |

> "These are planned features for future versions"

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