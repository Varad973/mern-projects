import { LightningElement, track } from 'lwc';
import saveEmployee from '@salesforce/apex/EmployeeController.saveEmployee';

export default class EmployeeForm extends LightningElement {

    @track name        = '';
    @track empId       = '';
    @track salary      = '';
    @track email       = '';
    @track department  = '';
    @track joiningDate = '';
    @track message     = '';
    @track isError     = false;

    departmentOptions = [
        { label: 'IT',         value: 'IT' },
        { label: 'HR',         value: 'HR' },
        { label: 'Finance',    value: 'Finance' },
        { label: 'Marketing',  value: 'Marketing' },
        { label: 'Operations', value: 'Operations' }
    ];

    // ----- Getters -----
    get messageStyle() {
        return this.isError
            ? 'color:red; margin-top:10px;'
            : 'color:green; margin-top:10px;';
    }

    // ----- Handlers -----
    handleName(event)        { this.name        = event.target.value; }
    handleEmpId(event)       { this.empId       = event.target.value; }
    handleSalary(event)      { this.salary      = event.target.value; }
    handleEmail(event)       { this.email       = event.target.value; }
    handleDepartment(event)  { this.department  = event.target.value; }
    handleJoiningDate(event) { this.joiningDate = event.target.value; }

    // ----- Validation -----
    validate() {

        if (this.name.length < 3) {
            this.showError('Name must be at least 3 characters.');
            return false;
        }

        if (!this.empId) {
            this.showError('Employee ID is required.');
            return false;
        }

        let sal = parseFloat(this.salary);
        if (!this.salary || sal < 10000 || sal > 1000000) {
            this.showError('Salary must be between 10,000 and 10,00,000.');
            return false;
        }

        if (!this.email.includes('@') || !this.email.includes('.')) {
            this.showError('Invalid email format. Must contain @ and .');
            return false;
        }

        if (!this.department) {
            this.showError('Please select a department.');
            return false;
        }

        if (!this.joiningDate) {
            this.showError('Joining Date is required.');
            return false;
        }

        let today = new Date().toISOString().split('T')[0];
        if (this.joiningDate > today) {
            this.showError('Joining Date cannot be in the future.');
            return false;
        }

        return true;
    }

    showError(msg) {
        this.message = 'Error: ' + msg;
        this.isError = true;
    }

    // ----- Save -----
    saveEmployee() {
        if (!this.validate()) return;

        saveEmployee({
            name:        this.name,
            empId:       this.empId,
            salary:      parseFloat(this.salary),
            email:       this.email,
            department:  this.department,
            joiningDate: this.joiningDate
        })
        .then(() => {
            this.message = 'Success! Employee saved successfully.';
            this.isError = false;
            this.clearForm();
        })
        .catch(error => {
            this.showError(error.body.message);
        });
    }

    clearForm() {
        this.name        = '';
        this.empId       = '';
        this.salary      = '';
        this.email       = '';
        this.department  = '';
        this.joiningDate = '';
    }
}
