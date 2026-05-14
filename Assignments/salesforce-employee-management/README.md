# Employee Management Lightning Application
## Validation Rules + Lightning App with Tabs — No Code Needed

**Assignment:** Develop an Employee Management Lightning Web Component that allows users to add  
employee records with validation.

---

## Validations Required

| Field | Validation |
|-------|-----------|
| Employee Name | Cannot be empty and must contain at least 3 characters |
| Employee ID | Must be greater than 0 and should be unique |
| Salary | Must be greater than 10,000 and less than 5,00,000 |
| Email | Must follow a valid email format (contains @) |
| Department | Must be selected from the available list (Picklist) |
| Joining Date | Cannot be a future date |

---

## Overview of Steps

```
Step 1  → Create Employee Custom Object
Step 2  → Add Fields
Step 3  → Add Validation Rules (6 rules)
Step 4  → Create Tab for the Object
Step 5  → Create Lightning App with the Tab
Step 6  → Test all validations
```

---

## Step 1 — Create Employee Custom Object

1. Click **gear icon (⚙️)** → **Setup**
2. In the search bar type: `Object Manager` → click it
3. Click **Create** dropdown (top right) → **Custom Object**
4. Fill in:
   - **Label:** `Employee`
   - **Plural Label:** `Employees`
   - **Object Name:** `Employee` ← auto-filled, leave it
   - Scroll down → check **"Launch New Custom Tab Wizard after saving this custom object"**
5. Click **Save**

---

## Step 2 — Add Fields

You are now on the Employee object page.  
Click **Fields & Relationships** in the left sidebar.

### Field 1 — Employee ID (Unique + Greater Than 0)

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Employee ID`
   - **Field Name:** `Employee_ID` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `0`
   - ✅ Check **"Unique"** checkbox ← prevents duplicate Employee IDs automatically
4. Click **Next → Next → Save**

### Field 2 — Salary

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Salary`
   - **Field Name:** `Salary` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `2`
4. Click **Next → Next → Save**

### Field 3 — Department (Picklist)

1. Click **New**
2. Data type: **Picklist** → **Next**
3. Fill in:
   - **Field Label:** `Department`
   - **Field Name:** `Department` (auto-filled)
   - Select **"Enter values, with each value on a separate line"**
   - Type these values one per line:
     ```
     IT
     HR
     Finance
     Marketing
     Operations
     ```
4. Click **Next → Next → Save**

### Field 4 — Email

1. Click **New**
2. Data type: **Email** → **Next**
3. Fill in:
   - **Field Label:** `Email`
   - **Field Name:** `Email` (auto-filled)
4. Click **Next → Next → Save**

