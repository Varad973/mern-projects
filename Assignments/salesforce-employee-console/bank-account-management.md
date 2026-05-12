# PS 18 — Bank Account Management
## Console-Based Menu-Driven Apex CRUD

**Fields:** Account No, Account Holder Name, Email, Date of Opening, Branch  
**Object:** `Bank_Account__c`  
**Apex Class:** `BankAccountManager`  
**How to run:** Developer Console → Execute Anonymous Window

> **Note:** This assignment is structurally identical to PS 17 (Employee Management).  
> Only the object name, field names, and labels change. The Apex logic is the same.

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
| `createAccount(...)` | CREATE | Inserts a new bank account record |
| `readAllAccounts()` | READ | Prints all accounts to the debug log |
| `updateAccount(...)` | UPDATE | Finds by Account No and updates the record |
| `deleteAccount(...)` | DELETE | Finds by Account No and deletes the record |

---

## Part A — Create Custom Object

1. Click **gear icon (⚙️)** → **Setup**
2. In Setup search bar type: `Object Manager`
3. Click **Object Manager**
4. Click **Create** dropdown (top right) → **Custom Object**
5. Fill in:
   - **Label:** `Bank Account`
   - **Plural Label:** `Bank Accounts`
   - **Object Name:** `Bank_Account` ← auto-filled, leave it
6. Scroll down → click **Save**

---

## Part B — Add Custom Fields

Click **Fields & Relationships** in the left sidebar.

> `Name` standard field is used as **Account Holder Name** — no need to create it.

### Field 1 — Account No

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Account No`
   - **Field Name:** `Account_No` (auto-filled)
   - **Length:** `20`
4. Click **Next → Next → Save**

### Field 2 — Email

1. Click **New**
2. Data type: **Email** → **Next**
3. Fill in:
   - **Field Label:** `Email`
   - **Field Name:** `Email` (auto-filled)
4. Click **Next → Next → Save**

### Field 3 — Date of Opening

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Date of Opening`
   - **Field Name:** `Date_of_Opening` (auto-filled)
4. Click **Next → Next → Save**

### Field 4 — Branch

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Branch`
   - **Field Name:** `Branch` (auto-filled)
   - **Length:** `50`
4. Click **Next → Next → Save**

> Your object now has these API field names:
> - `Name` (standard — Account Holder Name, no `__c`)
> - `Account_No__c`
> - `Email__c`
> - `Date_of_Opening__c`
> - `Branch__c`

---

## Part C — Create Apex Class

1. Click **gear icon → Developer Console**
2. **File → New → Apex Class**
3. Name: `BankAccountManager` → **OK**
4. Delete all existing code and paste:

```apex
public class BankAccountManager {

    // CREATE
    public static void createAccount(String accountNo, String holderName, String email,
                                     Date dateOfOpening, String branch) {
        Bank_Account__c acc = new Bank_Account__c();
        acc.Account_No__c      = accountNo;
        acc.Name               = holderName;
        acc.Email__c           = email;
        acc.Date_of_Opening__c = dateOfOpening;
        acc.Branch__c          = branch;
        insert acc;
        System.debug('SUCCESS: Account created for — ' + holderName);
    }

    // READ ALL
    public static void readAllAccounts() {
        List<Bank_Account__c> accList = [SELECT Account_No__c, Name, Email__c,
                                                Date_of_Opening__c, Branch__c
                                         FROM Bank_Account__c
                                         ORDER BY Name];
        if (accList.isEmpty()) {
            System.debug('No accounts found.');
            return;
        }
        for (Bank_Account__c a : accList) {
            System.debug(
                'AccNo: '  + a.Account_No__c      + ' | ' +
                'Name: '   + a.Name               + ' | ' +
                'Email: '  + a.Email__c           + ' | ' +
                'Opened: ' + a.Date_of_Opening__c + ' | ' +
                'Branch: ' + a.Branch__c
            );
        }
    }

