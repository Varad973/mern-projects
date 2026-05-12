# Salesforce Apex Email Notification with Visualforce Frontend

**Assignment:** Develop an Apex program that sends an email notification to a specified email address using Salesforce email services. The program should define the recipient email, subject, and message body, and send the email (with/without attachment) using the built-in messaging class. Give the appropriate message on invalid email id with frontend using Visualforce pages.

---

## Table of Contents

1. [What You Will Build](#what-you-will-build)
2. [Prerequisites](#prerequisites)
3. [Step 1 — Create a Salesforce Developer Account](#step-1--create-a-salesforce-developer-account)
4. [Step 2 — Login to Salesforce](#step-2--login-to-salesforce)
5. [Step 3 — Enable Email Deliverability](#step-3--enable-email-deliverability)
6. [Step 4 — Open Developer Console](#step-4--open-developer-console)
7. [Step 5 — Create the Apex Class](#step-5--create-the-apex-class)
8. [Step 6 — Create the Visualforce Page](#step-6--create-the-visualforce-page)
9. [Step 7 — Run and Test](#step-7--run-and-test)
10. [Full Code Reference](#full-code-reference)
11. [Code Explanation](#code-explanation)
12. [Key Concepts Cheat Sheet](#key-concepts-cheat-sheet)
13. [Common Errors and Fixes](#common-errors-and-fixes)

---

## What You Will Build

A web form (Visualforce Page) where you can:
- Enter a recipient email, subject, and message body
- Click a button to send the email
- Receive a `.txt` file attachment with the email
- See a success message on valid email
- See an error message on invalid email (e.g. missing `@` or `.`)

---

## Prerequisites

- A Salesforce Developer account (free)
- A browser (Chrome recommended)
- Internet connection

---

## Step 1 — Create a Salesforce Developer Account

> Skip this step if you already have an account.

1. Go to: **https://developer.salesforce.com/signup**
2. Fill in your details (use your real email — you'll need it for verification)
3. Click **Sign me up**
4. Check your email and click the verification link
5. Set your password when prompted

---

## Step 2 — Login to Salesforce

1. Go to: **https://login.salesforce.com**
2. Enter your **Username** and **Password**
3. Click **Log In**
4. You will land on the Salesforce Home page

---

## Step 3 — Enable Email Deliverability

> This is the most important step. Without this, emails will show "sent" but never arrive.

1. Click the **gear icon (⚙️)** at the top right corner
2. Click **Setup**
3. In the left sidebar search box, type: `Deliverability`
4. Click **Deliverability** under the **Email** section
5. Under **Access to Send Email**, change the dropdown from `System Email Only` to **`All Email`**
6. Click **Save**

---

## Step 4 — Open Developer Console

1. Click the **gear icon (⚙️)** at the top right corner
2. Click **Developer Console**
3. A new window will open — this is where you write all Apex and Visualforce code

---

## Step 5 — Create the Apex Class

The Apex Class contains the backend logic — email validation, building the email, adding attachment, and sending it.

### 5.1 — Create new Apex Class

1. In the Developer Console, click **File** in the menu bar
2. Click **New**
3. Click **Apex Class**
4. In the popup, type the class name: `EmailSender`
5. Click **OK**

### 5.2 — Replace the code

Delete everything in the editor and paste the following code:

```apex
public class EmailSender {

    public String toEmail   { get; set; }
    public String subject   { get; set; }
    public String body      { get; set; }
    public String message   { get; set; }

    public void sendEmail() {

        // Validate email - check for null, missing @ and missing dot
        if (toEmail == null || !toEmail.contains('@') || !toEmail.contains('.')) {
            message = 'Error: Invalid Email Address! Please enter a valid email.';
            return;
        }

        // Create the email object
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

        // Set recipient, subject, body
        mail.setToAddresses(new String[] { toEmail });
        mail.setSubject(subject);
        mail.setPlainTextBody(body);

        // Create the attachment
        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
        attach.setFileName('attachment.txt');
        attach.setBody(Blob.valueOf('Hello! This is an attachment sent from Salesforce Apex.'));
        attach.setContentType('text/plain');

        // Link attachment to the email
        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });

        // Send the email
        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            message = 'Success! Email sent to ' + toEmail + ' with attachment.';
        } catch (Exception e) {
            message = 'Error: ' + e.getMessage();
        }
    }
}
```

### 5.3 — Save the class

- Press **Ctrl + S** or go to **File → Save**
- You should see no errors in the bottom panel

---

## Step 6 — Create the Visualforce Page

The Visualforce Page is the frontend — a form the user fills and submits.

### 6.1 — Create new Visualforce Page

1. In the Developer Console, click **File → New → Visualforce Page**
2. Type the page name: `EmailForm`
3. Click **OK**

### 6.2 — Replace the code

Delete everything and paste the following:

```xml
<apex:page controller="EmailSender">

    <h2>Send Email Notification</h2>

    <apex:form>
        <apex:pageBlock title="Email Details">

            <apex:pageBlockSection>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>To Email:</apex:outputLabel>
                    <apex:inputText value="{!toEmail}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Subject:</apex:outputLabel>
                    <apex:inputText value="{!subject}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Message Body:</apex:outputLabel>
                    <apex:inputTextarea value="{!body}" rows="5" />
                </apex:pageBlockSectionItem>

            </apex:pageBlockSection>

            <apex:commandButton value="Send Email" action="{!sendEmail}" />

        </apex:pageBlock>

        <!-- Show message only when it is not empty -->
        <apex:outputText value="{!message}"
                         style="font-size:16px; font-weight:bold; color:green;"
                         rendered="{!message != null}" />

    </apex:form>

</apex:page>
```

### 6.3 — Save the page

- Press **Ctrl + S** or go to **File → Save**

---

## Step 7 — Run and Test

### 7.1 — Open the page

**Option A — From Developer Console:**
- Click the **Preview** button at the top of the Visualforce page editor

**Option B — Direct URL:**
- In your browser address bar, go to:
  ```
  https://<your-org-domain>.salesforce.com/apex/EmailForm
  ```
  Replace `<your-org-domain>` with your actual Salesforce org domain.

### 7.2 — Test valid email

1. Enter a valid email address (e.g. `yourname@gmail.com`)
2. Enter a subject (e.g. `Test Email`)
3. Enter a message body (e.g. `Hello from Salesforce!`)
4. Click **Send Email**
5. You should see: `Success! Email sent to yourname@gmail.com with attachment.`
6. Check your inbox — you will receive the email with `attachment.txt`

### 7.3 — Test invalid email

1. Enter an invalid email address (e.g. `invalidemail` or `test@` or just `hello`)
2. Click **Send Email**
3. You should see: `Error: Invalid Email Address! Please enter a valid email.`
4. No email is sent

---

## Full Code Reference

### Apex Class — EmailSender.cls

```apex
public class EmailSender {

    public String toEmail   { get; set; }
    public String subject   { get; set; }
    public String body      { get; set; }
    public String message   { get; set; }

    public void sendEmail() {

        // Validate email
        if (toEmail == null || !toEmail.contains('@') || !toEmail.contains('.')) {
            message = 'Error: Invalid Email Address! Please enter a valid email.';
            return;
        }

        // Create email
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { toEmail });
        mail.setSubject(subject);
        mail.setPlainTextBody(body);

        // Create attachment
        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
        attach.setFileName('attachment.txt');
        attach.setBody(Blob.valueOf('Hello! This is an attachment sent from Salesforce Apex.'));
        attach.setContentType('text/plain');
        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });

        // Send
        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            message = 'Success! Email sent to ' + toEmail + ' with attachment.';
        } catch (Exception e) {
            message = 'Error: ' + e.getMessage();
        }
    }
}
```

### Visualforce Page — EmailForm.page

```xml
<apex:page controller="EmailSender">

    <h2>Send Email Notification</h2>

    <apex:form>
        <apex:pageBlock title="Email Details">

            <apex:pageBlockSection>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>To Email:</apex:outputLabel>
                    <apex:inputText value="{!toEmail}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Subject:</apex:outputLabel>
                    <apex:inputText value="{!subject}" />
                </apex:pageBlockSectionItem>

                <apex:pageBlockSectionItem>
                    <apex:outputLabel>Message Body:</apex:outputLabel>
                    <apex:inputTextarea value="{!body}" rows="5" />
                </apex:pageBlockSectionItem>

            </apex:pageBlockSection>

            <apex:commandButton value="Send Email" action="{!sendEmail}" />

        </apex:pageBlock>

        <apex:outputText value="{!message}"
                         style="font-size:16px; font-weight:bold; color:green;"
                         rendered="{!message != null}" />

    </apex:form>

</apex:page>
```

---

## Code Explanation

### Apex Class Breakdown

| Line | What it does |
|------|-------------|
| `public String toEmail { get; set; }` | Declares a public property. `get; set;` makes it readable and writable from Visualforce |
| `public void sendEmail()` | Method called when the button is clicked |
| `!toEmail.contains('@')` | Validation: checks if `@` is present in the email string |
| `!toEmail.contains('.')` | Validation: checks if `.` is present in the email string |
| `message = 'Error...; return;` | Sets error message and stops execution if email is invalid |
| `new Messaging.SingleEmailMessage()` | Creates a new email object |
| `mail.setToAddresses(...)` | Sets who receives the email (takes a String array) |
| `mail.setSubject(subject)` | Sets the email subject |
| `mail.setPlainTextBody(body)` | Sets the email body as plain text |
| `new Messaging.EmailFileAttachment()` | Creates a file attachment object |
| `attach.setFileName('attachment.txt')` | Sets the name of the attached file |
| `attach.setBody(Blob.valueOf('...'))` | Sets the content of the file (must be a Blob) |
| `attach.setContentType('text/plain')` | Tells the email client what kind of file it is |
| `mail.setFileAttachments(...)` | Attaches the file to the email |
| `Messaging.sendEmail(...)` | Actually sends the email (takes an array of email objects) |

### Visualforce Page Breakdown

| Tag | What it does |
|-----|-------------|
| `<apex:page controller="EmailSender">` | Links this page to the `EmailSender` Apex class |
| `<apex:form>` | Wraps all input elements — required for form submission |
| `<apex:pageBlock>` | Renders a styled box/container |
| `<apex:pageBlockSection>` | Creates a 2-column layout inside the block |
| `<apex:pageBlockSectionItem>` | One row: label on left, input on right |
| `<apex:inputText value="{!toEmail}">` | Text input bound to the `toEmail` property in Apex |
| `<apex:inputTextarea value="{!body}" rows="5">` | Multiline text area bound to `body` |
| `<apex:commandButton action="{!sendEmail}">` | Button that calls `sendEmail()` method in Apex |
| `{!variableName}` | Visualforce expression — reads/writes Apex property |
| `rendered="{!message != null}"` | Only shows the element if `message` is not null |

---

## Key Concepts Cheat Sheet

```
APEX PROPERTY SYNTAX
    public String varName { get; set; }
    ↑ must be public, get; set; makes it accessible in Visualforce

VISUALFORCE BINDING
    value="{!apexPropertyName}"
    ↑ the {! } syntax connects the page to the Apex class

BUTTON ACTION
    action="{!methodName}"
    ↑ calls the method in the Apex controller

EMAIL CLASSES
    Messaging.SingleEmailMessage     → the email
    Messaging.EmailFileAttachment    → the attachment
    Messaging.sendEmail(...)         → sends it

BLOB
    Blob.valueOf('some text')
    ↑ converts a String to Blob (required for attachment body)

VALIDATION
    if (toEmail == null || !toEmail.contains('@') || !toEmail.contains('.'))
    ↑ basic check — null, no @, no dot
```

---

## Common Errors and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Email shows "sent" but not received | Deliverability is restricted | Setup → Deliverability → All Email |
| Email in spam/junk folder | Salesforce org email flagged | Check spam, mark as not spam |
| `Variable does not exist` | Typo in property name | Make sure `{ get; set; }` is on every property |
| `Controller not found` | Class name mismatch | Ensure class name is exactly `EmailSender` |
| Page not loading | Page name mismatch | URL must match exactly: `/apex/EmailForm` |
| `Send Email failed` | API limit or org restriction | Check Setup → Email Logs |

---

## Without Attachment Version

If you need the version **without** attachment, just remove these 5 lines from the Apex class:

```apex
// DELETE these 5 lines for no-attachment version
Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
attach.setFileName('attachment.txt');
attach.setBody(Blob.valueOf('Hello! This is an attachment sent from Salesforce Apex.'));
attach.setContentType('text/plain');
mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
```

Everything else stays the same.

---

## Summary of Steps (Quick Reference)

```
1. Login       → login.salesforce.com
2. Deliverability → Setup → Deliverability → All Email → Save
3. Dev Console → Gear icon → Developer Console
4. Apex Class  → File → New → Apex Class → EmailSender → paste code → Ctrl+S
5. VF Page     → File → New → Visualforce Page → EmailForm → paste code → Ctrl+S
6. Test        → Click Preview OR visit /apex/EmailForm
```
