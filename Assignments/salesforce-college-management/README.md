# College Management Lightning Application
## Validation Rules + Lightning App with Tabs — No Code Needed

**Assignment:** Develop a College Management Lightning Application to store and manage Student  
and Faculty records with validation rules.

---

## Validations Required

### Student
| Field | Validation |
|-------|-----------|
| Name | Cannot be blank |
| Roll Number | Must be greater than 0 |
| Marks | Must be between 0 and 100 |
| Email | Must contain @ symbol |

### Faculty
| Field | Validation |
|-------|-----------|
| Faculty Name | Cannot be empty, must have at least 3 characters |
| Faculty ID | Must be greater than 0 and unique |
| Salary | Must be greater than 10,000 and less than 5,00,000 |
| Department | Must be selected from available list (Picklist) |
| Joining Date | Cannot be a future date |

---

## Overview of Steps

```
Step 1  → Create Student Custom Object
Step 2  → Add Student Fields
Step 3  → Add Student Validation Rules (4 rules)
Step 4  → Create Faculty Custom Object
Step 5  → Add Faculty Fields
Step 6  → Add Faculty Validation Rules (5 rules)
Step 7  → Create Tabs for both objects
Step 8  → Create Lightning App with both Tabs
Step 9  → Test all validations
```

---

## Step 1 — Create Student Custom Object

1. Click **gear icon (⚙️)** → **Setup**
2. In the search bar type: `Object Manager` → click it
3. Click **Create** dropdown (top right) → **Custom Object**
4. Fill in:
   - **Label:** `College Student`
   - **Plural Label:** `College Students`
   - **Object Name:** `College_Student` ← auto-filled
   - Scroll down → check **"Launch New Custom Tab Wizard after saving"**
5. Click **Save**

---

## Step 2 — Add Student Fields

You are now on the College Student object page.  
Click **Fields & Relationships** in the left sidebar.

### Field 1 — Roll Number

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Roll Number`
   - **Field Name:** `Roll_Number` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `0`
4. Click **Next → Next → Save**

### Field 2 — Marks

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Marks`
   - **Field Name:** `Marks` (auto-filled)
   - **Length:** `5`
   - **Decimal Places:** `2`
4. Click **Next → Next → Save**

### Field 3 — Email

1. Click **New**
2. Data type: **Email** → **Next**
3. Fill in:
   - **Field Label:** `Email`
   - **Field Name:** `Email` (auto-filled)
4. Click **Next → Next → Save**

> Your Student object fields:
> `Name` (standard), `Roll_Number__c`, `Marks__c`, `Email__c`

---

## Step 3 — Add Student Validation Rules

Click **Validation Rules** in the left sidebar of the College Student object page.

---

### Student Rule 1 — Name Cannot Be Blank

1. Click **New**
2. **Rule Name:** `Student_Name_Blank`
3. **Error Condition Formula:**
   ```
   ISBLANK(Name)
   ```
4. **Error Message:** `Student Name cannot be blank.`
5. **Error Location:** Field → **Name**
6. Click **Save**

---

### Student Rule 2 — Roll Number Must Be Greater Than 0

1. Click **New**
2. **Rule Name:** `Roll_Number_Invalid`
3. **Error Condition Formula:**
   ```
   Roll_Number__c <= 0
   ```
4. **Error Message:** `Roll Number must be greater than 0.`
5. **Error Location:** Field → **Roll_Number__c**
6. Click **Save**

---

### Student Rule 3 — Marks Must Be Between 0 and 100

1. Click **New**
2. **Rule Name:** `Marks_Out_Of_Range`
3. **Error Condition Formula:**
   ```
   Marks__c < 0 || Marks__c > 100
   ```
4. **Error Message:** `Marks must be between 0 and 100.`
5. **Error Location:** Field → **Marks__c**
6. Click **Save**

---

### Student Rule 4 — Email Must Contain @

