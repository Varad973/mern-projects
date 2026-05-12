# PS 20 — Employee Management (Lightning Web Component)
## LWC with Frontend Validations

**Fields:** Name, Employee ID, Salary, Email, Department, Joining Date  
**Validations:** Name ≥ 3 chars | Unique ID | Salary 10K–10L | Email format | Department picklist | Joining date not future  
**Files needed:** `EmployeeController.cls` + `employeeForm.html` + `employeeForm.js` + `employeeForm.js-meta.xml`

---

## Table of Contents
1. [LWC vs Visualforce — Key Difference](#lwc-vs-visualforce--key-difference)
2. [Prerequisites — Install Tools](#prerequisites--install-tools)
3. [Part A — Create Custom Object and Fields](#part-a--create-custom-object-and-fields)
4. [Part B — Setup VS Code Project](#part-b--setup-vs-code-project)
5. [Part C — Create Apex Controller](#part-c--create-apex-controller)
6. [Part D — Create LWC Component (3 files)](#part-d--create-lwc-component-3-files)
7. [Part E — Deploy to Salesforce](#part-e--deploy-to-salesforce)
8. [Part F — Add to a Page and Test](#part-f--add-to-a-page-and-test)
9. [Full Code](#full-code)
10. [Code Explanation](#code-explanation)
11. [Validation Logic Explained](#validation-logic-explained)
12. [Cheat Sheet](#cheat-sheet)

---

## LWC vs Visualforce — Key Difference

| Visualforce (Type 1) | LWC (Type 3) |
|----------------------|-------------|
| Written in Developer Console | Written in VS Code |
| One `.page` file | Three files: `.html`, `.js`, `.js-meta.xml` |
| Apex does everything | JS handles validation, Apex only saves |
| Old technology | Modern Salesforce standard |
| No install needed | Needs Salesforce CLI + VS Code |

---

## Prerequisites — Install Tools

> Do this once before the exam or ask your lab to have it pre-installed.

### 1. Install Node.js
- Download from: https://nodejs.org
- Install the LTS version

### 2. Install Salesforce CLI
Open a terminal (cmd or PowerShell) and run:
```
npm install @salesforce/cli --global
```
Verify: `sf --version`

### 3. Install VS Code
- Download from: https://code.visualstudio.com

### 4. Install Salesforce Extension Pack in VS Code
1. Open VS Code
2. Click Extensions icon (left sidebar)
3. Search: `Salesforce Extension Pack`
4. Click **Install**

---

## Part A — Create Custom Object and Fields

> Do this in Salesforce Setup (same as Type 1 CRUD)

### Create Object

1. **Gear icon → Setup → Object Manager**
2. **Create → Custom Object**
3. Fill in:
   - **Label:** `Employee`
   - **Plural Label:** `Employees`
   - **Object Name:** `Employee`
4. **Save**

> If you already created `Employee__c` in PS 17, skip object creation and just add the two new fields below.

### Add Fields (Fields & Relationships → New)

| Field Label | API Name | Type | Details |
|-------------|----------|------|---------|
| Emp ID | `Emp_ID__c` | Text | Length: 20 |
| Email | `Email__c` | Email | — |
| Department | `Department__c` | Text | Length: 50 |
| Salary | `Salary__c` | Number | Length: 10, Decimal: 2 |
| Joining Date | `Joining_Date__c` | Date | — |

> `Name` is already a standard field — it is used as the employee name.

---

## Part B — Setup VS Code Project

### Step 1 — Open VS Code and open terminal
- In VS Code: **Terminal → New Terminal**

### Step 2 — Create a Salesforce project
```
sf project generate --name EmployeeApp
```
This creates a folder `EmployeeApp` with the standard project structure.

### Step 3 — Open the project in VS Code
```
cd EmployeeApp
code .
```
Or: **File → Open Folder → select EmployeeApp**

### Step 4 — Authorize your Salesforce org
```
sf org login web --set-default
```
- A browser window opens → login to your Salesforce account
- After login, you'll see: `Successfully authorized username`

---

## Part C — Create Apex Controller

### Step 1 — Create the file
In VS Code, navigate to:
```
force-app/main/default/classes/
```
Create a new file: `EmployeeController.cls`

### Step 2 — Paste the code

```apex
public with sharing class EmployeeController {

    @AuraEnabled
    public static void saveEmployee(String name, String empId, Decimal salary,
                                    String email, String department, String joiningDate) {

        // Check unique Emp ID
        List<Employee__c> existing = [SELECT Id FROM Employee__c WHERE Emp_ID__c = :empId];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Employee ID already exists. Please use a unique ID.');
        }

        Employee__c emp     = new Employee__c();
        emp.Name            = name;
        emp.Emp_ID__c       = empId;
        emp.Salary__c       = salary;
        emp.Email__c        = email;
        emp.Department__c   = department;
        emp.Joining_Date__c = Date.valueOf(joiningDate);
        insert emp;
    }
}
```

> **Key difference from Type 1/2 Apex:**
> - `public with sharing` — LWC Apex must use sharing rules
> - `@AuraEnabled` — makes the method callable from LWC JavaScript
> - `AuraHandledException` — sends error messages back to the LWC

---

## Part D — Create LWC Component (3 files)

Navigate to:
```
force-app/main/default/lwc/
```
Create a new folder: `employeeForm`

Inside it, create 3 files:

---

### File 1 — employeeForm.html (the template/UI)

```html
<template>
    <lightning-card title="Employee Management" icon-name="standard:employee">
        <div class="slds-p-around_medium">

            <lightning-input
                label="Name"
                value={name}
                onchange={handleName}>
            </lightning-input>

            <lightning-input
                label="Employee ID"
                value={empId}
                onchange={handleEmpId}>
            </lightning-input>

            <lightning-input
                type="number"
                label="Salary"
                value={salary}
                onchange={handleSalary}>
            </lightning-input>

            <lightning-input
                label="Email"
                value={email}
                onchange={handleEmail}>
            </lightning-input>

            <lightning-combobox
                label="Department"
                value={department}
                options={departmentOptions}
                onchange={handleDepartment}>
            </lightning-combobox>

            <lightning-input
                type="date"
                label="Joining Date"
                value={joiningDate}
                onchange={handleJoiningDate}>
            </lightning-input>

            <br/>
            <lightning-button
                label="Save Employee"
                variant="brand"
                onclick={saveEmployee}>
            </lightning-button>

            <template if:true={message}>
                <p style={messageStyle}><b>{message}</b></p>
            </template>

        </div>
    </lightning-card>
</template>
```

---

### File 2 — employeeForm.js (logic + validation)

```javascript
import { LightningElement, track } from 'lwc';
import saveEmployee from '@salesforce/apex/EmployeeController.saveEmployee';

export default class EmployeeForm extends LightningElement {

    @track name        = '';
    @track empId       = '';
    @track salary      = '';
    @track email       = '';
    @track department  = '';
    @track joiningDate = '';
    @track message     = '';
    @track isError     = false;

    departmentOptions = [
        { label: 'IT',         value: 'IT' },
        { label: 'HR',         value: 'HR' },
        { label: 'Finance',    value: 'Finance' },
        { label: 'Marketing',  value: 'Marketing' },
        { label: 'Operations', value: 'Operations' }
    ];

    get messageStyle() {
        return this.isError
            ? 'color:red; margin-top:10px;'
            : 'color:green; margin-top:10px;';
    }

    handleName(event)        { this.name        = event.target.value; }
    handleEmpId(event)       { this.empId       = event.target.value; }
    handleSalary(event)      { this.salary      = event.target.value; }
    handleEmail(event)       { this.email       = event.target.value; }
    handleDepartment(event)  { this.department  = event.target.value; }
    handleJoiningDate(event) { this.joiningDate = event.target.value; }

    validate() {

        if (this.name.length < 3) {
            this.showError('Name must be at least 3 characters.');
            return false;
        }

        if (!this.empId) {
            this.showError('Employee ID is required.');
            return false;
        }

        let sal = parseFloat(this.salary);
        if (!this.salary || sal < 10000 || sal > 1000000) {
            this.showError('Salary must be between 10,000 and 10,00,000.');
            return false;
        }

        if (!this.email.includes('@') || !this.email.includes('.')) {
            this.showError('Invalid email format. Must contain @ and .');
            return false;
        }

        if (!this.department) {
            this.showError('Please select a department.');
            return false;
        }

        if (!this.joiningDate) {
            this.showError('Joining Date is required.');
            return false;
        }

        let today = new Date().toISOString().split('T')[0];
        if (this.joiningDate > today) {
            this.showError('Joining Date cannot be in the future.');
            return false;
        }

        return true;
    }

    showError(msg) {
        this.message = 'Error: ' + msg;
        this.isError = true;
    }

    saveEmployee() {
        if (!this.validate()) return;

        saveEmployee({
            name:        this.name,
            empId:       this.empId,
            salary:      parseFloat(this.salary),
            email:       this.email,
            department:  this.department,
            joiningDate: this.joiningDate
        })
        .then(() => {
            this.message = 'Success! Employee saved successfully.';
            this.isError = false;
            this.clearForm();
        })
        .catch(error => {
            this.showError(error.body.message);
        });
    }

    clearForm() {
        this.name = ''; this.empId = ''; this.salary = '';
        this.email = ''; this.department = ''; this.joiningDate = '';
    }
}
```

---

### File 3 — employeeForm.js-meta.xml (metadata — tells Salesforce where to use this component)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

---

## Part E — Deploy to Salesforce

In VS Code terminal, run:

```
sf project deploy start
```

You should see:
```
Deployed Source
  employeeForm   LightningComponentBundle
  EmployeeController   ApexClass
```

If there are errors, fix the code and deploy again.

---

## Part F — Add to a Page and Test

### Add the component to a Lightning page

1. Go to Salesforce → **Gear icon → Setup**
2. Search: `Lightning App Builder`
3. Click **Lightning App Builder**
4. Click **New**
5. Select **App Page** → **Next**
6. Give it a name: `Employee App` → **Next**
7. Choose a layout (one region) → **Done**
8. In the left sidebar, find **Custom** section
9. Drag **employeeForm** onto the canvas
10. Click **Save** → Click **Activate** → **Activate**
11. Click **Back** → Click the app name to open it

### Test validations

| Test | Input | Expected Result |
|------|-------|----------------|
| Short name | `Jo` | Error: Name must be at least 3 characters |
| Empty ID | leave blank | Error: Employee ID is required |
| Low salary | `5000` | Error: Salary must be between 10,000 and 10,00,000 |
| Bad email | `notanemail` | Error: Invalid email format |
| No department | don't select | Error: Please select a department |
| Future date | tomorrow's date | Error: Joining Date cannot be in the future |
| Duplicate ID | `E001` (already saved) | Error: Employee ID already exists |
| All valid | correct values | Success! Employee saved successfully |

---

## Full Code

### EmployeeController.cls
```apex
public with sharing class EmployeeController {

    @AuraEnabled
    public static void saveEmployee(String name, String empId, Decimal salary,
                                    String email, String department, String joiningDate) {

        List<Employee__c> existing = [SELECT Id FROM Employee__c WHERE Emp_ID__c = :empId];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Employee ID already exists. Please use a unique ID.');
        }

        Employee__c emp     = new Employee__c();
        emp.Name            = name;
        emp.Emp_ID__c       = empId;
        emp.Salary__c       = salary;
        emp.Email__c        = email;
        emp.Department__c   = department;
        emp.Joining_Date__c = Date.valueOf(joiningDate);
        insert emp;
    }
}
```

### employeeForm.html
```html
<template>
    <lightning-card title="Employee Management" icon-name="standard:employee">
        <div class="slds-p-around_medium">
            <lightning-input label="Name" value={name} onchange={handleName}></lightning-input>
            <lightning-input label="Employee ID" value={empId} onchange={handleEmpId}></lightning-input>
            <lightning-input type="number" label="Salary" value={salary} onchange={handleSalary}></lightning-input>
            <lightning-input label="Email" value={email} onchange={handleEmail}></lightning-input>
            <lightning-combobox label="Department" value={department} options={departmentOptions} onchange={handleDepartment}></lightning-combobox>
            <lightning-input type="date" label="Joining Date" value={joiningDate} onchange={handleJoiningDate}></lightning-input>
            <br/>
            <lightning-button label="Save Employee" variant="brand" onclick={saveEmployee}></lightning-button>
            <template if:true={message}>
                <p style={messageStyle}><b>{message}</b></p>
            </template>
        </div>
    </lightning-card>
</template>
```

### employeeForm.js
```javascript
import { LightningElement, track } from 'lwc';
import saveEmployee from '@salesforce/apex/EmployeeController.saveEmployee';

export default class EmployeeForm extends LightningElement {

    @track name = ''; @track empId = ''; @track salary = '';
    @track email = ''; @track department = ''; @track joiningDate = '';
    @track message = ''; @track isError = false;

    departmentOptions = [
        { label: 'IT', value: 'IT' }, { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' }, { label: 'Marketing', value: 'Marketing' },
        { label: 'Operations', value: 'Operations' }
    ];

    get messageStyle() {
        return this.isError ? 'color:red; margin-top:10px;' : 'color:green; margin-top:10px;';
    }

    handleName(event)        { this.name        = event.target.value; }
    handleEmpId(event)       { this.empId       = event.target.value; }
    handleSalary(event)      { this.salary      = event.target.value; }
    handleEmail(event)       { this.email       = event.target.value; }
    handleDepartment(event)  { this.department  = event.target.value; }
    handleJoiningDate(event) { this.joiningDate = event.target.value; }

    validate() {
        if (this.name.length < 3)
            return this.showError('Name must be at least 3 characters.') || false;
        if (!this.empId)
            return this.showError('Employee ID is required.') || false;
        let sal = parseFloat(this.salary);
        if (!this.salary || sal < 10000 || sal > 1000000)
            return this.showError('Salary must be between 10,000 and 10,00,000.') || false;
        if (!this.email.includes('@') || !this.email.includes('.'))
            return this.showError('Invalid email format. Must contain @ and .') || false;
        if (!this.department)
            return this.showError('Please select a department.') || false;
        if (!this.joiningDate)
            return this.showError('Joining Date is required.') || false;
        let today = new Date().toISOString().split('T')[0];
        if (this.joiningDate > today)
            return this.showError('Joining Date cannot be in the future.') || false;
        return true;
    }

    showError(msg) { this.message = 'Error: ' + msg; this.isError = true; }

    saveEmployee() {
        if (!this.validate()) return;
        saveEmployee({ name: this.name, empId: this.empId, salary: parseFloat(this.salary),
                       email: this.email, department: this.department, joiningDate: this.joiningDate })
        .then(() => {
            this.message = 'Success! Employee saved successfully.';
            this.isError = false;
            this.name = ''; this.empId = ''; this.salary = '';
            this.email = ''; this.department = ''; this.joiningDate = '';
        })
        .catch(error => { this.showError(error.body.message); });
    }
}
```

### employeeForm.js-meta.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

---

## Code Explanation

### Apex — What's new compared to Type 1/2

| Code | What it does |
|------|-------------|
| `public with sharing` | Respects Salesforce sharing rules — required for LWC |
| `@AuraEnabled` | Marks method as callable from LWC JavaScript |
| `AuraHandledException('msg')` | Sends error message back to JS `.catch()` block |
| `Date.valueOf(joiningDate)` | Converts String `'2024-01-10'` → Salesforce Date object |

### JS — Key concepts

| Code | What it does |
|------|-------------|
| `import saveEmployee from '@salesforce/apex/EmployeeController.saveEmployee'` | Imports the Apex method into JS |
| `@track name = ''` | Reactive property — when it changes, the HTML re-renders |
| `event.target.value` | Gets the current value from the input that fired `onchange` |
| `departmentOptions = [{ label, value }]` | Array of objects for the combobox dropdown |
| `get messageStyle()` | Computed property — returns different CSS based on `isError` |
| `.then(() => {})` | Runs when Apex call succeeds |
| `.catch(error => {})` | Runs when Apex throws AuraHandledException |
| `error.body.message` | Gets the message string from the Apex exception |

### HTML — Key tags

| Tag | What it does |
|-----|-------------|
| `<lightning-card>` | Styled box with a title |
| `<lightning-input>` | Text / number / date input field |
| `<lightning-combobox>` | Dropdown — uses `options` array from JS |
| `<lightning-button onclick={saveEmployee}>` | Calls `saveEmployee()` in JS on click |
| `{name}` | Displays / binds the JS property `name` |
| `onchange={handleName}` | Calls `handleName()` every time user types |
| `<template if:true={message}>` | Only renders if `message` is truthy (not empty) |

---

## Validation Logic Explained

```javascript
// 1. Name ≥ 3 characters
if (this.name.length < 3) → Error

// 2. Emp ID not empty (uniqueness checked in Apex)
if (!this.empId) → Error

// 3. Salary between 10,000 and 10,00,000
let sal = parseFloat(this.salary);
if (sal < 10000 || sal > 1000000) → Error

// 4. Email contains @ and .
if (!this.email.includes('@') || !this.email.includes('.')) → Error

// 5. Department selected (combobox not empty)
if (!this.department) → Error

// 6. Joining date not in future
let today = new Date().toISOString().split('T')[0];
// new Date()              → current date/time object
// .toISOString()          → '2024-05-07T10:30:00.000Z'
// .split('T')[0]          → '2024-05-07'  (just the date part)
if (this.joiningDate > today) → Error  // string comparison works for YYYY-MM-DD format
```

---

## Cheat Sheet

```
LWC FILE STRUCTURE
  employeeForm/
  ├── employeeForm.html          ← UI template
  ├── employeeForm.js            ← logic, validation, Apex call
  └── employeeForm.js-meta.xml  ← metadata (required, tells SF where to use it)

IMPORT APEX IN JS
  import methodName from '@salesforce/apex/ClassName.methodName';

CALL APEX FROM JS
  methodName({ param1: val1, param2: val2 })
  .then(result => { /* success */ })
  .catch(error => { error.body.message });

@TRACK
  @track propName = '';
  Makes the property reactive — HTML updates when it changes

EVENT HANDLING
  onchange={handlerName}  → HTML
  handleName(event) { this.name = event.target.value; }  → JS

COMBOBOX OPTIONS FORMAT
  [{ label: 'Display Text', value: 'stored_value' }, ...]

TODAY'S DATE IN JS
  new Date().toISOString().split('T')[0]   → '2024-05-07'

APEX ANNOTATION FOR LWC
  @AuraEnabled  → method callable from LWC
  public with sharing  → required class modifier

THROW ERROR FROM APEX TO LWC
  throw new AuraHandledException('your message');

DEPLOY COMMAND
  sf project deploy start
```

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create Employee__c object
   Add fields: Emp_ID__c (Text), Email__c (Email),
               Department__c (Text), Salary__c (Number), Joining_Date__c (Date)

2. Terminal:
   sf project generate --name EmployeeApp
   cd EmployeeApp
   sf org login web --set-default

3. Create file: force-app/main/default/classes/EmployeeController.cls
   Paste Apex code → @AuraEnabled method + AuraHandledException for duplicate ID

4. Create folder: force-app/main/default/lwc/employeeForm/
   Create 3 files inside it:
   - employeeForm.html  → lightning-card with lightning-input fields
   - employeeForm.js    → @track properties + validate() + saveEmployee()
   - employeeForm.js-meta.xml → copy-paste the XML boilerplate

5. Deploy:
   sf project deploy start

6. Setup → Lightning App Builder → New → App Page
   Drag employeeForm component → Save → Activate → Open
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module @salesforce/apex/...` | Wrong class/method name | Match exact class name `EmployeeController` and method `saveEmployee` |
| `@AuraEnabled missing` | Forgot annotation | Add `@AuraEnabled` above the method in Apex |
| Component not showing in Lightning App Builder | `isExposed: false` in meta XML | Set `<isExposed>true</isExposed>` |
| `error.body.message` is undefined | Apex didn't throw AuraHandledException | Use `throw new AuraHandledException('msg')` not regular Exception |
| Combobox shows nothing | Wrong options format | Must be `[{ label: '...', value: '...' }]` |
| Deploy fails | Syntax error in code | Check VS Code Problems panel (View → Problems) |
