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

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Renderer2, OnDestroy } from '@angular/core';



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
  documentClickListener: any;
 // renderer: any;


  constructor(private employeeService: EmployeeService, private renderer: Renderer2) {}  // ngOnInit(): void {
  //   this.fetchEmployees();
  // }

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
  //   if (index !== -1) {
  //     const updatedEmployee: Employee = {
  //       id: dataItem.id,
  //       record_id: dataItem.record_id,
  //       full_name: dataItem.full_name,
  //       first_name: dataItem.first_name,
  //       last_name: dataItem.last_name,
  //       job_title: dataItem.job_title,
  //       primary_mail: dataItem.primary_mail,
  //       phone: dataItem.phone,
  //       lmp: dataItem.lmp,
  //       appointment_type: dataItem.appointment_type,
  //       booking_agency: dataItem.booking_agency
  //     };

  //     this.gridData[index] = { ...updatedEmployee };
  //     this.employeeService.updateEmployee(dataItem.id, updatedEmployee).subscribe(() => {
  //       this.fetchEmployees();
  //     });
  //   }
  //   this.editedItem = undefined;
  // }





  
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
  // cancelHandler({ sender, rowIndex }: any): void {
  //   sender.cancelCell();
  //   this.editedItem = undefined;
  // }

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

  onActionSelected(action: string, dataItem: any): void {
  switch (action) {
    case 'Edit':
      this.editHandler(dataItem);
      break;
    case 'Delete':
      this.removeHandler(dataItem);
      break;
    case 'View':
      console.log('View action selected for:', dataItem);
      break;
    default:
      console.log('No action selected');
  }
}



















  public editedRowIndex: number | undefined;
  public formGroup: FormGroup | undefined;


  cellClickHandler({ rowIndex, dataItem }: any): void {
    if (this.editedRowIndex !== undefined) {
      this.cancelHandler({ sender: this.grid, rowIndex: this.editedRowIndex });
    }

    this.editedRowIndex = rowIndex;
    this.formGroup = new FormGroup({
      full_name: new FormControl(dataItem.full_name, Validators.required),
      job_title: new FormControl(dataItem.job_title),
      phone: new FormControl(dataItem.phone, Validators.required),
      address: new FormControl(dataItem.address),
    });

    this.grid.editRow(rowIndex, this.formGroup);
  }

  saveHandler({ sender, rowIndex, dataItem }: any): void {
    if (this.formGroup?.valid) {
      const updatedItem = { ...dataItem, ...this.formGroup.value };
  
      this.employeeService.updateEmployee(updatedItem.id, updatedItem).subscribe(() => {
        const index = this.gridData.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          this.gridData[index] = updatedItem;
          this.gridView = [...this.gridData];
        }
  
        sender.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
      });
    }
  }


  cancelHandler(p0: { sender: KendoGridComponent; rowIndex: number; }): void {
    this.grid.closeRow(this.editedRowIndex!);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  ngOnInit(): void {
    this.fetchEmployees();
  
    // Add a document click listener
    this.documentClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      const target = event.target as HTMLElement;
  
      // Check if the click is outside the grid
      if (!this.grid.wrapper.nativeElement.contains(target) && this.formGroup) {
        console.log('Outside grid clicked, saving row...');
        this.saveCurrentRow(); // Save the current row
      }
    });
  }

  ngOnDestroy(): void {
    // Remove the document click listener to avoid memory leaks
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }

  
  private saveCurrentRow(): void {
    if (this.formGroup?.valid && this.editedRowIndex !== undefined) {
      const updatedItem = { ...this.gridData[this.editedRowIndex], ...this.formGroup.value };
      console.log('Saving data:', updatedItem);
  
      this.employeeService.updateEmployee(updatedItem.id, updatedItem).subscribe({
        next: () => {
          console.log('Data saved successfully');
          const index = this.gridData.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            this.gridData[index] = updatedItem; // Update the local grid data
            this.gridView = [...this.gridData]; // Refresh the grid view
          }
  
          this.grid.closeRow(this.editedRowIndex!); // Close the edited row
          this.editedRowIndex = undefined;
          this.formGroup = undefined; // Reset the form group
        },
        error: (err) => {
          console.error('Error saving data:', err); // Log any errors
        }
      });
    }
  }

}