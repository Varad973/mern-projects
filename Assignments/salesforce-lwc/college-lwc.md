# PS 23 — College Management (Lightning Web Component)
## LWC with Two Objects — Student and Faculty

**Student Fields:** Name, Roll Number (> 0), Marks (0–100), Email (has @), Department  
**Faculty Fields:** Name, Faculty ID, Email (has @), Salary (range), Department  
**Objects:** `College_Student__c`, `Faculty__c`  
**Apex Class:** `CollegeController`  
**LWC Component:** `collegeForm`

> **Note:** PS 23 is structurally identical to PS 20. Same LWC pattern, same validation style.  
> Only difference: two objects instead of one, and different field validations.

---

## Table of Contents
1. [What You Will Build](#what-you-will-build)
2. [Part A — Create Custom Objects and Fields](#part-a--create-custom-objects-and-fields)
3. [Part B — Setup VS Code Project](#part-b--setup-vs-code-project)
4. [Part C — Create Apex Controller](#part-c--create-apex-controller)
5. [Part D — Create LWC Component](#part-d--create-lwc-component)
6. [Part E — Deploy and Add to Page](#part-e--deploy-and-add-to-page)
7. [Full Code](#full-code)
8. [Code Explanation](#code-explanation)
9. [Cheat Sheet](#cheat-sheet)

---

## What You Will Build

One LWC component with **two tabs**:
- **Student Tab** — form to save a student with validations
- **Faculty Tab** — form to save a faculty member with validations
- Toggle between tabs using a button

---

## Part A — Create Custom Objects and Fields

### Object 1 — College Student

1. **Setup → Object Manager → Create → Custom Object**
2. Label: `College Student` | Plural: `College Students` | Object Name: `College_Student`
3. Save

**Fields (Fields & Relationships → New):**

| Field Label | API Name | Type | Details |
|-------------|----------|------|---------|
| Roll Number | `Roll_Number__c` | Number | Length: 10, Decimal: 0 |
| Marks | `Marks__c` | Number | Length: 5, Decimal: 2 |
| Email | `Email__c` | Email | — |
| Department | `Department__c` | Text | Length: 50 |

### Object 2 — Faculty

1. **Setup → Object Manager → Create → Custom Object**
2. Label: `Faculty` | Plural: `Faculty` | Object Name: `Faculty`
3. Save

**Fields (Fields & Relationships → New):**

| Field Label | API Name | Type | Details |
|-------------|----------|------|---------|
| Faculty ID | `Faculty_ID__c` | Text | Length: 20 |
| Email | `Email__c` | Email | — |
| Salary | `Salary__c` | Number | Length: 10, Decimal: 2 |
| Department | `Department__c` | Text | Length: 50 |

---

## Part B — Setup VS Code Project

```
sf project generate --name CollegeApp
cd CollegeApp
sf org login web --set-default
```

---

## Part C — Create Apex Controller

Create file: `force-app/main/default/classes/CollegeController.cls`

```apex
public with sharing class CollegeController {

    // Save Student
    @AuraEnabled
    public static void saveStudent(String name, Integer rollNumber, Decimal marks,
                                   String email, String department) {

        if (rollNumber <= 0) {
            throw new AuraHandledException('Roll Number must be greater than 0.');
        }
        if (marks < 0 || marks > 100) {
            throw new AuraHandledException('Marks must be between 0 and 100.');
        }
        if (!email.contains('@')) {
            throw new AuraHandledException('Invalid email. Must contain @.');
        }

        College_Student__c student = new College_Student__c();
        student.Name          = name;
        student.Roll_Number__c = rollNumber;
        student.Marks__c      = marks;
        student.Email__c      = email;
        student.Department__c = department;
        insert student;
    }

    // Save Faculty
    @AuraEnabled
    public static void saveFaculty(String name, String facultyId, String email,
                                   Decimal salary, String department) {

        List<Faculty__c> existing = [SELECT Id FROM Faculty__c WHERE Faculty_ID__c = :facultyId];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Faculty ID already exists.');
        }
        if (!email.contains('@')) {
            throw new AuraHandledException('Invalid email. Must contain @.');
        }
        if (salary < 20000 || salary > 2000000) {
            throw new AuraHandledException('Salary must be between 20,000 and 20,00,000.');
        }

        Faculty__c faculty    = new Faculty__c();
        faculty.Name          = name;
        faculty.Faculty_ID__c = facultyId;
        faculty.Email__c      = email;
        faculty.Salary__c     = salary;
        faculty.Department__c = department;
        insert faculty;
    }
}
```

---

## Part D — Create LWC Component

Create folder: `force-app/main/default/lwc/collegeForm/`

### File 1 — collegeForm.html

```html
<template>
    <lightning-card title="College Management System">
        <div class="slds-p-around_medium">

            <!-- TAB TOGGLE BUTTONS -->
            <lightning-button label="Student Form" variant="brand"   onclick={showStudent}></lightning-button>
            &nbsp;
            <lightning-button label="Faculty Form" variant="neutral" onclick={showFaculty}></lightning-button>
            <br/><br/>

            <!-- STUDENT FORM -->
            <template if:true={isStudent}>
                <h3><b>Student Details</b></h3>

                <lightning-input label="Student Name"  value={stuName}   onchange={handleStuName}></lightning-input>
                <lightning-input label="Roll Number" type="number" value={rollNumber} onchange={handleRollNumber}></lightning-input>
                <lightning-input label="Marks"       type="number" value={marks}      onchange={handleMarks}></lightning-input>
                <lightning-input label="Email"                     value={stuEmail}   onchange={handleStuEmail}></lightning-input>
                <lightning-input label="Department"                value={stuDept}    onchange={handleStuDept}></lightning-input>

                <br/>
                <lightning-button label="Save Student" variant="brand" onclick={saveStudent}></lightning-button>
            </template>

            <!-- FACULTY FORM -->
            <template if:true={isFaculty}>
                <h3><b>Faculty Details</b></h3>

                <lightning-input label="Faculty Name"  value={facName}   onchange={handleFacName}></lightning-input>
                <lightning-input label="Faculty ID"    value={facultyId} onchange={handleFacultyId}></lightning-input>
                <lightning-input label="Email"         value={facEmail}  onchange={handleFacEmail}></lightning-input>
                <lightning-input label="Salary" type="number" value={salary} onchange={handleSalary}></lightning-input>
                <lightning-input label="Department"    value={facDept}   onchange={handleFacDept}></lightning-input>

                <br/>
                <lightning-button label="Save Faculty" variant="brand" onclick={saveFaculty}></lightning-button>
            </template>

            <!-- MESSAGE -->
            <template if:true={message}>
                <p style={messageStyle}><b>{message}</b></p>
            </template>

        </div>
    </lightning-card>
</template>
```

---

### File 2 — collegeForm.js

```javascript
import { LightningElement, track } from 'lwc';
import saveStudent from '@salesforce/apex/CollegeController.saveStudent';
import saveFaculty from '@salesforce/apex/CollegeController.saveFaculty';

export default class CollegeForm extends LightningElement {

    // Tab state
    @track isStudent = true;
    @track isFaculty = false;

    // Student fields
    @track stuName    = '';
    @track rollNumber = '';
    @track marks      = '';
    @track stuEmail   = '';
    @track stuDept    = '';

    // Faculty fields
    @track facName    = '';
    @track facultyId  = '';
    @track facEmail   = '';
    @track salary     = '';
    @track facDept    = '';

    // Message
    @track message  = '';
    @track isError  = false;

    get messageStyle() {
        return this.isError ? 'color:red; margin-top:10px;' : 'color:green; margin-top:10px;';
    }

    // --- Tab toggles ---
    showStudent() { this.isStudent = true;  this.isFaculty = false; this.message = ''; }
    showFaculty() { this.isFaculty = true;  this.isStudent = false; this.message = ''; }

    // --- Student handlers ---
    handleStuName(event)    { this.stuName    = event.target.value; }
    handleRollNumber(event) { this.rollNumber = event.target.value; }
    handleMarks(event)      { this.marks      = event.target.value; }
    handleStuEmail(event)   { this.stuEmail   = event.target.value; }
    handleStuDept(event)    { this.stuDept    = event.target.value; }

    // --- Faculty handlers ---
    handleFacName(event)    { this.facName    = event.target.value; }
    handleFacultyId(event)  { this.facultyId  = event.target.value; }
    handleFacEmail(event)   { this.facEmail   = event.target.value; }
    handleSalary(event)     { this.salary     = event.target.value; }
    handleFacDept(event)    { this.facDept    = event.target.value; }

    showError(msg) { this.message = 'Error: ' + msg; this.isError = true; }

    // --- Student validation + save ---
    saveStudent() {
        if (!this.stuName) return this.showError('Student Name is required.');
        if (!this.rollNumber || parseInt(this.rollNumber) <= 0)
            return this.showError('Roll Number must be greater than 0.');
        let m = parseFloat(this.marks);
        if (isNaN(m) || m < 0 || m > 100)
            return this.showError('Marks must be between 0 and 100.');
        if (!this.stuEmail.includes('@'))
            return this.showError('Invalid email. Must contain @.');
        if (!this.stuDept)
            return this.showError('Department is required.');

        saveStudent({
            name: this.stuName, rollNumber: parseInt(this.rollNumber),
            marks: m, email: this.stuEmail, department: this.stuDept
        })
        .then(() => {
            this.message = 'Success! Student saved.';
            this.isError = false;
            this.stuName = ''; this.rollNumber = ''; this.marks = '';
            this.stuEmail = ''; this.stuDept = '';
        })
        .catch(error => { this.showError(error.body.message); });
    }

    // --- Faculty validation + save ---
    saveFaculty() {
        if (!this.facName) return this.showError('Faculty Name is required.');
        if (!this.facultyId) return this.showError('Faculty ID is required.');
        if (!this.facEmail.includes('@'))
            return this.showError('Invalid email. Must contain @.');
        let sal = parseFloat(this.salary);
        if (isNaN(sal) || sal < 20000 || sal > 2000000)
            return this.showError('Salary must be between 20,000 and 20,00,000.');
        if (!this.facDept) return this.showError('Department is required.');

        saveFaculty({
            name: this.facName, facultyId: this.facultyId,
            email: this.facEmail, salary: sal, department: this.facDept
        })
        .then(() => {
            this.message = 'Success! Faculty saved.';
            this.isError = false;
            this.facName = ''; this.facultyId = ''; this.facEmail = '';
            this.salary = ''; this.facDept = '';
        })
        .catch(error => { this.showError(error.body.message); });
    }
}
```

---

### File 3 — collegeForm.js-meta.xml

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

## Part E — Deploy and Add to Page

```
sf project deploy start
```

Then:
1. **Setup → Lightning App Builder → New → App Page**
2. Drag **collegeForm** onto canvas → **Save → Activate**

---

## Code Explanation

### Two Apex methods in one class

```apex
@AuraEnabled
public static void saveStudent(...) { ... }

@AuraEnabled
public static void saveFaculty(...) { ... }
```

Both in the same class `CollegeController` — imported separately in JS:
```javascript
import saveStudent from '@salesforce/apex/CollegeController.saveStudent';
import saveFaculty from '@salesforce/apex/CollegeController.saveFaculty';
```

### Tab toggle using `@track isStudent` and `@track isFaculty`

```javascript
// Initially show Student form
@track isStudent = true;
@track isFaculty = false;

showStudent() { this.isStudent = true;  this.isFaculty = false; }
showFaculty() { this.isFaculty = true;  this.isStudent = false; }
```

```html
<template if:true={isStudent}> ... Student form ... </template>
<template if:true={isFaculty}> ... Faculty form ... </template>
```

`if:true={booleanProperty}` — renders the block only if the value is `true`.  
When `isStudent = true`, the student form shows. When `isFaculty = true`, faculty form shows.

### Validation differences vs PS 20

| PS 20 — Employee | PS 23 — Student | PS 23 — Faculty |
|-----------------|-----------------|-----------------|
| Name ≥ 3 chars | Name not empty | Name not empty |
| Unique Emp ID | Roll Number > 0 | Unique Faculty ID |
| Salary 10K–10L | Marks 0–100 | Salary 20K–20L |
| Email has @ and . | Email has @ | Email has @ |
| Department picklist | Department text | Department text |
| Joining date not future | — | — |

---

## Cheat Sheet

```
TWO OBJECTS, TWO METHODS IN APEX
  @AuraEnabled public static void saveStudent(...) {}
  @AuraEnabled public static void saveFaculty(...) {}

TWO IMPORTS IN JS
  import saveStudent from '@salesforce/apex/CollegeController.saveStudent';
  import saveFaculty from '@salesforce/apex/CollegeController.saveFaculty';

TAB TOGGLE PATTERN
  @track isStudent = true;
  @track isFaculty = false;
  showStudent() { this.isStudent = true;  this.isFaculty = false; }
  showFaculty() { this.isFaculty = true;  this.isStudent = false; }

CONDITIONAL RENDER IN HTML
  <template if:true={isStudent}> ... </template>
  <template if:true={isFaculty}> ... </template>

VALIDATIONS
  Roll Number > 0    → parseInt(this.rollNumber) <= 0
  Marks 0–100        → m < 0 || m > 100
  Email has @        → !this.email.includes('@')
  Salary range       → sal < 20000 || sal > 2000000
  Unique Faculty ID  → checked in Apex via SOQL + AuraHandledException
```

---

## Quick Steps (Exam Reference)

```
1. Create TWO objects in Setup:
   College_Student__c → Roll_Number__c (Number), Marks__c (Number), Email__c (Email), Department__c (Text)
   Faculty__c         → Faculty_ID__c (Text), Email__c (Email), Salary__c (Number), Department__c (Text)

2. sf project generate --name CollegeApp && cd CollegeApp && sf org login web --set-default

3. Create: force-app/main/default/classes/CollegeController.cls
   Two @AuraEnabled methods: saveStudent + saveFaculty

4. Create folder: force-app/main/default/lwc/collegeForm/
   collegeForm.html   → two <template if:true> blocks (student + faculty)
   collegeForm.js     → @track isStudent/isFaculty + tab toggles + two save methods
   collegeForm.js-meta.xml → same XML boilerplate as always

5. sf project deploy start

6. Setup → Lightning App Builder → drag collegeForm → Save → Activate
```
