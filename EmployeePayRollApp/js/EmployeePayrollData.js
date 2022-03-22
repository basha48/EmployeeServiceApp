class EmployeePayrollData {
    
    get id() {
        return this._id;
    }

    set id(id) {
      this._id = id;
    }
    get name() {
        return this._name;
    }

    set name(name) {
        let nameRegex = RegExp('^[A-Z]{1}[a-z A-Z]{2,}$');
        if (nameRegex.test(name))
            this._name = name;
        else
            throw "Incorrect Name";
    }
    get profilePic() {
        return this._profilePic;
    }

    set profilePic(profilePic) {
        this._profilePic = profilePic;
    }

    get gender() {
        return this._gender;
    }

    set gender(gender) {

        this._gender = gender;
    }

    get department() {
        return this._department;
    }

    set department(department) {
        this._department = department;
    }

    get salary() {
        return this._salary;
    }

    set salary(salary) {

        this._salary = salary;

    }

    get startDate() {
        return this._startDate;
    }

    set startDate(startDate) {
        if (startDate <= new Date()) {
            this._startDate = startDate;
        } else throw "Start Date is Incorrect!";
    }

    get notes() {
        return this._notes;
    }

    set notes(notes) {
        this._notes = notes;
    }

    toString() {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const employeeDate = this.startDate == undefined ? "undefined" : this.startDate.toLocaleDateString("en-us", options);
        // return   "Name = " + this.name + ", Profilepic = " + this.profilePic + ", Gender = " + this.gender + ", Department = " + this.department + ", Salary = " + this.salary + ", Start Date = " + employeeDate + ", Notes = " + this.notes;
        return "[ id: " + this.id + ", name: " + this.name + ", gender: " + this.gender + ", profilePicture: " + this.profilePic +
        ", salary: " + this.salary + ", startDate: " + employeeDate + ", departments: " + this.department + ", notes: " + this.notes + " ]" + "\n";
    }
}