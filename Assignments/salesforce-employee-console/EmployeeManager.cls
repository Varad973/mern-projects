public class EmployeeManager {

    // CREATE
    public static void createEmployee(String empId, String name, String email,
                                      Date birthDate, String department) {
        Employee__c emp = new Employee__c();
        emp.Emp_ID__c     = empId;
        emp.Name          = name;
        emp.Email__c      = email;
        emp.Birth_Date__c = birthDate;
        emp.Department__c = department;
        insert emp;
        System.debug('SUCCESS: Employee created — ' + name);
    }

    // READ ALL
    public static void readAllEmployees() {
        List<Employee__c> empList = [SELECT Emp_ID__c, Name, Email__c,
                                            Birth_Date__c, Department__c
                                     FROM Employee__c
                                     ORDER BY Name];
        if (empList.isEmpty()) {
            System.debug('No employees found.');
            return;
        }
        for (Employee__c e : empList) {
            System.debug(
                'ID: '   + e.Emp_ID__c     + ' | ' +
                'Name: ' + e.Name          + ' | ' +
                'Email: '+ e.Email__c      + ' | ' +
                'DOB: '  + e.Birth_Date__c + ' | ' +
                'Dept: ' + e.Department__c
            );
        }
    }

    // UPDATE
    public static void updateEmployee(String empId, String newName, String newEmail,
                                      Date newBirthDate, String newDepartment) {
        List<Employee__c> empList = [SELECT Id, Name, Email__c, Birth_Date__c, Department__c
                                     FROM Employee__c
                                     WHERE Emp_ID__c = :empId];
        if (empList.isEmpty()) {
            System.debug('ERROR: No employee found with ID — ' + empId);
            return;
        }
        Employee__c emp   = empList[0];
        emp.Name          = newName;
        emp.Email__c      = newEmail;
        emp.Birth_Date__c = newBirthDate;
        emp.Department__c = newDepartment;
        update emp;
        System.debug('SUCCESS: Employee updated — ' + newName);
    }

    // DELETE
    public static void deleteEmployee(String empId) {
        List<Employee__c> empList = [SELECT Id, Name
                                     FROM Employee__c
                                     WHERE Emp_ID__c = :empId];
        if (empList.isEmpty()) {
            System.debug('ERROR: No employee found with ID — ' + empId);
            return;
        }
        String name = empList[0].Name;
        delete empList[0];
        System.debug('SUCCESS: Employee deleted — ' + name);
    }
}
