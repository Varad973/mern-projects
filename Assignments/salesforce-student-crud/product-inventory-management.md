# PS 19 — Product Inventory Management
## Apex + Visualforce CRUD (Create, Read, Update, Delete)

**Fields:** Product Name, Serial No, Manufacture Date, Expiry Date  
**Object:** `Product_Inventory__c`  
**Apex Class:** `ProductController`  
**Visualforce Page:** `ProductPage`

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
- A **form** to add a new product or edit an existing one
- A **table** listing all product inventory records
- **Edit** link per row — loads that product's data into the form
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
   - **Label:** `Product Inventory`
   - **Plural Label:** `Product Inventories`
   - **Object Name:** `Product_Inventory` ← auto-filled, leave it
6. Scroll down → click **Save**

> You are now on the Product Inventory object page. Stay here for Part B.

---

## Part B — Add Custom Fields

Go to **Fields & Relationships** in the left sidebar of the Product Inventory object page.

> Note: The `Name` standard field will be used as **Product Name** — no need to create it separately. You just label it "Product Name" in the form.

### Field 1 — Serial No

1. Click **New**
2. Data type: **Text** → **Next**
3. Fill in:
   - **Field Label:** `Serial No`
   - **Field Name:** `Serial_No` (auto-filled)
   - **Length:** `50`
4. Click **Next → Next → Save**

### Field 2 — Manufacture Date

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Manufacture Date`
   - **Field Name:** `Manufacture_Date` (auto-filled)
4. Click **Next → Next → Save**

### Field 3 — Expiry Date

1. Click **New**
2. Data type: **Date** → **Next**
3. Fill in:
   - **Field Label:** `Expiry Date`
   - **Field Name:** `Expiry_Date` (auto-filled)
4. Click **Next → Next → Save**

> After this, your object has these API field names:
> - `Name` (standard — used as Product Name, no `__c`)
> - `Serial_No__c`
> - `Manufacture_Date__c`
> - `Expiry_Date__c`

---

## Part C — Create Apex Class

1. Click **gear icon → Developer Console**
2. **File → New → Apex Class**
3. Name: `ProductController` → **OK**
4. Delete all existing code and paste:

```apex
public class ProductController {

    public Product_Inventory__c product           { get; set; }
    public String selectedId                      { get; set; }
    public List<Product_Inventory__c> productList { get; set; }

    public ProductController() {
        product = new Product_Inventory__c();
        loadProducts();
    }

    private void loadProducts() {
        productList = [SELECT Id, Name, Serial_No__c, Manufacture_Date__c, Expiry_Date__c
                       FROM Product_Inventory__c
                       ORDER BY Name];
    }

    // CREATE or UPDATE
    public void saveProduct() {
        upsert product;
        product = new Product_Inventory__c();
        loadProducts();
    }

    // Load selected record into form
    public void editProduct() {
        product = [SELECT Id, Name, Serial_No__c, Manufacture_Date__c, Expiry_Date__c
                   FROM Product_Inventory__c
                   WHERE Id = :selectedId];
    }

    // DELETE selected record
    public void deleteProduct() {
        delete [SELECT Id FROM Product_Inventory__c WHERE Id = :selectedId];
        product = new Product_Inventory__c();
        loadProducts();
    }

    // Clear the form
    public void cancelEdit() {
        product = new Product_Inventory__c();
    }
}
```

5. Press **Ctrl + S** to save

---

## Part D — Create Visualforce Page

1. In Developer Console: **File → New → Visualforce Page**
2. Name: `ProductPage` → **OK**
3. Delete all existing code and paste:

```xml
<apex:page controller="ProductController">

    <h2>Product Inventory Management</h2>

    <apex:form>

        <!-- ADD / EDIT FORM -->
        <apex:pageBlock title="Add / Edit Product">
            <apex:pageBlockSection>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Product Name:</apex:outputLabel>
                    <apex:inputField value="{!product.Name}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Serial No:</apex:outputLabel>
                    <apex:inputField value="{!product.Serial_No__c}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Manufacture Date:</apex:outputLabel>
                    <apex:inputField value="{!product.Manufacture_Date__c}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Expiry Date:</apex:outputLabel>
                    <apex:inputField value="{!product.Expiry_Date__c}" />
                </apex:pageBlockSectionItem>

            </apex:pageBlockSection>

            <apex:commandButton value="Save"   action="{!saveProduct}" />
            &nbsp;
            <apex:commandButton value="Cancel" action="{!cancelEdit}" immediate="true" />

        </apex:pageBlock>

        <!-- PRODUCT LIST TABLE -->
        <apex:pageBlock title="All Products">
            <apex:pageBlockTable value="{!productList}" var="p">

                <apex:column headerValue="Product Name"    value="{!p.Name}" />
                <apex:column headerValue="Serial No"       value="{!p.Serial_No__c}" />
                <apex:column headerValue="Manufacture Date" value="{!p.Manufacture_Date__c}" />
                <apex:column headerValue="Expiry Date"     value="{!p.Expiry_Date__c}" />

                <apex:column headerValue="Edit">
                    <apex:commandLink value="Edit" action="{!editProduct}">
                        <apex:param name="sid" value="{!p.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>

                <apex:column headerValue="Delete">
                    <apex:commandLink value="Delete" action="{!deleteProduct}"
                                      onclick="return confirm('Are you sure you want to delete this product?')">
                        <apex:param name="sid" value="{!p.Id}" assignTo="{!selectedId}" />
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
- In your browser go to: `https://<your-org>.salesforce.com/apex/ProductPage`

