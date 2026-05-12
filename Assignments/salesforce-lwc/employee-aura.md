# PS 20 — Employee Management (Aura Component)
## Done entirely in Developer Console — No downloads needed

**Fields:** Name, Employee ID, Salary, Email, Department, Joining Date  
**Validations:** Name ≥ 3 chars | Unique ID | Salary 10K–10L | Email format | Department not empty | Joining date not future  
**Tool:** Salesforce Developer Console only

---

## Table of Contents
1. [Aura vs LWC — Why Aura](#aura-vs-lwc--why-aura)
2. [Part A — Create Custom Object and Fields](#part-a--create-custom-object-and-fields)
3. [Part B — Create Apex Controller](#part-b--create-apex-controller)
4. [Part C — Create Aura Component](#part-c--create-aura-component)
5. [Part D — Add to a Lightning Page and Test](#part-d--add-to-a-lightning-page-and-test)
6. [Full Code](#full-code)
7. [Code Explanation](#code-explanation)
8. [Cheat Sheet](#cheat-sheet)

---

## Aura vs LWC — Why Aura

| LWC | Aura |
|-----|------|
| Needs VS Code + Salesforce CLI | Works in Developer Console |
| Needs Node.js installed | Zero external tools |
| Modern syntax | Older but simpler for exams |
| `.html` + `.js` + `.xml` | `.cmp` + Controller `.js` |

> Aura Components are created directly in **Developer Console → File → New → Lightning Component**

---

## Part A — Create Custom Object and Fields

1. **Gear icon → Setup → Object Manager → Create → Custom Object**
2. Label: `Employee` | Plural: `Employees` | Object Name: `Employee` → **Save**

### Fields (Fields & Relationships → New)

| Field Label | Type | Details |
|-------------|------|---------|
| Emp ID | Text | Length: 20 |
| Email | Email | — |
| Department | Text | Length: 50 |
| Salary | Number | Length: 10, Decimal: 2 |
| Joining Date | Date | — |

> `Name` is standard — used as employee name, no need to create it.

---

## Part B — Create Apex Controller

1. **Developer Console → File → New → Apex Class**
2. Name: `EmployeeController` → OK
3. Paste code → **Ctrl+S**

```apex
public with sharing class EmployeeController {

    @AuraEnabled
    public static void saveEmployee(String name, String empId, Decimal salary,
                                    String email, String department, String joiningDate) {

        // Check unique Emp ID
        List<Employee__c> existing = [SELECT Id FROM Employee__c WHERE Emp_ID__c = :empId];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Employee ID already exists. Use a unique ID.');
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

> Same Apex as LWC — `@AuraEnabled` works for both Aura and LWC.

---

## Part C — Create Aura Component

### Step 1 — Create the component bundle

1. **Developer Console → File → New → Lightning Component**
2. Name: `EmployeeForm` → **Submit**
3. A panel opens with multiple tabs: **Component**, Controller, Helper, Style...
4. You only need to fill **Component** tab and **Controller** tab

---

### Step 2 — Component tab (the UI template)

Click the **Component** tab and paste:

```html
<aura:component controller="EmployeeController"
                implements="flexipage:availableForAllPageTypes">

    <!-- Properties (like @track in LWC) -->
    <aura:attribute name="empName"     type="String"  default=""/>
    <aura:attribute name="empId"       type="String"  default=""/>
    <aura:attribute name="salary"      type="String"  default=""/>
    <aura:attribute name="email"       type="String"  default=""/>
    <aura:attribute name="department"  type="String"  default=""/>
    <aura:attribute name="joiningDate" type="String"  default=""/>
    <aura:attribute name="message"     type="String"  default=""/>

    <lightning:card title="Employee Management">
        <div class="slds-p-around_medium">

            <lightning:input label="Name"          value="{!v.empName}"     />
            <lightning:input label="Employee ID"   value="{!v.empId}"       />
            <lightning:input label="Salary"        value="{!v.salary}"      type="number" />
            <lightning:input label="Email"         value="{!v.email}"       />
            <lightning:input label="Department"    value="{!v.department}"  />
            <lightning:input label="Joining Date"  value="{!v.joiningDate}" type="date" />

            <br/>
            <lightning:button label="Save Employee" variant="brand"
                              onclick="{!c.saveEmployee}" />

            <aura:if isTrue="{!v.message != ''}">
                <p><b>{!v.message}</b></p>
            </aura:if>

        </div>
    </lightning:card>

</aura:component>
```

---

### Step 3 — Controller tab (validation + Apex call)

Click the **Controller** tab and paste:

```javascript
({
    saveEmployee: function(component, event, helper) {

        // Get values from form
        var name        = component.get('v.empName');
        var empId       = component.get('v.empId');
        var salary      = parseFloat(component.get('v.salary'));
        var email       = component.get('v.email');
        var department  = component.get('v.department');
        var joiningDate = component.get('v.joiningDate');

        // ----- VALIDATIONS -----

        if (!name || name.length < 3) {
            component.set('v.message', 'Error: Name must be at least 3 characters.');
            return;
        }
        if (!empId) {
            component.set('v.message', 'Error: Employee ID is required.');
            return;
        }
        if (!salary || salary < 10000 || salary > 1000000) {
            component.set('v.message', 'Error: Salary must be between 10,000 and 10,00,000.');
            return;
        }
        if (!email || !email.includes('@') || !email.includes('.')) {
            component.set('v.message', 'Error: Invalid email. Must contain @ and .');
            return;
        }
        if (!department) {
            component.set('v.message', 'Error: Department is required.');
            return;
        }
        if (!joiningDate) {
            component.set('v.message', 'Error: Joining Date is required.');
            return;
        }
        var today = new Date().toISOString().split('T')[0];
        if (joiningDate > today) {
            component.set('v.message', 'Error: Joining Date cannot be in the future.');
            return;
        }

        // ----- CALL APEX -----

        var action = component.get('c.saveEmployee');
        action.setParams({
            name:        name,
            empId:       empId,
            salary:      salary,
            email:       email,
            department:  department,
            joiningDate: joiningDate
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.message', 'Success! Employee saved successfully.');
                component.set('v.empName', '');
                component.set('v.empId', '');
                component.set('v.salary', '');
                component.set('v.email', '');
                component.set('v.department', '');
                component.set('v.joiningDate', '');
            } else {
                var errors = response.getError();
                component.set('v.message', 'Error: ' + errors[0].message);
            }
        });

        $A.enqueueAction(action);
    }
})
```

4. Press **Ctrl+S** to save

---

## Part D — Add to a Lightning Page and Test

1. **Gear icon → Setup**
2. Search: `Lightning App Builder` → Click it
3. Click **New**
4. Select **App Page** → **Next**
5. Name: `Employee App` → **Next**
6. Choose layout (one region) → **Done**
7. In left sidebar under **Custom**, find **EmployeeForm**
8. Drag it onto the canvas
9. Click **Save** → Click **Activate** → **Activate**
10. Click the **Back** arrow → Click **Employee App** to open it

### Test all validations

| What to test | Input | Expected message |
|-------------|-------|-----------------|
| Short name | `Jo` | Error: Name must be at least 3 characters |
| Empty ID | leave blank | Error: Employee ID is required |
| Low salary | `5000` | Error: Salary must be between 10,000 and 10,00,000 |
| Bad email | `hello` | Error: Invalid email. Must contain @ and . |
| No department | leave blank | Error: Department is required |
| Future date | tomorrow | Error: Joining Date cannot be in the future |
| Duplicate ID | repeat same ID | Error: Employee ID already exists |
| All valid | correct values | Success! Employee saved successfully |

---

## Full Code

### Apex — EmployeeController.cls

```apex
public with sharing class EmployeeController {

    @AuraEnabled
    public static void saveEmployee(String name, String empId, Decimal salary,
                                    String email, String department, String joiningDate) {

        List<Employee__c> existing = [SELECT Id FROM Employee__c WHERE Emp_ID__c = :empId];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Employee ID already exists. Use a unique ID.');
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

### Aura — EmployeeForm.cmp (Component tab)

```html
<aura:component controller="EmployeeController"
                implements="flexipage:availableForAllPageTypes">

    <aura:attribute name="empName"     type="String" default=""/>
    <aura:attribute name="empId"       type="String" default=""/>
    <aura:attribute name="salary"      type="String" default=""/>
    <aura:attribute name="email"       type="String" default=""/>
    <aura:attribute name="department"  type="String" default=""/>
    <aura:attribute name="joiningDate" type="String" default=""/>
    <aura:attribute name="message"     type="String" default=""/>

    <lightning:card title="Employee Management">
        <div class="slds-p-around_medium">
            <lightning:input label="Name"         value="{!v.empName}"     />
            <lightning:input label="Employee ID"  value="{!v.empId}"       />
            <lightning:input label="Salary"       value="{!v.salary}"      type="number" />
            <lightning:input label="Email"        value="{!v.email}"       />
            <lightning:input label="Department"   value="{!v.department}"  />
            <lightning:input label="Joining Date" value="{!v.joiningDate}" type="date" />
            <br/>
            <lightning:button label="Save Employee" variant="brand" onclick="{!c.saveEmployee}" />
            <aura:if isTrue="{!v.message != ''}">
                <p><b>{!v.message}</b></p>
            </aura:if>
        </div>
    </lightning:card>

</aura:component>
```

### Aura — EmployeeFormController.js (Controller tab)

```javascript
({
    saveEmployee: function(component, event, helper) {

        var name        = component.get('v.empName');
        var empId       = component.get('v.empId');
        var salary      = parseFloat(component.get('v.salary'));
        var email       = component.get('v.email');
        var department  = component.get('v.department');
        var joiningDate = component.get('v.joiningDate');

        if (!name || name.length < 3)
            { component.set('v.message', 'Error: Name must be at least 3 characters.'); return; }
        if (!empId)
            { component.set('v.message', 'Error: Employee ID is required.'); return; }
        if (!salary || salary < 10000 || salary > 1000000)
            { component.set('v.message', 'Error: Salary must be between 10,000 and 10,00,000.'); return; }
        if (!email || !email.includes('@') || !email.includes('.'))
            { component.set('v.message', 'Error: Invalid email. Must contain @ and .'); return; }
        if (!department)
            { component.set('v.message', 'Error: Department is required.'); return; }
        if (!joiningDate)
            { component.set('v.message', 'Error: Joining Date is required.'); return; }
        var today = new Date().toISOString().split('T')[0];
        if (joiningDate > today)
            { component.set('v.message', 'Error: Joining Date cannot be in the future.'); return; }

        var action = component.get('c.saveEmployee');
        action.setParams({ name: name, empId: empId, salary: salary,
                           email: email, department: department, joiningDate: joiningDate });

        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.message', 'Success! Employee saved successfully.');
                component.set('v.empName', '');   component.set('v.empId', '');
                component.set('v.salary', '');    component.set('v.email', '');
                component.set('v.department', ''); component.set('v.joiningDate', '');
            } else {
                component.set('v.message', 'Error: ' + response.getError()[0].message);
            }
        });

        $A.enqueueAction(action);
    }
})
```

---

## Code Explanation

### Aura Component (.cmp) — Line by Line

| Code | What it does |
|------|-------------|
| `controller="EmployeeController"` | Links to the Apex class |
| `implements="flexipage:availableForAllPageTypes"` | Makes it available in Lightning App Builder |
| `<aura:attribute name="empName" type="String" default=""/>` | Declares a property (like `@track` in LWC) |
| `value="{!v.empName}"` | Binds input to the attribute `empName` (`v` = view = component attributes) |
| `onclick="{!c.saveEmployee}"` | Calls `saveEmployee` in Controller (`c` = controller) |
| `<aura:if isTrue="{!v.message != ''}">` | Shows block only if message is not empty |
| `{!v.message}` | Displays the message attribute value |

### Aura Controller (.js) — Line by Line

| Code | What it does |
|------|-------------|
| `component.get('v.empName')` | Read the value of attribute `empName` |
| `component.set('v.message', 'Error: ...')` | Write a value to attribute `message` |
| `component.get('c.saveEmployee')` | Get reference to the Apex method |
| `action.setParams({ name: name, ... })` | Pass parameters to the Apex method |
| `action.setCallback(this, function(response) {...})` | Handle the Apex response |
| `response.getState()` | Returns `'SUCCESS'` or `'ERROR'` |
| `response.getError()[0].message` | Get error message from Apex AuraHandledException |
| `$A.enqueueAction(action)` | Actually fires the Apex call |

---

## Cheat Sheet

```
AURA ATTRIBUTE (property)
  <aura:attribute name="propName" type="String" default=""/>

READ ATTRIBUTE IN JS
  component.get('v.propName')

WRITE ATTRIBUTE IN JS
  component.set('v.propName', 'new value')

BIND IN HTML
  value="{!v.propName}"

CALL CONTROLLER METHOD FROM BUTTON
  onclick="{!c.methodName}"

CONTROLLER FUNCTION STRUCTURE
  ({
      methodName: function(component, event, helper) {
          // your code here
      }
  })

CALL APEX FROM AURA (3 steps)
  var action = component.get('c.apexMethodName');  // 1. get reference
  action.setParams({ param: value });               // 2. set params
  action.setCallback(this, function(response) {     // 3. handle result
      if (response.getState() === 'SUCCESS') { ... }
      else { response.getError()[0].message }
  });
  $A.enqueueAction(action);                         // 4. fire it

CONDITIONAL RENDER
  <aura:if isTrue="{!v.message != ''}">...</aura:if>

TODAY'S DATE IN JS
  new Date().toISOString().split('T')[0]   → '2024-05-07'
```

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create Employee__c
   Add fields: Emp_ID__c (Text), Email__c (Email),
               Department__c (Text), Salary__c (Number), Joining_Date__c (Date)

2. Developer Console → File → New → Apex Class
   Name: EmployeeController → paste code → Ctrl+S

3. Developer Console → File → New → Lightning Component
   Name: EmployeeForm → Submit
   → Component tab: paste .cmp code → Ctrl+S
   → Controller tab: paste .js code  → Ctrl+S

4. Setup → Lightning App Builder → New → App Page
   Drag EmployeeForm → Save → Activate → Open and test
```