    // UPDATE
    public static void updateAccount(String accountNo, String newName, String newEmail,
                                     Date newDateOfOpening, String newBranch) {
        List<Bank_Account__c> accList = [SELECT Id, Name, Email__c, Date_of_Opening__c, Branch__c
                                         FROM Bank_Account__c
                                         WHERE Account_No__c = :accountNo];
        if (accList.isEmpty()) {
            System.debug('ERROR: No account found with Account No — ' + accountNo);
            return;
        }
        Bank_Account__c acc    = accList[0];
        acc.Name               = newName;
        acc.Email__c           = newEmail;
        acc.Date_of_Opening__c = newDateOfOpening;
        acc.Branch__c          = newBranch;
        update acc;
        System.debug('SUCCESS: Account updated for — ' + newName);
    }

    // DELETE
    public static void deleteAccount(String accountNo) {
        List<Bank_Account__c> accList = [SELECT Id, Name
                                         FROM Bank_Account__c
                                         WHERE Account_No__c = :accountNo];
        if (accList.isEmpty()) {
            System.debug('ERROR: No account found with Account No — ' + accountNo);
            return;
        }
        String name = accList[0].Name;
        delete accList[0];
        System.debug('SUCCESS: Account deleted for — ' + name);
    }
}
```

5. Press **Ctrl + S** to save

---

## Part D — Run from Execute Anonymous

### Open Execute Anonymous Window

1. In Developer Console: **Debug → Open Execute Anonymous Window**
2. Paste ONE block at a time → click **Execute**

### Menu — Pick the operation:

#### CREATE — Open a new account
```apex
BankAccountManager.createAccount(
    'ACC001',
    'Rahul Sharma',
    'rahul@gmail.com',
    Date.newInstance(2024, 1, 10),
    'Mumbai Main Branch'
);
```

#### READ — See all accounts
```apex
BankAccountManager.readAllAccounts();
```

#### UPDATE — Modify an existing account
```apex
BankAccountManager.updateAccount(
    'ACC001',
    'Rahul Kumar',
    'rahulkumar@gmail.com',
    Date.newInstance(2024, 1, 10),
    'Pune Branch'
);
```

#### DELETE — Close an account
```apex
BankAccountManager.deleteAccount('ACC001');
```

> Run in order: CREATE → READ → UPDATE → READ again → DELETE → READ again

---

## Part E — How to See Output

1. After clicking **Execute**, go to the **Logs** tab at bottom of Developer Console
2. **Double-click** the latest log entry
3. Check the **"Debug Only"** checkbox in the left panel
4. Your `System.debug(...)` messages appear clearly

### Sample Output:

**After CREATE:**
```
USER_DEBUG|SUCCESS: Account created for — Rahul Sharma
```

**After READ:**
```
USER_DEBUG|AccNo: ACC001 | Name: Rahul Sharma | Email: rahul@gmail.com | Opened: 2024-01-10 | Branch: Mumbai Main Branch
```

**After UPDATE:**
```
USER_DEBUG|SUCCESS: Account updated for — Rahul Kumar
```

**After DELETE:**
```
USER_DEBUG|SUCCESS: Account deleted for — Rahul Kumar
```

---

## Full Code

### BankAccountManager.cls

```apex
public class BankAccountManager {

    // CREATE
    public static void createAccount(String accountNo, String holderName, String email,
                                     Date dateOfOpening, String branch) {
        Bank_Account__c acc = new Bank_Account__c();
        acc.Account_No__c      = accountNo;
        acc.Name               = holderName;
        acc.Email__c           = email;
        acc.Date_of_Opening__c = dateOfOpening;
        acc.Branch__c          = branch;
        insert acc;
        System.debug('SUCCESS: Account created for — ' + holderName);
    }

    // READ ALL
    public static void readAllAccounts() {
        List<Bank_Account__c> accList = [SELECT Account_No__c, Name, Email__c,
                                                Date_of_Opening__c, Branch__c
                                         FROM Bank_Account__c
                                         ORDER BY Name];
        if (accList.isEmpty()) {
            System.debug('No accounts found.');
            return;
        }
        for (Bank_Account__c a : accList) {
            System.debug(
                'AccNo: '  + a.Account_No__c      + ' | ' +
                'Name: '   + a.Name               + ' | ' +
                'Email: '  + a.Email__c           + ' | ' +
                'Opened: ' + a.Date_of_Opening__c + ' | ' +
                'Branch: ' + a.Branch__c
            );
        }
    }

