# PS 17 — Employee Management
## Console-Based Menu-Driven Apex CRUD

**Fields:** Emp ID, Name, Email, Birth Date, Department  
**Object:** `Employee__c`  
**Apex Class:** `EmployeeManager`  
**How to run:** Developer Console → Execute Anonymous Window

---

## Table of Contents
1. [What You Will Build](#what-you-will-build)
2. [Part A — Create Custom Object](#part-a--create-custom-object)
3. [Part B — Add Custom Fields](#part-b--add-custom-fields)
4. [Part C — Create Apex Class](#part-c--create-apex-class)
5. [Part D — Run from Execute Anonymous](#part-d--run-from-execute-anonymous)
6. [Part E — How to See Output](#part-e--how-to-see-output)
7. [Full Code](#full-code)
8. [Code Explanation](#code-explanation)
9. [Cheat Sheet](#cheat-sheet)

---

## What You Will Build

An Apex class with 4 static methods — one for each CRUD operation:

| Method | Operation | What it does |
|--------|-----------|-------------|
| `createEmployee(...)` | CREATE | Inserts a new employee record |
| `readAllEmployees()` | READ | Prints all employees to the debug log |
| `updateEmployee(...)` | UPDATE | Finds by Emp ID and updates the record |
| `deleteEmployee(...)` | DELETE | Finds by Emp ID and deletes the record |

You call these from the **Execute Anonymous** window in Developer Console — this is the "console-based menu".

---

## Part A — Create Custom Object

1. Click **gear icon (⚙️)** → **Setup**
2. In Setup search bar type: `Object Manager`
3. Click **Object Manager**
4. Click **Create** dropdown (top right) → **Custom Object**
5. Fill in:
   - **Label:** `Employee`
   - **Plural Label:** `Employees`
   - **Object Name:** `Employee` ← auto-filled, leave it
6. Scroll down → click **Save**

> You are now on the Employee object page. Stay here for Part B.

---

## Part B — Add Custom Fields

Click **Fields & Relationships** in the left sidebar.

### Field 1 — Emp ID

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Emp ID`
   - **Field Name:** `Emp_ID` (auto-filled)
   - **Length:** `20`
4. Click **Next → Next → Save**

### Field 2 — Email

1. Click **New**
2. Data type: **Email** → **Next**
3. Fill in:
   - **Field Label:** `Email`
   - **Field Name:** `Email` (auto-filled)
4. Click **Next → Next → Save**

### Field 3 — Birth Date

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Birth Date`
   - **Field Name:** `Birth_Date` (auto-filled)
4. Click **Next → Next → Save**

### Field 4 — Department

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Department`
   - **Field Name:** `Department` (auto-filled)
   - **Length:** `50`
4. Click **Next → Next → Save**

> Your object now has these API field names:
> - `Name` (standard — used as employee name, no `__c`)
> - `Emp_ID__c`
> - `Email__c`
> - `Birth_Date__c`
> - `Department__c`

---

## Part C — Create Apex Class

1. Click **gear icon → Developer Console**
2. **File → New → Apex Class**
3. Name: `EmployeeManager` → **OK**
4. Delete all existing code and paste:

```apex
public class EmployeeManager {

    // CREATE
    public static void createEmployee(String empId, String name, String email,
                                      Date birthDate, String department) {
        Employee__c emp = new Employee__c();
        emp.Emp_ID__c     = empId;
        emp.Name          = name;
        emp.Email__c      = email;
        emp.Birth_Date__c = birthDate;
        emp.Department__c = department;
        insert emp;
        System.debug('SUCCESS: Employee created — ' + name);
    }

    // READ ALL
    public static void readAllEmployees() {
        List<Employee__c> empList = [SELECT Emp_ID__c, Name, Email__c,
                                            Birth_Date__c, Department__c
                                     FROM Employee__c
                                     ORDER BY Name];
        if (empList.isEmpty()) {
            System.debug('No employees found.');
            return;
        }
        for (Employee__c e : empList) {
            System.debug(
                'ID: '   + e.Emp_ID__c     + ' | ' +
                'Name: ' + e.Name          + ' | ' +
                'Email: '+ e.Email__c      + ' | ' +
                'DOB: '  + e.Birth_Date__c + ' | ' +
                'Dept: ' + e.Department__c
            );
        }
    }

    // UPDATE
    public static void updateEmployee(String empId, String newName, String newEmail,
                                      Date newBirthDate, String newDepartment) {
        List<Employee__c> empList = [SELECT Id, Name, Email__c, Birth_Date__c, Department__c
                                     FROM Employee__c
                                     WHERE Emp_ID__c = :empId];
        if (empList.isEmpty()) {
            System.debug('ERROR: No employee found with ID — ' + empId);
            return;
        }
        Employee__c emp   = empList[0];
        emp.Name          = newName;
        emp.Email__c      = newEmail;
        emp.Birth_Date__c = newBirthDate;
        emp.Department__c = newDepartment;
        update emp;
        System.debug('SUCCESS: Employee updated — ' + newName);
    }

    // DELETE
    public static void deleteEmployee(String empId) {
        List<Employee__c> empList = [SELECT Id, Name
                                     FROM Employee__c
                                     WHERE Emp_ID__c = :empId];
        if (empList.isEmpty()) {
            System.debug('ERROR: No employee found with ID — ' + empId);
            return;
        }
        String name = empList[0].Name;
        delete empList[0];
        System.debug('SUCCESS: Employee deleted — ' + name);
    }
}
```

5. Press **Ctrl + S** to save

---

## Part D — Run from Execute Anonymous

This is the "console-based menu". You open a window, paste a command, and execute it.

### Open Execute Anonymous Window

1. In Developer Console: **Debug → Open Execute Anonymous Window**
2. A small editor window opens
3. Paste ONE block of code at a time → click **Execute**

### Menu — Pick the operation you want:

#### CREATE — Add a new employee
```apex
EmployeeManager.createEmployee(
    'E001',
    'John Doe',
    'john@gmail.com',
    Date.newInstance(1990, 5, 15),
    'IT'
);
```

#### READ — See all employees
```apex
EmployeeManager.readAllEmployees();
```

#### UPDATE — Change an existing employee
```apex
EmployeeManager.updateEmployee(
    'E001',
    'Jane Doe',
    'jane@gmail.com',
    Date.newInstance(1992, 8, 20),
    'HR'
);
```

#### DELETE — Remove an employee
```apex
EmployeeManager.deleteEmployee('E001');
```

> Run them in order: CREATE → READ → UPDATE → READ again → DELETE → READ again  
> This proves all operations work correctly.

---

## Part E — How to See Output

After clicking **Execute**, the output goes to the **debug log**.

### Steps to read the output:
1. After clicking Execute, a **Logs** tab appears at the bottom of Developer Console
2. Double-click the **latest log entry** (top of the list)
3. In the log viewer, check the **"Debug Only"** checkbox on the left panel
4. You will see only your `System.debug(...)` lines

### What the output looks like:

**After CREATE:**
```
USER_DEBUG [10]|DEBUG|SUCCESS: Employee created — John Doe
```

**After READ:**
```
USER_DEBUG [25]|DEBUG|ID: E001 | Name: John Doe | Email: john@gmail.com | DOB: 1990-05-15 | Dept: IT
```

**After UPDATE:**
```
USER_DEBUG [44]|DEBUG|SUCCESS: Employee updated — Jane Doe
```

**After DELETE:**
```
USER_DEBUG [57]|DEBUG|SUCCESS: Employee deleted — Jane Doe
```

---

## Full Code

### EmployeeManager.cls

```apex
public class EmployeeManager {

    // CREATE
    public static void createEmployee(String empId, String name, String email,
                                      Date birthDate, String department) {
        Employee__c emp = new Employee__c();
        emp.Emp_ID__c     = empId;
        emp.Name          = name;
        emp.Email__c      = email;
        emp.Birth_Date__c = birthDate;
        emp.Department__c = department;
        insert emp;
        System.debug('SUCCESS: Employee created — ' + name);
    }

    // READ ALL
    public static void readAllEmployees() {
        List<Employee__c> empList = [SELECT Emp_ID__c, Name, Email__c,
                                            Birth_Date__c, Department__c
                                     FROM Employee__c
                                     ORDER BY Name];
        if (empList.isEmpty()) {
            System.debug('No employees found.');
            return;
        }
        for (Employee__c e : empList) {
            System.debug(
                'ID: '   + e.Emp_ID__c     + ' | ' +
                'Name: ' + e.Name          + ' | ' +
                'Email: '+ e.Email__c      + ' | ' +
                'DOB: '  + e.Birth_Date__c + ' | ' +
                'Dept: ' + e.Department__c
            );
        }
    }

    // UPDATE
    public static void updateEmployee(String empId, String newName, String newEmail,
                                      Date newBirthDate, String newDepartment) {
        List<Employee__c> empList = [SELECT Id, Name, Email__c, Birth_Date__c, Department__c
                                     FROM Employee__c
                                     WHERE Emp_ID__c = :empId];
        if (empList.isEmpty()) {
            System.debug('ERROR: No employee found with ID — ' + empId);
            return;
        }
        Employee__c emp   = empList[0];
        emp.Name          = newName;
        emp.Email__c      = newEmail;
        emp.Birth_Date__c = newBirthDate;
        emp.Department__c = newDepartment;
        update emp;
        System.debug('SUCCESS: Employee updated — ' + newName);
    }

    // DELETE
    public static void deleteEmployee(String empId) {
        List<Employee__c> empList = [SELECT Id, Name
                                     FROM Employee__c
                                     WHERE Emp_ID__c = :empId];
        if (empList.isEmpty()) {
            System.debug('ERROR: No employee found with ID — ' + empId);
            return;
        }
        String name = empList[0].Name;
        delete empList[0];
        System.debug('SUCCESS: Employee deleted — ' + name);
    }
}
```

---

## Code Explanation

### Why `static`?

`public static void` means you call the method **without creating an object** of the class:
```apex
EmployeeManager.createEmployee(...);   // static — no "new" needed
```
If it were not static, you'd need:
```apex
EmployeeManager em = new EmployeeManager();
em.createEmployee(...);               // instance method
```
Static is simpler for console-based use.

### CREATE breakdown

```apex
Employee__c emp = new Employee__c();   // create empty record object
emp.Emp_ID__c = empId;                 // set each field
emp.Name = name;                       // Name is standard, no __c
emp.Email__c = email;
emp.Birth_Date__c = birthDate;
emp.Department__c = department;
insert emp;                            // save to database
System.debug('SUCCESS: ...');          // print confirmation
```

### READ breakdown

```apex
List<Employee__c> empList = [SELECT ... FROM Employee__c ORDER BY Name];
// SOQL query — returns a list of records

if (empList.isEmpty()) { ... return; }
// Check if list is empty before looping

for (Employee__c e : empList) {
    System.debug('ID: ' + e.Emp_ID__c + ' | Name: ' + e.Name + ...);
}
// Loop through each record and print to debug log
```

### UPDATE breakdown

```apex
List<Employee__c> empList = [SELECT Id ... FROM Employee__c WHERE Emp_ID__c = :empId];
// Find by Emp ID — the colon : binds the Apex variable

if (empList.isEmpty()) { ... return; }
// Error check

Employee__c emp = empList[0];          // get first (and only) result
emp.Name = newName;                    // update fields
update emp;                            // save changes to database
```

### DELETE breakdown

```apex
List<Employee__c> empList = [SELECT Id, Name FROM Employee__c WHERE Emp_ID__c = :empId];
if (empList.isEmpty()) { ... return; }
String name = empList[0].Name;         // save name for the success message
delete empList[0];                     // delete the record
System.debug('SUCCESS: ... ' + name); // confirm deletion
```

### Date.newInstance()

```apex
Date.newInstance(1990, 5, 15)
// Creates a Date object: year=1990, month=5, day=15 → 1990-05-15
```

---

## Cheat Sheet

```
STATIC METHOD CALL
  EmployeeManager.createEmployee('E001', 'John', 'j@g.com', Date.newInstance(1990,5,15), 'IT');
  ClassName.methodName(args);

DML OPERATIONS
  insert emp;          ← CREATE
  update emp;          ← UPDATE
  delete emp;          ← DELETE
  (READ uses SOQL, no DML keyword)

SOQL WITH VARIABLE BIND
  WHERE Emp_ID__c = :empId
  The colon : turns a SOQL string literal into an Apex variable reference

LIST + EMPTY CHECK PATTERN
  List<Employee__c> list = [SELECT ...];
  if (list.isEmpty()) { System.debug('Not found'); return; }
  Employee__c e = list[0];   ← get first item

DATE CREATION
  Date.newInstance(YYYY, MM, DD)

SYSTEM.DEBUG — output goes to log
  System.debug('your message here');
  View it: Logs tab → double-click log → check "Debug Only"
```

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Employee | Plural: Employees | Save

2. Fields & Relationships → New (do 4 times)
   Emp ID     → Text,  Length 20
   Email      → Email
   Birth Date → Date
   Department → Text,  Length 50

3. Developer Console → File → New → Apex Class
   Name: EmployeeManager → paste code → Ctrl+S

4. Debug → Open Execute Anonymous Window
   Paste one operation at a time → Execute

5. View output: Logs tab → double-click latest → check Debug Only
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Type not found: Employee__c` | Object not created | Create it in Object Manager |
| `Variable does not exist: Emp_ID__c` | Field not created | Add it in Fields & Relationships |
| `No employees found` on READ | Nothing inserted yet | Run CREATE first |
| `ERROR: No employee found with ID` | Wrong ID passed | Make sure ID matches what you created |
| Output not visible in log | Debug Only not checked | Click "Debug Only" in log viewer |
| `Compile error on static` | Missing `static` keyword | All methods must have `public static void` |
