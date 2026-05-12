# PS 20 — Employee Management (Simple Method)
## Lightning App with Tabs + Validation Rules — No Code Needed

**Fields:** Name, Emp ID (unique), Salary, Email, Department, Joining Date  
**Validations:** Added directly on the Object using Validation Rules  
**Tool:** Salesforce Setup only — no Developer Console, no Apex, no Aura

---

## Overview of Steps

```
Step 1 → Create Custom Object (Employee)
Step 2 → Add Fields (with Unique checkbox for Emp ID)
Step 3 → Add Validation Rules (4 rules)
Step 4 → Create a Tab for the Object
Step 5 → Create Lightning App with that Tab
Step 6 → Test
```

---

## Step 1 — Create Custom Object

1. Click **gear icon (⚙️)** → **Setup**
2. In the Setup search bar type: `Object Manager`
3. Click **Object Manager**
4. Click **Create** (top right dropdown) → **Custom Object**
5. Fill in:
   - **Label:** `Employee`
   - **Plural Label:** `Employees`
   - **Object Name:** `Employee` ← auto-filled, leave it
   - Scroll down, find **"Launch New Custom Tab Wizard after saving this custom object"** → **check this box**
6. Scroll down → Click **Save**

> Checking that box takes you directly to the Tab creation screen after saving — saves a step.

---

## Step 2 — Add Fields

You are now on the Employee object page.  
Click **Fields & Relationships** in the left sidebar.

### Field 1 — Emp ID (with Unique)

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Emp ID`
   - **Field Name:** `Emp_ID` (auto-filled)
   - **Length:** `20`
   - ✅ Check **"Unique"** checkbox ← this prevents duplicate IDs automatically
4. Click **Next → Next → Save**

### Field 2 — Email

1. Click **New**
2. Data type: **Email** → **Next**
3. Fill in:
   - **Field Label:** `Email`
   - **Field Name:** `Email` (auto-filled)
4. Click **Next → Next → Save**

### Field 3 — Department

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Department`
   - **Field Name:** `Department` (auto-filled)
   - **Length:** `50`
4. Click **Next → Next → Save**

### Field 4 — Salary

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Salary`
   - **Field Name:** `Salary` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `2`
4. Click **Next → Next → Save**

### Field 5 — Joining Date

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Joining Date`
   - **Field Name:** `Joining_Date` (auto-filled)
4. Click **Next → Next → Save**

> After all fields, your object has:
> `Name`, `Emp_ID__c` (unique), `Email__c`, `Department__c`, `Salary__c`, `Joining_Date__c`

---

## Step 3 — Add Validation Rules

Still on the Employee object page.  
Click **Validation Rules** in the left sidebar.

---

### Validation Rule 1 — Name Too Short

1. Click **New**
2. Fill in:
   - **Rule Name:** `Name_Too_Short`
   - **Active:** ✅ checked (default)
3. In the **Error Condition Formula** box, type:
   ```
   LEN(Name) < 3
   ```
4. **Error Message:** `Name must be at least 3 characters.`
5. **Error Location:** Select **Field** → choose **Name** from dropdown
6. Click **Save**

---

### Validation Rule 2 — Salary Out of Range

1. Click **New**
2. **Rule Name:** `Salary_Out_Of_Range`
3. **Error Condition Formula:**
   ```
   Salary__c < 10000 OR Salary__c > 1000000
   ```
4. **Error Message:** `Salary must be between 10,000 and 10,00,000.`
5. **Error Location:** Field → **Salary__c**
6. Click **Save**

---

### Validation Rule 3 — Invalid Email

1. Click **New**
2. **Rule Name:** `Invalid_Email`
3. **Error Condition Formula:**
   ```
   NOT(CONTAINS(Email__c, '@'))
   ```
4. **Error Message:** `Invalid email address. Must contain @.`
5. **Error Location:** Field → **Email__c**
6. Click **Save**

---

### Validation Rule 4 — Joining Date in Future

1. Click **New**
2. **Rule Name:** `Future_Joining_Date`
3. **Error Condition Formula:**
   ```
   Joining_Date__c > TODAY()
   ```
4. **Error Message:** `Joining Date cannot be in the future.`
5. **Error Location:** Field → **Joining_Date__c**
6. Click **Save**

> You now have 4 validation rules. Emp ID uniqueness is already handled by the **Unique** checkbox on the field.

---

## Step 4 — Create a Tab for the Object

> Skip this if the Tab Wizard opened automatically after Step 1.

1. In Setup search bar type: `Tabs`
2. Click **Tabs** (under User Interface)
3. Under **Custom Object Tabs** section, click **New**
4. Fill in:
   - **Object:** Select `Employee` from dropdown
   - **Tab Style:** Click the search icon → pick any icon you like (e.g. the person icon)
5. Click **Next → Next → Save**

---

## Step 5 — Create Lightning App with Tab

1. In Setup search bar type: `App Manager`
2. Click **App Manager**
3. Click **New Lightning App** (top right)
4. Fill in:
   - **App Name:** `Employee App`
   - **Developer Name:** auto-filled