1. Click **New**
2. **Rule Name:** `Invalid_Student_Email`
3. **Error Condition Formula:**
   ```
   NOT(CONTAINS(Email__c, '@'))
   ```
4. **Error Message:** `Email must contain the @ symbol.`
5. **Error Location:** Field → **Email__c**
6. Click **Save**

> ✅ All 4 Student Validation Rules are done.

---

## Step 4 — Create Faculty Custom Object

1. **Setup → Object Manager → Create → Custom Object**
2. Fill in:
   - **Label:** `Faculty`
   - **Plural Label:** `Faculty`
   - **Object Name:** `Faculty` ← auto-filled
   - Scroll down → check **"Launch New Custom Tab Wizard after saving"**
3. Click **Save**

---

## Step 5 — Add Faculty Fields

Click **Fields & Relationships** in the left sidebar of the Faculty object page.

### Field 1 — Faculty ID (Unique + Greater than 0)

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Faculty ID`
   - **Field Name:** `Faculty_ID` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `0`
   - ✅ Check **"Unique"** checkbox ← prevents duplicate Faculty IDs
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
   - Under **Values**, select **"Enter values, with each value on a separate line"**
   - Type these values (one per line):
     ```
     IT
     HR
     Finance
     Marketing
     Operations
     ```
4. Click **Next → Next → Save**

### Field 4 — Joining Date

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Joining Date`
   - **Field Name:** `Joining_Date` (auto-filled)
4. Click **Next → Next → Save**

### Field 5 — Email

1. Click **New**
2. Data type: **Email** → **Next**
3. Fill in:
   - **Field Label:** `Email`
   - **Field Name:** `Email` (auto-filled)
4. Click **Next → Next → Save**

> Your Faculty object fields:
> `Name` (standard - Faculty Name), `Faculty_ID__c` (unique), `Salary__c`,
> `Department__c` (picklist), `Joining_Date__c`, `Email__c`

---

## Step 6 — Add Faculty Validation Rules

Click **Validation Rules** in the left sidebar of the Faculty object page.

---

### Faculty Rule 1 — Name Cannot Be Empty and Must Have 3+ Chars

1. Click **New**
2. **Rule Name:** `Faculty_Name_Invalid`
3. **Error Condition Formula:**
   ```
   ISBLANK(Name) || LEN(Name) < 3
   ```
4. **Error Message:** `Faculty Name cannot be empty and must contain at least 3 characters.`
5. **Error Location:** Field → **Name**
6. Click **Save**

---

### Faculty Rule 2 — Faculty ID Must Be Greater Than 0

1. Click **New**
2. **Rule Name:** `Faculty_ID_Invalid`
3. **Error Condition Formula:**
   ```
   Faculty_ID__c <= 0
   ```
4. **Error Message:** `Faculty ID must be greater than 0.`
5. **Error Location:** Field → **Faculty_ID__c**
6. Click **Save**

> Note: Faculty ID uniqueness is already handled by the **Unique checkbox** on the field.

---

### Faculty Rule 3 — Salary Must Be Greater Than 10,000 and Less Than 5,00,000

1. Click **New**
2. **Rule Name:** `Salary_Out_Of_Range`
3. **Error Condition Formula:**
   ```
   Salary__c <= 10000 || Salary__c >= 500000
   ```
4. **Error Message:** `Salary must be greater than 10,000 and less than 5,00,000.`
5. **Error Location:** Field → **Salary__c**
6. Click **Save**

---

### Faculty Rule 4 — Department Must Be Selected

1. Click **New**
2. **Rule Name:** `Department_Not_Selected`
3. **Error Condition Formula:**
   ```
   ISPICKVAL(Department__c, '')
   ```
4. **Error Message:** `Department must be selected from the available list.`
5. **Error Location:** Field → **Department__c**
6. Click **Save**

---

### Faculty Rule 5 — Joining Date Cannot Be Future

1. Click **New**
2. **Rule Name:** `Future_Joining_Date`
3. **Error Condition Formula:**
   ```
   Joining_Date__c > TODAY()
   ```
