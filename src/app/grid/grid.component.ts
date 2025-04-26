import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent as KendoGridComponent } from '@progress/kendo-angular-grid';
import {
  DataBindingDirective,
  GridModule,
  KENDO_GRID,
  KENDO_GRID_EXCEL_EXPORT,
  KENDO_GRID_PDF_EXPORT
} from '@progress/kendo-angular-grid';
import { KENDO_CHARTS } from '@progress/kendo-angular-charts';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { process } from '@progress/kendo-data-query';
import { SVGIcon, fileExcelIcon, filePdfIcon } from '@progress/kendo-svg-icons';
import { CommonModule } from '@angular/common';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeService } from '../employee.service';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    KENDO_GRID,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT,
    KENDO_DROPDOWNS,
    KENDO_LABEL,
    FormsModule,
    GridModule
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding!: DataBindingDirective;
  @ViewChild('gridRef') grid!: KendoGridComponent;

  public gridData: any[] = [];
  public gridView: any[] = [];
  public mySelection: string[] = [];
  public editedItem: any;
  public selectedToggle = 'non-intl';

  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.gridData = data;
      this.gridView = [...data];
    });
  }

  editHandler({ sender, rowIndex, dataItem }: any): void {
    sender.editRow(rowIndex); 
    this.editedItem = { ...dataItem }; // copy object instead of direct reference
  }

  // saveHandler({ sender, rowIndex, dataItem }: any): void {
  //   sender.closeRow(rowIndex);

  //   const index = this.gridData.findIndex(item => item.id === dataItem.id);
  //   if (index !== -1 && this.editedItem) {
  //     this.gridData[index] = this.editedItem;
  //     this.employeeService.updateEmployee(dataItem.id, this.editedItem).subscribe(() => {
  //       this.fetchEmployees();
  //     });
  //   }
  //   this.editedItem = undefined;
  // }

  saveHandler({ sender, rowIndex, dataItem }: any): void {
    sender.closeRow(rowIndex);

    const index = this.gridData.findIndex(item => item.id === dataItem.id);
    if (index !== -1) {
      const updatedEmployee: Employee = {
        id: dataItem.id,
        record_id: dataItem.record_id,
        full_name: dataItem.full_name,
        first_name: dataItem.first_name,
        last_name: dataItem.last_name,
        job_title: dataItem.job_title,
        primary_mail: dataItem.primary_mail,
        phone: dataItem.phone,
        lmp: dataItem.lmp,
        appointment_type: dataItem.appointment_type,
        booking_agency: dataItem.booking_agency
      };

      this.gridData[index] = { ...updatedEmployee };
      this.employeeService.updateEmployee(dataItem.id, updatedEmployee).subscribe(() => {
        this.fetchEmployees();
      });
    }
    this.editedItem = undefined;
  }

  
  removeHandler(dataItem: Employee): void {
    this.employeeService.deleteEmployee(dataItem.id).subscribe({
      next: () => {
        console.log('Deleted Successfully');
        this.gridData = this.gridData.filter(item => item.id !== dataItem.id);
        this.gridView = [...this.gridData];
      },
      error: (err) => {
        console.error('Error while deleting:', err);
      }
    });
  }
  cancelHandler({ sender, rowIndex }: any): void {
    sender.cancelCell();
    this.editedItem = undefined;
  }

 onFilter(value: string): void {
    const inputValue = value.toLowerCase();

    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          { field: "full_name", operator: "contains", value: inputValue },
          { field: "job_title", operator: "contains", value: inputValue },
          { field: "budget", operator: "contains", value: inputValue },
          { field: "phone", operator: "contains", value: inputValue },
          { field: "address", operator: "contains", value: inputValue }
        ]
      }
    }).data;

    this.dataBinding.skip = 0;
  }

  exportExcel(grid: any): void {
    grid.saveAsExcel();
  }

  toggleIntl(type: 'non-intl' | 'intl') {
    this.selectedToggle = type;
  }

  public areaList: Array<string> = [
    "Boston", "Chicago", "Houston", "Los Angeles", "Miami",
    "New York", "Philadelphia", "San Francisco", "Seattle"
  ];
}