### Test Create (INSERT)
1. Fill in: Product Name, Serial No, Manufacture Date, Expiry Date
2. For dates, use the **date picker** that appears
3. Click **Save**
4. New row appears in the table

### Test Read
- All records automatically display in the table on page load

### Test Update (EDIT)
1. Click **Edit** on any row
2. Form fills with that product's data (date fields show calendar picker)
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

### ProductController.cls

```apex
public class ProductController {

    public Product_Inventory__c product           { get; set; }
    public String selectedId                      { get; set; }
    public List<Product_Inventory__c> productList { get; set; }

    public ProductController() {
        product = new Product_Inventory__c();
        loadProducts();
    }

    private void loadProducts() {
        productList = [SELECT Id, Name, Serial_No__c, Manufacture_Date__c, Expiry_Date__c
                       FROM Product_Inventory__c
                       ORDER BY Name];
    }

    public void saveProduct() {
        upsert product;
        product = new Product_Inventory__c();
        loadProducts();
    }

    public void editProduct() {
        product = [SELECT Id, Name, Serial_No__c, Manufacture_Date__c, Expiry_Date__c
                   FROM Product_Inventory__c
                   WHERE Id = :selectedId];
    }

    public void deleteProduct() {
        delete [SELECT Id FROM Product_Inventory__c WHERE Id = :selectedId];
        product = new Product_Inventory__c();
        loadProducts();
    }

    public void cancelEdit() {
        product = new Product_Inventory__c();
    }
}
```

### ProductPage.page

```xml
<apex:page controller="ProductController">
    <h2>Product Inventory Management</h2>
    <apex:form>

        <apex:pageBlock title="Add / Edit Product">
            <apex:pageBlockSection>
                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Product Name:</apex:outputLabel>
                    <apex:inputField value="{!product.Name}" />
                </apex:pageBlockSectionItem>
                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Serial No:</apex:outputLabel>
                    <apex:inputField value="{!product.Serial_No__c}" />
                </apex:pageBlockSectionItem>
                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Manufacture Date:</apex:outputLabel>
                    <apex:inputField value="{!product.Manufacture_Date__c}" />
                </apex:pageBlockSectionItem>
                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Expiry Date:</apex:outputLabel>
                    <apex:inputField value="{!product.Expiry_Date__c}" />
                </apex:pageBlockSectionItem>
            </apex:pageBlockSection>
            <apex:commandButton value="Save"   action="{!saveProduct}" />
            &nbsp;
            <apex:commandButton value="Cancel" action="{!cancelEdit}" immediate="true" />
        </apex:pageBlock>

        <apex:pageBlock title="All Products">
            <apex:pageBlockTable value="{!productList}" var="p">
                <apex:column headerValue="Product Name"     value="{!p.Name}" />
                <apex:column headerValue="Serial No"        value="{!p.Serial_No__c}" />
                <apex:column headerValue="Manufacture Date" value="{!p.Manufacture_Date__c}" />
                <apex:column headerValue="Expiry Date"      value="{!p.Expiry_Date__c}" />
                <apex:column headerValue="Edit">
                    <apex:commandLink value="Edit" action="{!editProduct}">
                        <apex:param name="sid" value="{!p.Id}" assignTo="{!selectedId}" />
                    </apex:commandLink>
                </apex:column>
                <apex:column headerValue="Delete">
                    <apex:commandLink value="Delete" action="{!deleteProduct}"
                                      onclick="return confirm('Are you sure?')">
                        <apex:param name="sid" value="{!p.Id}" assignTo="{!selectedId}" />
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
| `public Product_Inventory__c product { get; set; }` | Holds the current form's product record |
| `public String selectedId { get; set; }` | Stores the Id of the row clicked in the table |
| `public List<Product_Inventory__c> productList { get; set; }` | Holds all product records for the table |
| `new Product_Inventory__c()` | Creates an empty product — gives a blank form |
| `loadProducts()` | SOQL query — fetches all products from database |
| `upsert product` | INSERT if no Id, UPDATE if Id exists — handles both Create and Update |
| `editProduct()` | Queries DB by `selectedId`, loads record into form |
| `deleteProduct()` | Deletes by `selectedId`, clears form, refreshes list |
| `cancelEdit()` | Resets to empty product — clears the form |

### Date Fields — Important Notes

- `Manufacture_Date__c` and `Expiry_Date__c` are **Date** type (not DateTime)
- In Visualforce, `<apex:inputField>` on a Date field automatically shows a **calendar date picker**
- No extra code needed — Salesforce handles date formatting automatically
- SOQL query works the same way: just include the field name

### Visualforce Page — Tag by Tag

| Tag | What it does |
|-----|-------------|
| `controller="ProductController"` | Links page to the Apex class |
| `<apex:inputField value="{!product.Name}">` | Input bound to the product's Name field |
| `<apex:inputField value="{!product.Manufacture_Date__c}">` | Shows a date picker automatically |
| `<apex:commandButton action="{!saveProduct}">` | Calls `saveProduct()` in Apex on click |
| `immediate="true"` on Cancel | Skip validation, just run the method |
| `var="p"` in pageBlockTable | Each item in the loop is called `p` (instead of `s` for student) |
| `<apex:param assignTo="{!selectedId}">` | Sets `selectedId` in Apex to the row's Id before action runs |
| `onclick="return confirm('...')"` | Browser popup — if user cancels, action is NOT called |

---

## Cheat Sheet

```
NAMING RULE
  Custom Object API:  Product_Inventory__c    ← always __c
  Custom Field API:   Serial_No__c            ← always __c
                      Manufacture_Date__c
                      Expiry_Date__c
  Standard fields:    Id, Name                ← no __c