4. **Error Message:** `Joining Date cannot be a future date.`
5. **Error Location:** Field → **Joining_Date__c**
6. Click **Save**

> ✅ All 5 Faculty Validation Rules are done.

---

## Step 7 — Create Tabs for Both Objects

> If the Tab Wizard opened automatically after saving each object, you already did this. Skip to Step 8.

### Create Student Tab

1. In Setup search bar type: `Tabs` → click **Tabs**
2. Under **Custom Object Tabs** → click **New**
3. **Object:** Select `College Student`
4. **Tab Style:** Click the icon picker → choose any icon
5. Click **Next → Next → Save**

### Create Faculty Tab

1. Under **Custom Object Tabs** → click **New**
2. **Object:** Select `Faculty`
3. **Tab Style:** Choose any icon
4. Click **Next → Next → Save**

---

## Step 8 — Create Lightning App with Both Tabs

1. In Setup search bar type: `App Manager` → click **App Manager**
2. Click **New Lightning App** (top right)
3. Fill in:
   - **App Name:** `College Management`
   - **Developer Name:** auto-filled
4. Click **Next**
5. **App Options** page → leave defaults → Click **Next**
6. **Utility Items** page → Click **Next**
7. **Navigation Items** page:
   - Search `College Students` → click it → click **Add**
   - Search `Faculty` → click it → click **Add**
   - Both should now be in the Selected Items list
8. Click **Next**
9. **User Profiles** page → select **System Administrator** → click **Add**
10. Click **Save & Finish**

---

## Step 9 — Test All Validations

### Open the App

1. Click the **9-dot grid (App Launcher)** icon (top left)
2. Search: `College Management`
3. Click it → you see **College Students** and **Faculty** tabs

---

### Test Student Validations

Click **College Students** tab → Click **New**

| Test | Input | Expected Error |
|------|-------|---------------|
| Blank Name | leave Name empty | Student Name cannot be blank |
| Roll Number = 0 | `0` | Roll Number must be greater than 0 |
| Roll Number negative | `-1` | Roll Number must be greater than 0 |
| Marks > 100 | `105` | Marks must be between 0 and 100 |
| Marks < 0 | `-5` | Marks must be between 0 and 100 |
| Email without @ | `studentgmail.com` | Email must contain the @ symbol |
| All valid | correct values | ✅ Record saves successfully |

**Valid Student Example:**
- Name: `Rahul Sharma`
- Roll Number: `101`
- Marks: `85`
- Email: `rahul@gmail.com`

---

### Test Faculty Validations

Click **Faculty** tab → Click **New**

| Test | Input | Expected Error |
|------|-------|---------------|
| Blank Name | leave empty | Faculty Name cannot be empty and must contain at least 3 characters |
| Short Name | `Jo` | Faculty Name cannot be empty and must contain at least 3 characters |
| Faculty ID = 0 | `0` | Faculty ID must be greater than 0 |
| Faculty ID negative | `-1` | Faculty ID must be greater than 0 |
| Duplicate Faculty ID | use same ID again | This field must be unique (Salesforce built-in) |
| Salary = 10000 | `10000` | Salary must be greater than 10,000 and less than 5,00,000 |
| Salary = 500000 | `500000` | Salary must be greater than 10,000 and less than 5,00,000 |
| No Department | don't select | Department must be selected from the available list |
| Future date | tomorrow's date | Joining Date cannot be a future date |
| All valid | correct values | ✅ Record saves successfully |

**Valid Faculty Example:**
- Name: `Prof. Amit Kumar`
- Faculty ID: `1`
- Salary: `75000`
- Department: `IT` (select from picklist)
- Joining Date: today or past date
- Email: `amit@college.edu`

---

## All Validation Rules — Quick Reference

### Student Object (College_Student__c)

