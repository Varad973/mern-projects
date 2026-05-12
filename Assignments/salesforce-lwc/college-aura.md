# PS 23 — College Management (Aura Component)
## Two Objects: Student + Faculty — Developer Console Only

**Student Fields:** Name, Roll Number (> 0), Marks (0–100), Email (has @), Department  
**Faculty Fields:** Name, Faculty ID (unique), Email (has @), Salary (range), Department  
**Objects:** `College_Student__c`, `Faculty__c`  
**Tool:** Salesforce Developer Console only — no downloads needed

---

## Table of Contents
1. [What You Will Build](#what-you-will-build)
2. [Part A — Create Both Custom Objects](#part-a--create-both-custom-objects)
3. [Part B — Create Apex Controller](#part-b--create-apex-controller)
4. [Part C — Create Aura Component](#part-c--create-aura-component)
5. [Part D — Add to Page and Test](#part-d--add-to-page-and-test)
6. [Full Code](#full-code)
7. [Code Explanation](#code-explanation)
8. [Cheat Sheet](#cheat-sheet)

---

## What You Will Build

One Aura component with a **toggle button** to switch between:
- **Student form** — with validations for Roll Number, Marks, Email
- **Faculty form** — with validations for unique Faculty ID, Salary range, Email

---

## Part A — Create Both Custom Objects

### Object 1 — College Student

1. **Setup → Object Manager → Create → Custom Object**
2. Label: `College Student` | Plural: `College Students` | Object Name: `College_Student` → **Save**

**Fields (Fields & Relationships → New):**

| Field Label | Type | Details |
|-------------|------|---------|
| Roll Number | Number | Length: 10, Decimal: 0 |
| Marks | Number | Length: 5, Decimal: 2 |
| Email | Email | — |
| Department | Text | Length: 50 |

### Object 2 — Faculty

1. **Setup → Object Manager → Create → Custom Object**
2. Label: `Faculty` | Plural: `Faculty` | Object Name: `Faculty` → **Save**

**Fields (Fields & Relationships → New):**

| Field Label | Type | Details |
|-------------|------|---------|
| Faculty ID | Text | Length: 20 |
| Email | Email | — |
| Salary | Number | Length: 10, Decimal: 2 |
| Department | Text | Length: 50 |

---

## Part B — Create Apex Controller

1. **Developer Console → File → New → Apex Class**
2. Name: `CollegeController` → OK
3. Paste code → **Ctrl+S**

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
        student.Name           = name;
        student.Roll_Number__c = rollNumber;
        student.Marks__c       = marks;
        student.Email__c       = email;
        student.Department__c  = department;
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

## Part C — Create Aura Component

1. **Developer Console → File → New → Lightning Component**
2. Name: `CollegeForm` → **Submit**
3. Fill **Component** tab first, then **Controller** tab

---

### Component Tab (.cmp)

```html
<aura:component controller="CollegeController"
                implements="flexipage:availableForAllPageTypes">

    <!-- Toggle state -->
    <aura:attribute name="showStudent" type="Boolean" default="true"/>

    <!-- Student attributes -->
    <aura:attribute name="stuName"     type="String"  default=""/>
    <aura:attribute name="rollNumber"  type="String"  default=""/>
    <aura:attribute name="marks"       type="String"  default=""/>
    <aura:attribute name="stuEmail"    type="String"  default=""/>
    <aura:attribute name="stuDept"     type="String"  default=""/>

    <!-- Faculty attributes -->
    <aura:attribute name="facName"     type="String"  default=""/>
    <aura:attribute name="facultyId"   type="String"  default=""/>
    <aura:attribute name="facEmail"    type="String"  default=""/>
    <aura:attribute name="salary"      type="String"  default=""/>
    <aura:attribute name="facDept"     type="String"  default=""/>

    <!-- Message -->
    <aura:attribute name="message"     type="String"  default=""/>

    <lightning:card title="College Management System">
        <div class="slds-p-around_medium">

            <!-- TOGGLE BUTTONS -->
            <lightning:button label="Student Form" variant="brand"   onclick="{!c.showStudentForm}" />
            &nbsp;
            <lightning:button label="Faculty Form" variant="neutral" onclick="{!c.showFacultyForm}" />
            <br/><br/>

            <!-- STUDENT FORM -->
            <aura:if isTrue="{!v.showStudent}">
                <h3><b>Student Details</b></h3>
                <lightning:input label="Student Name" value="{!v.stuName}"    />
                <lightning:input label="Roll Number"  value="{!v.rollNumber}" type="number" />
                <lightning:input label="Marks"        value="{!v.marks}"      type="number" />
                <lightning:input label="Email"        value="{!v.stuEmail}"   />
                <lightning:input label="Department"   value="{!v.stuDept}"    />
                <br/>
                <lightning:button label="Save Student" variant="brand" onclick="{!c.saveStudent}" />
            </aura:if>

            <!-- FACULTY FORM -->
            <aura:if isTrue="{!!v.showStudent}">
                <h3><b>Faculty Details</b></h3>
                <lightning:input label="Faculty Name" value="{!v.facName}"   />
                <lightning:input label="Faculty ID"   value="{!v.facultyId}" />
                <lightning:input label="Email"        value="{!v.facEmail}"  />
                <lightning:input label="Salary"       value="{!v.salary}"    type="number" />
                <lightning:input label="Department"   value="{!v.facDept}"   />
                <br/>
                <lightning:button label="Save Faculty" variant="brand" onclick="{!c.saveFaculty}" />
            </aura:if>

            <!-- MESSAGE -->
            <aura:if isTrue="{!v.message != ''}">
                <p><b>{!v.message}</b></p>
            </aura:if>

        </div>
    </lightning:card>

</aura:component>
```

---

### Controller Tab (.js)

```javascript
({
    // Show student form
    showStudentForm: function(component, event, helper) {
        component.set('v.showStudent', true);
        component.set('v.message', '');
    },

    // Show faculty form
    showFacultyForm: function(component, event, helper) {
        component.set('v.showStudent', false);
        component.set('v.message', '');
    },

    // Save Student
    saveStudent: function(component, event, helper) {
        var name       = component.get('v.stuName');
        var rollNumber = parseInt(component.get('v.rollNumber'));
        var marks      = parseFloat(component.get('v.marks'));
        var email      = component.get('v.stuEmail');
        var department = component.get('v.stuDept');

        // Validations
        if (!name)
            { component.set('v.message', 'Error: Student Name is required.'); return; }
        if (!rollNumber || rollNumber <= 0)
            { component.set('v.message', 'Error: Roll Number must be greater than 0.'); return; }
        if (isNaN(marks) || marks < 0 || marks > 100)
            { component.set('v.message', 'Error: Marks must be between 0 and 100.'); return; }
        if (!email || !email.includes('@'))
            { component.set('v.message', 'Error: Invalid email. Must contain @.'); return; }
        if (!department)
            { component.set('v.message', 'Error: Department is required.'); return; }

        // Call Apex
        var action = component.get('c.saveStudent');
        action.setParams({ name: name, rollNumber: rollNumber,
                           marks: marks, email: email, department: department });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.message', 'Success! Student saved successfully.');
                component.set('v.stuName', '');    component.set('v.rollNumber', '');
                component.set('v.marks', '');      component.set('v.stuEmail', '');
                component.set('v.stuDept', '');
            } else {
                component.set('v.message', 'Error: ' + response.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    },

    // Save Faculty
    saveFaculty: function(component, event, helper) {
        var name       = component.get('v.facName');
        var facultyId  = component.get('v.facultyId');
        var email      = component.get('v.facEmail');
        var salary     = parseFloat(component.get('v.salary'));
        var department = component.get('v.facDept');

        // Validations
        if (!name)
            { component.set('v.message', 'Error: Faculty Name is required.'); return; }
        if (!facultyId)
            { component.set('v.message', 'Error: Faculty ID is required.'); return; }
        if (!email || !email.includes('@'))
            { component.set('v.message', 'Error: Invalid email. Must contain @.'); return; }
        if (!salary || salary < 20000 || salary > 2000000)
            { component.set('v.message', 'Error: Salary must be between 20,000 and 20,00,000.'); return; }
        if (!department)
            { component.set('v.message', 'Error: Department is required.'); return; }

        // Call Apex
        var action = component.get('c.saveFaculty');
        action.setParams({ name: name, facultyId: facultyId,
                           email: email, salary: salary, department: department });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.message', 'Success! Faculty saved successfully.');
                component.set('v.facName', '');    component.set('v.facultyId', '');
                component.set('v.facEmail', '');   component.set('v.salary', '');
                component.set('v.facDept', '');
            } else {
                component.set('v.message', 'Error: ' + response.getError()[0].message);
            }
        });
        $A.enqueueAction(action);
    }
})
```

4. Press **Ctrl+S** after each tab

---

## Part D — Add to Page and Test

1. **Setup → Lightning App Builder → New → App Page**
2. Name: `College App` → **Next** → Choose layout → **Done**
3. Find **CollegeForm** in left sidebar under Custom → drag onto canvas
4. **Save → Activate → Open**

### Test Student Validations

| Test | Input | Expected |
|------|-------|----------|
| Roll Number = 0 | `0` | Error: Roll Number must be greater than 0 |
| Roll Number negative | `-5` | Error: Roll Number must be greater than 0 |
| Marks > 100 | `110` | Error: Marks must be between 0 and 100 |
| Marks < 0 | `-5` | Error: Marks must be between 0 and 100 |
| No @ in email | `test.com` | Error: Invalid email. Must contain @ |
| All valid | correct values | Success! Student saved successfully |

### Test Faculty Validations

| Test | Input | Expected |
|------|-------|----------|
| Duplicate Faculty ID | repeat ID | Error: Faculty ID already exists |
| No @ in email | `test.com` | Error: Invalid email. Must contain @ |
| Salary too low | `5000` | Error: Salary must be between 20,000 and 20,00,000 |
| All valid | correct values | Success! Faculty saved successfully |

---

## Full Code

### CollegeController.cls

```apex
public with sharing class CollegeController {

    @AuraEnabled
    public static void saveStudent(String name, Integer rollNumber, Decimal marks,
                                   String email, String department) {
        if (rollNumber <= 0)
            throw new AuraHandledException('Roll Number must be greater than 0.');
        if (marks < 0 || marks > 100)
            throw new AuraHandledException('Marks must be between 0 and 100.');
        if (!email.contains('@'))
            throw new AuraHandledException('Invalid email. Must contain @.');

        College_Student__c student = new College_Student__c();
        student.Name = name; student.Roll_Number__c = rollNumber;
        student.Marks__c = marks; student.Email__c = email;
        student.Department__c = department;
        insert student;
    }

    @AuraEnabled
    public static void saveFaculty(String name, String facultyId, String email,
                                   Decimal salary, String department) {
        List<Faculty__c> existing = [SELECT Id FROM Faculty__c WHERE Faculty_ID__c = :facultyId];
        if (!existing.isEmpty())
            throw new AuraHandledException('Faculty ID already exists.');
        if (!email.contains('@'))
            throw new AuraHandledException('Invalid email. Must contain @.');
        if (salary < 20000 || salary > 2000000)
            throw new AuraHandledException('Salary must be between 20,000 and 20,00,000.');

        Faculty__c faculty = new Faculty__c();
        faculty.Name = name; faculty.Faculty_ID__c = facultyId;
        faculty.Email__c = email; faculty.Salary__c = salary;
        faculty.Department__c = department;
        insert faculty;
    }
}
```

---

## Code Explanation

### Toggle using `showStudent` boolean

```html
<aura:attribute name="showStudent" type="Boolean" default="true"/>

<aura:if isTrue="{!v.showStudent}">   ← Student form (true = show)
<aura:if isTrue="{!!v.showStudent}">  ← Faculty form (!true = false = show when student hidden)
```

```javascript
showStudentForm: function(component) { component.set('v.showStudent', true);  }
showFacultyForm: function(component) { component.set('v.showStudent', false); }
```

`{!!v.showStudent}` — double `!` is logical NOT. So when `showStudent = false`, `!false = true`, faculty form shows.

### Two Apex methods, two JS actions

```javascript
// Student save
var action = component.get('c.saveStudent');
action.setParams({ name, rollNumber, marks, email, department });

// Faculty save
var action = component.get('c.saveFaculty');
action.setParams({ name, facultyId, email, salary, department });
```

`c.saveStudent` → calls `saveStudent` in Apex class.  
`c.saveFaculty` → calls `saveFaculty` in Apex class.

---

## Cheat Sheet

```
TOGGLE BETWEEN TWO FORMS
  <aura:attribute name="showStudent" type="Boolean" default="true"/>
  <aura:if isTrue="{!v.showStudent}">   Student Form  </aura:if>
  <aura:if isTrue="{!!v.showStudent}">  Faculty Form  </aura:if>

CALL APEX (pattern to memorize)
  var action = component.get('c.apexMethodName');   // 1. get
  action.setParams({ param1: val1, ... });           // 2. params
  action.setCallback(this, function(response) {      // 3. callback
      if (response.getState() === 'SUCCESS') { ... }
      else { response.getError()[0].message }
  });
  $A.enqueueAction(action);                          // 4. fire

VALIDATION PATTERNS
  Roll > 0:     rollNumber <= 0
  Marks 0–100:  marks < 0 || marks > 100
  Email has @:  !email.includes('@')
  Salary range: salary < 20000 || salary > 2000000
  Unique ID:    checked in Apex via SOQL + AuraHandledException

READ/WRITE ATTRIBUTES
  component.get('v.attrName')           ← read
  component.set('v.attrName', value)    ← write
```

---

## Quick Steps (Exam Reference)

```
1. Create TWO objects in Setup:
   College_Student__c → Roll_Number__c (Number), Marks__c (Number),
                         Email__c (Email), Department__c (Text)
   Faculty__c         → Faculty_ID__c (Text), Email__c (Email),
                         Salary__c (Number), Department__c (Text)

2. Developer Console → New Apex Class → CollegeController → paste → Ctrl+S

3. Developer Console → New Lightning Component → CollegeForm → Submit
   Component tab → paste .cmp code → Ctrl+S
   Controller tab → paste .js code  → Ctrl+S

4. Setup → Lightning App Builder → New → App Page
   Drag CollegeForm → Save → Activate → Open and test both forms
```

---

## Comparison: PS 20 vs PS 23

| | PS 20 — Employee | PS 23 — College |
|-|-----------------|-----------------|
| Objects | 1 (Employee__c) | 2 (College_Student__c + Faculty__c) |
| Apex methods | 1 (saveEmployee) | 2 (saveStudent + saveFaculty) |
| Forms | 1 form | 2 forms with toggle |
| Toggle | Not needed | `showStudent` boolean |
| Extra validations | Joining date not future | Marks 0–100, Roll > 0 |
| Unique check | Emp ID (in Apex) | Faculty ID (in Apex) |