### Field 5 — Joining Date

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Joining Date`
   - **Field Name:** `Joining_Date` (auto-filled)
4. Click **Next → Next → Save**

> Your Employee object fields:
> `Name` (standard — Employee Name), `Employee_ID__c` (unique),
> `Salary__c`, `Department__c` (picklist), `Email__c`, `Joining_Date__c`

---

## Step 3 — Add Validation Rules

Click **Validation Rules** in the left sidebar of the Employee object page.  
Click **New** for each rule below.

---

### Rule 1 — Employee Name Cannot Be Empty and Must Have 3+ Characters

- **Rule Name:** `Name_Invalid`
- **Error Condition Formula:**
  ```
  ISBLANK(Name) || LEN(Name) < 3
  ```
- **Error Message:** `Employee Name cannot be empty and must contain at least 3 characters.`
- **Error Location:** Field → **Name**
- Click **Save**

---

### Rule 2 — Employee ID Must Be Greater Than 0

- **Rule Name:** `ID_Invalid`
- **Error Condition Formula:**
  ```
  Employee_ID__c <= 0
  ```
- **Error Message:** `Employee ID must be greater than 0.`
- **Error Location:** Field → **Employee_ID__c**
- Click **Save**

> Note: Employee ID uniqueness is handled by the **Unique checkbox** on the field — no extra rule needed.

---

### Rule 3 — Salary Must Be Greater Than 10,000 and Less Than 5,00,000

- **Rule Name:** `Salary_Invalid`
- **Error Condition Formula:**
  ```
  Salary__c <= 10000 || Salary__c >= 500000
  ```
- **Error Message:** `Salary must be greater than 10,000 and less than 5,00,000.`
- **Error Location:** Field → **Salary__c**
- Click **Save**

---

### Rule 4 — Email Must Follow Valid Format

- **Rule Name:** `Email_Invalid`
- **Error Condition Formula:**
  ```
  NOT(CONTAINS(Email__c, '@'))
  ```
- **Error Message:** `Email address must follow a valid format and contain @.`
- **Error Location:** Field → **Email__c**
- Click **Save**

---

### Rule 5 — Department Must Be Selected

- **Rule Name:** `Department_Not_Selected`
- **Error Condition Formula:**
  ```
  ISPICKVAL(Department__c, '')
  ```
- **Error Message:** `Department must be selected from the available list.`
- **Error Location:** Field → **Department__c**
- Click **Save**

---

### Rule 6 — Joining Date Cannot Be a Future Date

- **Rule Name:** `Future_Joining_Date`
- **Error Condition Formula:**
  ```
  Joining_Date__c > TODAY()
  ```
- **Error Message:** `Joining Date cannot be a future date.`
- **Error Location:** Field → **Joining_Date__c**
- Click **Save**

> ✅ All 6 Validation Rules are done.

---

## Step 4 — Create a Tab for Employee

> Skip if the Tab Wizard opened automatically after Step 1.

1. In Setup search: `Tabs` → click **Tabs**
2. Under **Custom Object Tabs** → click **New**
3. **Object:** Select `Employee`
4. **Tab Style:** Click the icon picker → choose any icon
5. Click **Next → Next → Save**

---

## Step 5 — Create Lightning App

1. In Setup search: `App Manager` → click **App Manager**
2. Click **New Lightning App** (top right)
3. Fill in:
   - **App Name:** `Employee Management`
   - **Developer Name:** auto-filled
4. Click **Next → Next → Next**
5. **Navigation Items** page:
   - Search `Employees` → click → click **Add**
6. Click **Next**
7. **User Profiles** → select **System Administrator** → click **Add**
8. Click **Save & Finish**

---

## Step 6 — Open and Test

### Open the App
1. Click **9-dot grid (App Launcher)** icon top left
2. Search: `Employee Management` → click it
3. Click **Employees** tab → Click **New**

### Test All Validations

| Test | Input | Expected Error |
|------|-------|---------------|
| Blank name | leave empty | Employee Name cannot be empty and must contain at least 3 characters |
| Short name | `Jo` | Employee Name cannot be empty and must contain at least 3 characters |
| ID = 0 | `0` | Employee ID must be greater than 0 |
| ID negative | `-1` | Employee ID must be greater than 0 |
| Duplicate ID | same ID twice | This field must be unique (Salesforce built-in) |
| Salary = 10000 | `10000` | Salary must be greater than 10,000 and less than 5,00,000 |
| Salary = 500000 | `500000` | Salary must be greater than 10,000 and less than 5,00,000 |
| Email no @ | `johngmail.com` | Email address must follow a valid format and contain @ |
| No department | don't select | Department must be selected from the available list |
| Future date | tomorrow's date | Joining Date cannot be a future date |
| All valid | correct values | ✅ Record saves successfully |

### Valid Record Example
- **Name:** `John Doe`
- **Employee ID:** `1`
- **Salary:** `75000`
- **Department:** `IT` (select from dropdown)
- **Email:** `john@gmail.com`
- **Joining Date:** today or any past date

---

## All Validation Rules — Quick Reference

| Rule Name | Formula | Error Message |
|-----------|---------|--------------|
| `Name_Invalid` | `ISBLANK(Name) \|\| LEN(Name) < 3` | Name cannot be empty, must have 3+ chars |
| `ID_Invalid` | `Employee_ID__c <= 0` | Employee ID must be greater than 0 |
| *(Unique ID)* | ✅ Unique checkbox on field | Built-in duplicate message |
| `Salary_Invalid` | `Salary__c <= 10000 \|\| Salary__c >= 500000` | Salary must be > 10,000 and < 5,00,000 |
| `Email_Invalid` | `NOT(CONTAINS(Email__c, '@'))` | Email must contain @ |
| `Department_Not_Selected` | `ISPICKVAL(Department__c, '')` | Department must be selected |
| `Future_Joining_Date` | `Joining_Date__c > TODAY()` | Joining Date cannot be future |

---

## Formula Cheat Sheet

```
ISBLANK(Name)                            ← field is empty
LEN(Name) < 3                            ← less than 3 characters
ISBLANK(Name) || LEN(Name) < 3          ← empty OR too short

field__c <= 0                            ← must be greater than 0
field__c <= 10000 || field__c >= 500000  ← out of range

NOT(CONTAINS(Email__c, '@'))             ← no @ in email
ISPICKVAL(Department__c, '')             ← picklist not selected
Joining_Date__c > TODAY()               ← date is in future

||   means OR   (never use the word OR)
&&   means AND  (never use the word AND)
```

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Employee | Plural: Employees
   ✅ Check "Launch Tab Wizard after saving" | Save

2. Fields & Relationships → New (5 times)
   Employee ID  → Number, Decimal 0, ✅ Unique
   Salary       → Number, Length 10, Decimal 2
   Department   → Picklist (IT, HR, Finance, Marketing, Operations)
   Email        → Email
   Joining Date → Date

3. Validation Rules → New (6 times)
   Name_Invalid           → ISBLANK(Name) || LEN(Name) < 3
   ID_Invalid             → Employee_ID__c <= 0
   Salary_Invalid         → Salary__c <= 10000 || Salary__c >= 500000
   Email_Invalid          → NOT(CONTAINS(Email__c, '@'))
   Department_Not_Selected → ISPICKVAL(Department__c, '')
   Future_Joining_Date    → Joining_Date__c > TODAY()

4. Tabs → New → Employee object → choose icon → Save

5. App Manager → New Lightning App → Employee Management
   Navigation: Add Employees tab
   Profiles: Add System Administrator → Save & Finish

6. App Launcher → Employee Management → New → test all validations
```