| Rule Name | Formula | Message |
|-----------|---------|---------|
| `Student_Name_Blank` | `ISBLANK(Name)` | Student Name cannot be blank |
| `Roll_Number_Invalid` | `Roll_Number__c <= 0` | Roll Number must be greater than 0 |
| `Marks_Out_Of_Range` | `Marks__c < 0 \|\| Marks__c > 100` | Marks must be between 0 and 100 |
| `Invalid_Student_Email` | `NOT(CONTAINS(Email__c, '@'))` | Email must contain the @ symbol |

### Faculty Object (Faculty__c)

| Rule Name | Formula | Message |
|-----------|---------|---------|
| `Faculty_Name_Invalid` | `ISBLANK(Name) \|\| LEN(Name) < 3` | Faculty Name cannot be empty and must have at least 3 characters |
| `Faculty_ID_Invalid` | `Faculty_ID__c <= 0` | Faculty ID must be greater than 0 |
| *(Unique Faculty ID)* | ✅ Unique checkbox on field | Salesforce built-in duplicate message |
| `Salary_Out_Of_Range` | `Salary__c <= 10000 \|\| Salary__c >= 500000` | Salary must be greater than 10,000 and less than 5,00,000 |
| `Department_Not_Selected` | `ISPICKVAL(Department__c, '')` | Department must be selected from the available list |
| `Future_Joining_Date` | `Joining_Date__c > TODAY()` | Joining Date cannot be a future date |

---

## Formula Cheat Sheet

```
ISBLANK(Name)                        ← field is empty/blank
LEN(Name) < 3                        ← less than 3 characters
ISBLANK(Name) || LEN(Name) < 3      ← blank OR too short

field__c <= 0                        ← must be greater than 0
field__c < 0 || field__c > 100      ← out of range (0 to 100)
field__c <= 10000 || field__c >= 500000  ← out of range (10K to 5L)

NOT(CONTAINS(Email__c, '@'))         ← no @ in email
ISPICKVAL(Department__c, '')         ← picklist not selected
Joining_Date__c > TODAY()            ← date is in future

||   means OR  (use this, not the word OR)
&&   means AND (use this, not the word AND)
```

---

## Quick Steps (Exam Reference)

```
STUDENT OBJECT
1. Object Manager → Create → Custom Object
   Label: College Student | Plural: College Students | Save

2. Fields & Relationships → New (3 times)
   Roll Number → Number, Length 10, Decimal 0
   Marks       → Number, Length 5,  Decimal 2
   Email       → Email

3. Validation Rules → New (4 times)
   Student_Name_Blank     → ISBLANK(Name)
   Roll_Number_Invalid    → Roll_Number__c <= 0
   Marks_Out_Of_Range     → Marks__c < 0 || Marks__c > 100
   Invalid_Student_Email  → NOT(CONTAINS(Email__c, '@'))

FACULTY OBJECT
4. Object Manager → Create → Custom Object
   Label: Faculty | Plural: Faculty | Save

5. Fields & Relationships → New (5 times)
   Faculty ID   → Number, Decimal 0, ✅ Unique
   Salary       → Number, Length 10, Decimal 2
   Department   → Picklist (IT, HR, Finance, Marketing, Operations)
   Joining Date → Date
   Email        → Email

6. Validation Rules → New (5 times)
   Faculty_Name_Invalid    → ISBLANK(Name) || LEN(Name) < 3
   Faculty_ID_Invalid      → Faculty_ID__c <= 0
   Salary_Out_Of_Range     → Salary__c <= 10000 || Salary__c >= 500000
   Department_Not_Selected → ISPICKVAL(Department__c, '')
   Future_Joining_Date     → Joining_Date__c > TODAY()

LIGHTNING APP
7. Tabs → New → College Student object → icon → Save
   Tabs → New → Faculty object → icon → Save

8. App Manager → New Lightning App → College Management
   Navigation Items: Add College Students + Faculty tabs
   User Profiles: Add System Administrator → Save & Finish

9. App Launcher → College Management → test both forms
```
