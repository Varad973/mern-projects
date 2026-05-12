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