FIELD TYPES USED
  Serial No        → Text
  Manufacture Date → Date   (shows calendar picker in VF automatically)
  Expiry Date      → Date   (shows calendar picker in VF automatically)

UPSERT TRICK
  upsert product;
  → product.Id is null?  → INSERT (new record)
  → product.Id has value? → UPDATE (existing record)

SOQL SYNTAX
  [SELECT Id, Name, Serial_No__c, Manufacture_Date__c, Expiry_Date__c
   FROM Product_Inventory__c
   WHERE Id = :selectedId]

PASSING ROW ID
  <apex:commandLink action="{!editProduct}">
      <apex:param name="sid" value="{!p.Id}" assignTo="{!selectedId}" />
  </apex:commandLink>

TABLE LOOP (note: var is p for product, not s)
  value="{!productList}"   ← the list from Apex
  var="p"                  ← each item in loop is called p
```

---

## Difference vs PS 16 Student (Same Structure, Different Fields)

| PS 16 — Student | PS 19 — Product |
|-----------------|-----------------|
| Object: `Student__c` | Object: `Product_Inventory__c` |
| Class: `StudentController` | Class: `ProductController` |
| Page: `StudentPage` | Page: `ProductPage` |
| `Roll_No__c` — Number | `Serial_No__c` — Text |
| `Class__c` — Text | `Manufacture_Date__c` — Date |
| `Mobile_No__c` — Phone | `Expiry_Date__c` — Date |
| Loop var: `s` | Loop var: `p` |

> The Apex structure and Visualforce structure are **100% identical**.  
> Only the object name, field names, field types, and labels change.

---

## Quick Steps (Exam Reference)

```
1. Setup → Object Manager → Create → Custom Object
   Label: Product Inventory | Plural: Product Inventories | Save

2. Fields & Relationships → New (do 3 times)
   Serial No        → Text, Length 50
   Manufacture Date → Date
   Expiry Date      → Date

3. Developer Console → File → New → Apex Class
   Name: ProductController → paste code → Ctrl+S

4. Developer Console → File → New → Visualforce Page
   Name: ProductPage → paste code → Ctrl+S

5. Preview or visit /apex/ProductPage and test all 4 operations
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Type not found: Product_Inventory__c` | Object not created or typo | Check Object Manager — API name must be `Product_Inventory` |
| `Variable does not exist: Serial_No__c` | Field not created yet | Create the field in Fields & Relationships |
| Date field shows plain text box | Wrong field type selected | Delete the field, recreate it as **Date** type |
| Table shows no records | `loadProducts()` not called in constructor | Make sure constructor calls `loadProducts()` |
| Edit fills wrong record | `selectedId` not set | Check `assignTo="{!selectedId}"` on `apex:param` |
| Delete does nothing | Same as above | Check `assignTo` on Delete's `apex:param` |
