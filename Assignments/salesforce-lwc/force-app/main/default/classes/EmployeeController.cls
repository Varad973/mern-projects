public with sharing class EmployeeController {

    @AuraEnabled
    public static void saveEmployee(String name, String empId, Decimal salary,
                                    String email, String department, String joiningDate) {

        // Check unique Emp ID
        List<Employee__c> existing = [SELECT Id FROM Employee__c WHERE Emp_ID__c = :empId];
        if (!existing.isEmpty()) {
            throw new AuraHandledException('Employee ID already exists. Please use a unique ID.');
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
