
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import { EmployeeModel } from './employee-dashboard.model';



@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']

  
})
export class EmployeeDashboardComponent implements OnInit {
  formValue!: FormGroup;
  employeeData: EmployeeModel[] = [];
  employeeObj: EmployeeModel = new EmployeeModel();
  showAdd: boolean = false;
  showUpdate: boolean = false;
  @Input()
  receive!: string;
  @Input() mobileSpecification: any;

  constructor(private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      salary: ['']
    });
    this.getEmployeeDetails();
  }


  clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postEmployeeDetails() {
    this.employeeObj.firstName = this.formValue.value.firstName;
    this.employeeObj.lastName = this.formValue.value.lastName;
    this.employeeObj.email = this.formValue.value.email;
    this.employeeObj.mobile = this.formValue.value.mobile;
    this.employeeObj.salary = this.formValue.value.salary;
    this.api.addEmployee(this.employeeObj).subscribe(res => {
      console.log(res);
      let ref = document.getElementById('close');
      ref?.click();
      this.getEmployeeDetails();
    });
  }

  getEmployeeDetails() {
    this.api.getAllEmployees().subscribe((res: any) => {
      this.employeeData = res.employeeDetails;
    });
  }

  deleteEmployeeDetail(row: any) {
    let clickedYes = confirm("Are you sure want to delete");
    if (clickedYes) {
      this.api.deleteEmployee(row.id).subscribe(
        () => {
          alert("Deleted Successfully");
          this.getEmployeeDetails();
        },
        (error) => {
          console.error('Error deleting employee:', error);
        }
      );
    }
  }
  
  
        
  onEdit(row: any) {
    this.employeeObj.id = row.id;
    this.formValue.patchValue({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      mobile: row.mobile,
      salary: row.salary
    });
    this.showUpdate = true;
    this.showAdd = false;
  }

  editEmployeeDetail() {
    this.employeeObj.firstName = this.formValue.value.firstName;
    this.employeeObj.lastName = this.formValue.value.lastName;
    this.employeeObj.email = this.formValue.value.email;
    this.employeeObj.mobile = this.formValue.value.mobile;
    this.employeeObj.salary = this.formValue.value.salary;
    this.api.updateEmployee(this.employeeObj).subscribe(res => {
      alert("Updated Successfully");
      let ref = document.getElementById('close');
      ref?.click();
      this.getEmployeeDetails();
    }, error => {
      console.log('Error updating employee:', error);
    });
  }

 
}