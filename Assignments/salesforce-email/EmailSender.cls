public class EmailSender {

    public String toEmail   { get; set; }
    public String subject   { get; set; }
    public String body      { get; set; }
    public String message   { get; set; }

    public void sendEmail() {

        // Validate email
        if (toEmail == null || !toEmail.contains('@') || !toEmail.contains('.')) {
            message = 'Error: Invalid Email Address!';
            return;
        }

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { toEmail });
        mail.setSubject(subject);
        mail.setPlainTextBody(body);

        // --- Attachment ---
        Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
        attach.setFileName('attachment.txt');
        attach.setBody(Blob.valueOf('This is the attachment content sent from Salesforce.'));
        attach.setContentType('text/plain');
        mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach });
        // ------------------

        try {
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
            message = 'Email sent successfully to ' + toEmail + ' (with attachment)';
        } catch (Exception e) {
            message = 'Error: ' + e.getMessage();
        }
    }
}