5. Click **Next**
6. **App Options** page → leave defaults → Click **Next**
7. **Utility Items** page → Click **Next** (nothing to add)
8. **Navigation Items** page:
   - In the left search box, type `Employee`
   - You will see the **Employees** tab
   - Click it → Click **Add** (arrow to move it to Selected Items)
9. Click **Next**
10. **User Profiles** page:
    - Select **System Administrator** (or your profile)
    - Click **Add**
11. Click **Save & Finish**

---

## Step 6 — Open and Test

### Open the app

1. Click the **9-dot grid (App Launcher)** icon at the top left of Salesforce
2. Search: `Employee App`
3. Click it — you'll see the Employees tab

### Create a new employee

1. Click the **Employees** tab
2. Click **New** button
3. A form opens with all your fields

### Test each validation

#### Test 1 — Short Name
- Name: `Jo` (only 2 chars)
- Fill rest with valid data
- Click **Save**
- ✅ Should show: `Name must be at least 3 characters.`

#### Test 2 — Salary too low
- Name: `John Doe`
- Salary: `5000`
- Click **Save**
- ✅ Should show: `Salary must be between 10,000 and 10,00,000.`

#### Test 3 — Salary too high
- Salary: `9999999`
- Click **Save**
- ✅ Should show: `Salary must be between 10,000 and 10,00,000.`

#### Test 4 — Invalid Email
- Email: `johngmail.com` (no @)
- Click **Save**
- ✅ Should show: `Invalid email address. Must contain @.`

#### Test 5 — Future Joining Date
- Joining Date: pick any date in the future (e.g. next year)
- Click **Save**
- ✅ Should show: `Joining Date cannot be in the future.`

#### Test 6 — Duplicate Emp ID
- Save a record with Emp ID: `E001`
- Try to save another record with Emp ID: `E001`
- ✅ Should show: `This field must be unique...` (Salesforce built-in message)

#### Test 7 — All valid data
- Name: `John Doe`
- Emp ID: `E002`
- Salary: `50000`
- Email: `john@gmail.com`
- Department: `IT`
- Joining Date: today or past date
- Click **Save**
- ✅ Record saves successfully, appears in the list

---

## Summary of All Validation Rules

| Rule Name | Formula | Message |
|-----------|---------|---------|
| `Name_Too_Short` | `LEN(Name) < 3` | Name must be at least 3 characters |
| `Salary_Out_Of_Range` | `Salary__c < 10000 OR Salary__c > 1000000` | Salary must be between 10,000 and 10,00,000 |
| `Invalid_Email` | `NOT(CONTAINS(Email__c, '@'))` | Invalid email address. Must contain @ |
| `Future_Joining_Date` | `Joining_Date__c > TODAY()` | Joining Date cannot be in the future |
| Unique Emp ID | ✅ Unique checkbox on field | Salesforce built-in duplicate message |

---

## Formula Cheat Sheet

```
LEN(fieldName) < number          ← check minimum length
LEN(fieldName) > number          ← check maximum length

field__c < minValue              ← below minimum
field__c > maxValue              ← above maximum
field__c < min OR field__c > max ← out of range (both together)

NOT(CONTAINS(field__c, '@'))     ← does NOT contain @
NOT(CONTAINS(field__c, '.'))     ← does NOT contain .

field__c > TODAY()               ← date is in the future
field__c < TODAY()               ← date is in the past

ISBLANK(field__c)                ← field is empty / not filled
```

> **Remember:** The formula is the **error condition** — when it is TRUE, the error shows.  
> Think of it as: "Show error WHEN this is true."

---

## Why This Method is Better for Exams

| Aura Component Method | This Method (Validation Rules) |
|-----------------------|-------------------------------|
| Need to write Apex + JS code | No code at all |
| Need Developer Console | Done entirely in Setup |
| Complex deploy steps | Just fill forms in Setup |
| Can go wrong easily | Simple, reliable, Salesforce built-in |
| Takes 30+ minutes | Takes 10-15 minutes |

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Employee | check "Launch Tab Wizard after saving" | Save

2. Fields & Relationships → New (do 5 times)
   Emp ID     → Text, Length 20, ✅ Unique
   Email      → Email
   Department → Text, Length 50
   Salary     → Number, Length 10, Decimal 2
   Joining Date → Date

3. Validation Rules → New (do 4 times)
   Name_Too_Short     → LEN(Name) < 3
   Salary_Out_Of_Range → Salary__c < 10000 OR Salary__c > 1000000
   Invalid_Email      → NOT(CONTAINS(Email__c, '@'))
   Future_Joining_Date → Joining_Date__c > TODAY()

4. Tabs → New → Select Employee object → pick icon → Save

5. App Manager → New Lightning App → Employee App
   → Add Employees tab to Navigation Items
   → Add System Administrator profile → Save & Finish

6. App Launcher → Employee App → Employees tab → New → test all validations
```
