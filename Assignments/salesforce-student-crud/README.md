# PS 16 — Student Record Management (Apex + Visualforce CRUD)

**Assignment:** Create a custom object for Student with fields Name, Roll No, Class, Mobile No.  
Build an Apex controller and Visualforce page to Create, Read, Update, and Delete student records.

---

## Table of Contents

1. [What You Will Build](#what-you-will-build)
2. [Part A — Create Custom Object](#part-a--create-custom-object)
3. [Part B — Add Custom Fields](#part-b--add-custom-fields)
4. [Part C — Create Apex Controller](#part-c--create-apex-controller)
5. [Part D — Create Visualforce Page](#part-d--create-visualforce-page)
6. [Part E — Run and Test](#part-e--run-and-test)
7. [Full Code Reference](#full-code-reference)
8. [Code Explanation](#code-explanation)
9. [Key Concepts Cheat Sheet](#key-concepts-cheat-sheet)

---

## What You Will Build

A Visualforce page with:
- A **form** to add a new student or edit an existing one
- A **table** listing all student records
- **Edit** link per row — loads that student into the form
- **Delete** link per row — deletes with a confirm popup
- **Save** button — inserts new or updates existing record
- **Cancel** button — clears the form

---

## Part A — Create Custom Object

1. Click the **gear icon (⚙️)** → **Setup**
2. In the top search bar of Setup, type: `Object Manager`
3. Click **Object Manager**
4. Click the **Create** dropdown (top right) → **Custom Object**
5. Fill in:
   - **Label:** `Student`
   - **Plural Label:** `Students`
   - **Object Name:** `Student` (auto-filled)
   - Leave everything else as default
6. Scroll down and click **Save**

> After saving, you will be on the Student object detail page. Stay here for Part B.

---

## Part B — Add Custom Fields

You need to add 3 fields (Name already exists as standard):

### Field 1 — Roll No

1. On the Student object page, click **Fields & Relationships** (left sidebar)
2. Click **New**
3. Select data type: **Number** → **Next**
4. Fill in:
   - **Field Label:** `Roll No`
   - **Field Name:** `Roll_No` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `0`
5. Click **Next → Next → Save**

### Field 2 — Class

1. Click **New** again
2. Select data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Class`
   - **Field Name:** `Class` (auto-filled)
   - **Length:** `50`
4. Click **Next → Next → Save**

### Field 3 — Mobile No

1. Click **New** again
2. Select data type: **Phone** → **Next**
3. Fill in:
   - **Field Label:** `Mobile No`
   - **Field Name:** `Mobile_No` (auto-filled)
4. Click **Next → Next → Save**

> Your object now has: `Name`, `Roll_No__c`, `Class__c`, `Mobile_No__c`  
> Salesforce automatically adds `__c` to custom field API names.

---

## Part C — Create Apex Controller

1. Click **gear icon → Developer Console**
2. **File → New → Apex Class**
3. Name: `StudentController` → OK
4. Delete everything and paste the code below
5. **Ctrl + S** to save

```apex
public class StudentController {

    public Student__c student      { get; set; }
    public String selectedId       { get; set; }
    public List<Student__c> studentList { get; set; }

    public StudentController() {
        student = new Student__c();
        loadStudents();
    }

    private void loadStudents() {
        studentList = [SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
                       FROM Student__c
                       ORDER BY Name];
    }

    // CREATE or UPDATE
    public void saveStudent() {
        upsert student;
        student = new Student__c();
        loadStudents();
    }

    // Load selected record into form
    public void editStudent() {
        student = [SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
                   FROM Student__c
                   WHERE Id = :selectedId];
    }

    // DELETE selected record
    public void deleteStudent() {
        delete [SELECT Id FROM Student__c WHERE Id = :selectedId];
        student = new Student__c();
        loadStudents();
    }

    // Clear the form
    public void cancelEdit() {
        student = new Student__c();
    }
}
```

---

## Part D — Create Visualforce Page

1. In Developer Console: **File → New → Visualforce Page**
2. Name: `StudentPage` → OK
3. Delete everything and paste the code below
4. **Ctrl + S** to save

```xml
<apex:page controller="StudentController">

    <h2>Student Record Management</h2>

    <apex:form>

        <!-- ADD / EDIT FORM -->
        <apex:pageBlock title="Add / Edit Student">
            <apex:pageBlockSection>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Name:</apex:outputLabel>
                    <apex:inputField value="{!student.Name}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Roll No:</apex:outputLabel>
                    <apex:inputField value="{!student.Roll_No__c}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Class:</apex:outputLabel>
                    <apex:inputField value="{!student.Class__c}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Mobile No:</apex:outputLabel>
                    <apex:inputField value="{!student.Mobile_No__c}" />
                </apex:pageBlockSectionItem>

            </apex:pageBlockSection>

            <apex:commandButton value="Save"   action="{!saveStudent}" />
            &nbsp;
            <apex:commandButton value="Cancel" action="{!cancelEdit}" immediate="true" />

        </apex:pageBlock>

        <!-- STUDENT LIST TABLE -->
        <apex:pageBlock title="All Students">
            <apex:pageBlockTable value="{!studentList}" var="s">

                <apex:column headerValue="Name"      value="{!s.Name}" />
                <apex:column headerValue="Roll No"   value="{!s.Roll_No__c}" />
                <apex:column headerValue="Class"     value="{!s.Class__c}" />
                <apex:column headerValue="Mobile No" value="{!s.Mobile_No__c}" />

                <apex:column headerValue="Edit">
                    <apex:commandLink value="Edit" action="{!editStudent}">
                        <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>

                <apex:column headerValue="Delete">
                    <apex:commandLink value="Delete" action="{!deleteStudent}"
                                      onclick="return confirm('Are you sure?')">
                        <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>

            </apex:pageBlockTable>
        </apex:pageBlock>

    </apex:form>

</apex:page>
```

---

## Part E — Run and Test

### Open the page
- Click **Preview** in Developer Console, OR
- Go to: `https://<your-org>.salesforce.com/apex/StudentPage`

### Test Create
1. Fill in Name, Roll No, Class, Mobile No
2. Click **Save**
3. Record appears in the table below

### Test Edit
1. Click **Edit** on any row
2. The form fills with that student's data
3. Change any field → Click **Save**
4. Table updates with new values

### Test Delete
1. Click **Delete** on any row
2. A confirm popup appears — click OK
3. Record is removed from the table

### Test Cancel
1. Click Edit on a row (form fills)
2. Click **Cancel**
3. Form clears without saving any changes

---

## Full Code Reference

### StudentController.cls

```apex
public class StudentController {

    public Student__c student      { get; set; }
    public String selectedId       { get; set; }
    public List<Student__c> studentList { get; set; }

    public StudentController() {
        student = new Student__c();
        loadStudents();
    }

    private void loadStudents() {
        studentList = [SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
                       FROM Student__c
                       ORDER BY Name];
    }

    public void saveStudent() {
        upsert student;
        student = new Student__c();
        loadStudents();
    }

    public void editStudent() {
        student = [SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
                   FROM Student__c
                   WHERE Id = :selectedId];
    }

    public void deleteStudent() {
        delete [SELECT Id FROM Student__c WHERE Id = :selectedId];
        student = new Student__c();
        loadStudents();
    }

    public void cancelEdit() {
        student = new Student__c();
    }
}
```

### StudentPage.page

```xml
<apex:page controller="StudentController">

    <h2>Student Record Management</h2>

    <apex:form>

        <apex:pageBlock title="Add / Edit Student">
            <apex:pageBlockSection>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Name:</apex:outputLabel>
                    <apex:inputField value="{!student.Name}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Roll No:</apex:outputLabel>
                    <apex:inputField value="{!student.Roll_No__c}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Class:</apex:outputLabel>
                    <apex:inputField value="{!student.Class__c}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Mobile No:</apex:outputLabel>
                    <apex:inputField value="{!student.Mobile_No__c}" />
                </apex:pageBlockSectionItem>

            </apex:pageBlockSection>

            <apex:commandButton value="Save"   action="{!saveStudent}" />
            &nbsp;
            <apex:commandButton value="Cancel" action="{!cancelEdit}" immediate="true" />

        </apex:pageBlock>

        <apex:pageBlock title="All Students">
            <apex:pageBlockTable value="{!studentList}" var="s">

                <apex:column headerValue="Name"      value="{!s.Name}" />
                <apex:column headerValue="Roll No"   value="{!s.Roll_No__c}" />
                <apex:column headerValue="Class"     value="{!s.Class__c}" />
                <apex:column headerValue="Mobile No" value="{!s.Mobile_No__c}" />

                <apex:column headerValue="Edit">
                    <apex:commandLink value="Edit" action="{!editStudent}">
                        <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>

                <apex:column headerValue="Delete">
                    <apex:commandLink value="Delete" action="{!deleteStudent}"
                                      onclick="return confirm('Are you sure?')">
                        <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>

            </apex:pageBlockTable>
        </apex:pageBlock>

    </apex:form>

</apex:page>
```

---

## Code Explanation

### Apex Controller

| Code | What it does |
|------|-------------|
| `public Student__c student { get; set; }` | Holds the current form data (one student) |
| `public String selectedId { get; set; }` | Stores the Id of the row you clicked Edit/Delete on |
| `public List<Student__c> studentList { get; set; }` | Holds all records shown in the table |
| `new Student__c()` | Creates an empty student object (blank form) |
| `loadStudents()` | Runs a SOQL query to fetch all students from database |
| `upsert student` | If student has no Id → INSERT. If it has Id → UPDATE. One keyword does both. |
| `editStudent()` | Queries the record by `selectedId` and puts it in the form |
| `deleteStudent()` | Deletes the record by `selectedId`, then refreshes the list |
| `cancelEdit()` | Resets student to empty → form clears |

### SOQL Query

```sql
SELECT Id, Name, Roll_No__c, Class__c, Mobile_No__c
FROM Student__c
ORDER BY Name
```

- `Student__c` — custom object (always has `__c`)
- `Roll_No__c`, `Class__c`, `Mobile_No__c` — custom fields (always have `__c`)
- `Id`, `Name` — standard fields (no `__c`)

### Visualforce Page

| Tag | What it does |
|-----|-------------|
| `controller="StudentController"` | Links this page to the Apex class |
| `<apex:inputField value="{!student.Name}">` | Input bound to the student's Name field |
| `<apex:commandButton action="{!saveStudent}">` | Calls saveStudent() in Apex on click |
| `immediate="true"` on Cancel | Skips validation — just runs the action directly |
| `<apex:pageBlockTable value="{!studentList}" var="s">` | Loops through studentList, each row is `s` |
| `<apex:column value="{!s.Name}">` | Shows the Name field for each row `s` |
| `<apex:commandLink action="{!editStudent}">` | Clickable link that calls editStudent() |
| `<apex:param assignTo="{!selectedId}">` | Before calling the action, sets `selectedId` in Apex to the clicked row's Id |
| `onclick="return confirm('...')"` | Browser popup — if user clicks Cancel, action is not called |

---

## Key Concepts Cheat Sheet

```
CUSTOM OBJECT NAMING
    Object API name:  Student__c       (add __c to Object Name)
    Field API name:   Roll_No__c       (add __c to Field Name)
    Standard fields:  Id, Name         (no __c)

UPSERT — the exam trick
    upsert student;
    → If student.Id is null  → INSERT (new record)
    → If student.Id has value → UPDATE (existing record)
    One keyword handles both Create and Update!

SOQL QUERY SYNTAX
    [SELECT fields FROM Object__c WHERE condition]
    [SELECT Id, Name FROM Student__c WHERE Id = :selectedId]
    The colon : binds an Apex variable into the query

LIST
    List<Student__c> studentList = [SELECT ...];
    Stores multiple records

PASSING ROW ID TO CONTROLLER
    <apex:commandLink action="{!editStudent}">
        <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
    </apex:commandLink>
    assignTo sets selectedId in Apex before the action runs

TABLE LOOP
    <apex:pageBlockTable value="{!studentList}" var="s">
        value = the list from Apex
        var   = alias for each item in the loop (like for-each)
```

---

## Summary of Steps (Quick Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Student | Plural: Students | Save

2. Fields & Relationships → New (repeat 3 times)
   Roll No  → Number,  Length 10, Decimal 0
   Class    → Text,    Length 50
   Mobile No → Phone

3. Developer Console → File → New → Apex Class
   Name: StudentController → paste code → Ctrl+S

4. Developer Console → File → New → Visualforce Page
   Name: StudentPage → paste code → Ctrl+S

5. Click Preview or visit /apex/StudentPage
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Variable does not exist: Roll_No__c` | Field not created yet | Go back and create the field in Object Manager |
| `Type not found: Student__c` | Object not created or typo | Check Object Manager, make sure API name is `Student` |
| Table shows no records | loadStudents not called | Make sure constructor calls `loadStudents()` |
| Edit fills wrong record | selectedId not set | Make sure `assignTo="{!selectedId}"` is on the `apex:param` |
| Delete does nothing | Same as above | Check `assignTo` on Delete's `apex:param` |

---

## PS 19 Adaptation (Product Inventory)

To do PS 19, just swap the object and fields:

| PS 16 (Student) | PS 19 (Product) |
|-----------------|-----------------|
| `Student__c` | `Product_Inventory__c` |
| `Roll_No__c` (Number) | `Serial_No__c` (Text) |
| `Class__c` (Text) | `Manufacture_Date__c` (Date) |
| `Mobile_No__c` (Phone) | `Expiry_Date__c` (Date) |

The Apex logic and Visualforce structure stays **100% identical** — just rename the object, fields, and labels.