    // UPDATE
    public static void updateAccount(String accountNo, String newName, String newEmail,
                                     Date newDateOfOpening, String newBranch) {
        List<Bank_Account__c> accList = [SELECT Id, Name, Email__c, Date_of_Opening__c, Branch__c
                                         FROM Bank_Account__c
                                         WHERE Account_No__c = :accountNo];
        if (accList.isEmpty()) {
            System.debug('ERROR: No account found with Account No — ' + accountNo);
            return;
        }
        Bank_Account__c acc    = accList[0];
        acc.Name               = newName;
        acc.Email__c           = newEmail;
        acc.Date_of_Opening__c = newDateOfOpening;
        acc.Branch__c          = newBranch;
        update acc;
        System.debug('SUCCESS: Account updated for — ' + newName);
    }

    // DELETE
    public static void deleteAccount(String accountNo) {
        List<Bank_Account__c> accList = [SELECT Id, Name
                                         FROM Bank_Account__c
                                         WHERE Account_No__c = :accountNo];
        if (accList.isEmpty()) {
            System.debug('ERROR: No account found with Account No — ' + accountNo);
            return;
        }
        String name = accList[0].Name;
        delete accList[0];
        System.debug('SUCCESS: Account deleted for — ' + name);
    }
}
```

---

## Code Explanation

### How it differs from PS 17 Employee

| PS 17 — Employee | PS 18 — Bank Account |
|------------------|----------------------|
| `Employee__c` | `Bank_Account__c` |
| `Emp_ID__c` | `Account_No__c` |
| `Email__c` | `Email__c` |
| `Birth_Date__c` | `Date_of_Opening__c` |
| `Department__c` | `Branch__c` |
| Loop var: `e` | Loop var: `a` |
| Class: `EmployeeManager` | Class: `BankAccountManager` |

**The entire Apex logic pattern is identical.** Only names change.

### Key Patterns (same as PS 17)

```apex
// CREATE pattern
ObjectName__c obj = new ObjectName__c();
obj.Field__c = value;
insert obj;

// READ pattern
List<ObjectName__c> list = [SELECT fields FROM ObjectName__c ORDER BY Name];
if (list.isEmpty()) { System.debug('Not found'); return; }
for (ObjectName__c item : list) { System.debug(item.Field__c); }

// UPDATE pattern
List<ObjectName__c> list = [SELECT Id, fields FROM ObjectName__c WHERE Key__c = :keyVar];
if (list.isEmpty()) { return; }
ObjectName__c obj = list[0];
obj.Field__c = newValue;
update obj;

// DELETE pattern
List<ObjectName__c> list = [SELECT Id FROM ObjectName__c WHERE Key__c = :keyVar];
if (list.isEmpty()) { return; }
delete list[0];
```

---

## Cheat Sheet

```
FIELD TYPES
  Account No       → Text
  Name (Holder)    → Standard field (no __c)
  Email            → Email
  Date of Opening  → Date
  Branch           → Text

DATE CREATION
  Date.newInstance(2024, 1, 10)   → January 10, 2024

DML KEYWORDS
  insert obj;    ← saves new record
  update obj;    ← saves changes to existing record
  delete obj;    ← removes record

FIND BY FIELD PATTERN
  WHERE Account_No__c = :accountNo
  The : before the variable is mandatory

EMPTY CHECK
  if (list.isEmpty()) { System.debug('Not found'); return; }
  Always check before doing list[0] to avoid errors
```

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Bank Account | Plural: Bank Accounts | Save

2. Fields & Relationships → New (do 4 times)
   Account No      → Text,  Length 20
   Email           → Email
   Date of Opening → Date
   Branch          → Text,  Length 50

3. Developer Console → File → New → Apex Class
   Name: BankAccountManager → paste code → Ctrl+S

4. Debug → Open Execute Anonymous Window
   Paste one operation at a time → Execute

5. View output: Logs tab → double-click latest → check Debug Only
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Type not found: Bank_Account__c` | Object not created | Create in Object Manager |
| `Variable does not exist: Account_No__c` | Field not created | Add field in Fields & Relationships |
| Output not visible | Debug Only not checked | Click "Debug Only" in log viewer |
| `System.QueryException: List has no rows` | Using `[0]` on empty list | Always check `if (list.isEmpty())` first |
| `ERROR: No account found` | Wrong Account No passed | Make sure it matches what you inserted |
