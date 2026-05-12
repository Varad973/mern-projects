# PS 16 — Student Record Management
## Apex + Visualforce CRUD (Create, Read, Update, Delete)

**Fields:** Name, Roll No, Class, Mobile No  
**Object:** `Student__c`  
**Apex Class:** `StudentController`  
**Visualforce Page:** `StudentPage`

---

## Table of Contents
1. [What You Will Build](#what-you-will-build)
2. [Part A — Create Custom Object](#part-a--create-custom-object)
3. [Part B — Add Custom Fields](#part-b--add-custom-fields)
4. [Part C — Create Apex Class](#part-c--create-apex-class)
5. [Part D — Create Visualforce Page](#part-d--create-visualforce-page)
6. [Part E — Run and Test](#part-e--run-and-test)
7. [Full Code](#full-code)
8. [Code Explanation](#code-explanation)
9. [Cheat Sheet](#cheat-sheet)

---

## What You Will Build

A Visualforce page with:
- A **form** to add a new student or edit an existing one
- A **table** listing all student records
- **Edit** link per row — loads that student's data into the form
- **Delete** link per row — deletes with a browser confirm popup
- **Save** button — inserts a new record OR updates existing one (using `upsert`)
- **Cancel** button — clears the form without saving

---

## Part A — Create Custom Object

1. Click **gear icon (⚙️)** top right → **Setup**
2. In the Setup search bar type: `Object Manager`
3. Click **Object Manager**
4. Click the **Create** dropdown (top right of page) → **Custom Object**
5. Fill in:
   - **Label:** `Student`
   - **Plural Label:** `Students`
   - **Object Name:** `Student` ← auto-filled, leave it
6. Scroll down → click **Save**

> You are now on the Student object page. Stay here for Part B.

---

## Part B — Add Custom Fields

Go to **Fields & Relationships** in the left sidebar of the Student object page.

### Field 1 — Roll No

1. Click **New**
2. Data type: **Number** → **Next**
3. Fill in:
   - **Field Label:** `Roll No`
   - **Field Name:** `Roll_No` (auto-filled)
   - **Length:** `10`
   - **Decimal Places:** `0`
4. Click **Next → Next → Save**

### Field 2 — Class

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Class`
   - **Field Name:** `Class` (auto-filled)
   - **Length:** `50`
4. Click **Next → Next → Save**

### Field 3 — Mobile No

1. Click **New**
2. Data type: **Phone** → **Next**
3. Fill in:
   - **Field Label:** `Mobile No`
   - **Field Name:** `Mobile_No` (auto-filled)
4. Click **Next → Next → Save**

> After this, your object has these API field names:
> - `Name` (standard, no `__c`)
> - `Roll_No__c`
> - `Class__c`
> - `Mobile_No__c`

---

## Part C — Create Apex Class

1. Click **gear icon → Developer Console**
2. **File → New → Apex Class**
3. Name: `StudentController` → **OK**
4. Delete all existing code and paste:

```apex
public class StudentController {

    public Student__c student           { get; set; }
    public String selectedId            { get; set; }
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

5. Press **Ctrl + S** to save

---

## Part D — Create Visualforce Page

1. In Developer Console: **File → New → Visualforce Page**
2. Name: `StudentPage` → **OK**
3. Delete all existing code and paste:

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
                                      onclick="return confirm('Are you sure you want to delete this record?')">
                        <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>

            </apex:pageBlockTable>
        </apex:pageBlock>

    </apex:form>

</apex:page>
```

4. Press **Ctrl + S** to save

---

## Part E — Run and Test

### Open the page
- Click **Preview** in Developer Console, OR
- In your browser go to: `https://<your-org>.salesforce.com/apex/StudentPage`

### Test Create (INSERT)
1. Fill in: Name, Roll No, Class, Mobile No
2. Click **Save**
3. New row appears in the table

### Test Read
- All records automatically display in the table on page load

### Test Update (EDIT)
1. Click **Edit** on any row
2. Form fills with that student's data
3. Change any field → Click **Save**
4. Row updates in the table

### Test Delete
1. Click **Delete** on any row
2. Browser confirm popup → click **OK**
3. Row is removed from the table

### Test Cancel
1. Click **Edit** on any row (form fills)
2. Click **Cancel**
3. Form clears, no changes saved

---

## Full Code

### StudentController.cls

```apex
public class StudentController {

    public Student__c student           { get; set; }
    public String selectedId            { get; set; }
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

### Apex Controller — Line by Line

| Code | What it does |
|------|-------------|
| `public Student__c student { get; set; }` | Holds the current form's student record |
| `public String selectedId { get; set; }` | Stores the Id of the row clicked in the table |
| `public List<Student__c> studentList { get; set; }` | Holds all student records for the table |
| `new Student__c()` | Creates an empty student — gives a blank form |
| `loadStudents()` | SOQL query — fetches all students from database |
| `upsert student` | INSERT if no Id, UPDATE if Id exists — one keyword does both |
| `editStudent()` | Queries DB by `selectedId`, loads record into form |
| `deleteStudent()` | Deletes by `selectedId`, clears form, refreshes list |
| `cancelEdit()` | Resets to empty student — clears the form |

### Visualforce Page — Tag by Tag

| Tag | What it does |
|-----|-------------|
| `controller="StudentController"` | Links page to the Apex class |
| `<apex:inputField value="{!student.Name}">` | Two-way bind — reads and writes `student.Name` |
| `<apex:commandButton action="{!saveStudent}">` | Calls `saveStudent()` in Apex on click |
| `immediate="true"` on Cancel | Skip validation, just run the method |
| `<apex:pageBlockTable value="{!studentList}" var="s">` | Loop — renders one row per item in list, each item is `s` |
| `value="{!s.Name}"` | Shows Name field of current row `s` |
| `<apex:commandLink action="{!editStudent}">` | Clickable text link, calls editStudent() |
| `<apex:param assignTo="{!selectedId}">` | Sets `selectedId` in Apex to the row's Id before action runs |
| `onclick="return confirm('...')"` | Browser popup — if user cancels, action is NOT called |

---

## Cheat Sheet

```
NAMING RULE
  Custom Object API:  Student__c       ← always __c
  Custom Field API:   Roll_No__c       ← always __c
  Standard fields:    Id, Name         ← no __c

UPSERT TRICK
  upsert student;
  → student.Id is null?  → INSERT (new record)
  → student.Id has value? → UPDATE (existing record)

SOQL SYNTAX
  [SELECT Id, Name, Roll_No__c FROM Student__c WHERE Id = :selectedId]
  Colon : binds an Apex variable into the query

PASSING ROW ID
  <apex:commandLink action="{!editStudent}">
      <apex:param name="sid" value="{!s.Id}" assignTo="{!selectedId}" />
  </apex:commandLink>
  assignTo sets selectedId in Apex BEFORE the action fires

TABLE LOOP
  value="{!studentList}"  ← the list from Apex
  var="s"                 ← each item in loop is called s
```

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Student | Plural: Students | Save

2. Fields & Relationships → New (do 3 times)
   Roll No   → Number, Length 10, Decimal 0
   Class     → Text, Length 50
   Mobile No → Phone

3. Developer Console → File → New → Apex Class
   Name: StudentController → paste code → Ctrl+S

4. Developer Console → File → New → Visualforce Page
   Name: StudentPage → paste code → Ctrl+S

5. Preview or visit /apex/StudentPage and test all 4 operations
```
