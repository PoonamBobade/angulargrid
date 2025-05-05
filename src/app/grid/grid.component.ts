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
import { ColumnBase } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';




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
 isDarkMode = false;

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
        
        // Remove the deleted item from the grid data
        this.gridData = this.gridData.filter(item => item.id !== dataItem.id);
        
        // Refresh the grid view
        this.gridView = [...this.gridData];
        
        console.log('Grid updated after deletion');
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

//  onFilter(value: string): void {
//     const inputValue = value.toLowerCase();

//     this.gridView = process(this.gridData, {
//       filter: {
//         logic: "or",
//         filters: [
//           { field: "full_name", operator: "contains", value: inputValue },
//           { field: "job_title", operator: "contains", value: inputValue },
//           { field: "budget", operator: "contains", value: inputValue },
//           { field: "phone", operator: "contains", value: inputValue },
//           { field: "address", operator: "contains", value: inputValue }
//         ]
//       }
//     }).data;

//     this.dataBinding.skip = 0;
//   }
onFilter(value: string): void {
  const inputValue = value.toLowerCase();

  this.gridView = process(this.gridData, {
    filter: {
      logic: "or",
      filters: [
        { field: "record_id", operator: "contains", value: inputValue },
        { field: "last_name", operator: "contains", value: inputValue },
        { field: "first_name", operator: "contains", value: inputValue },
        { field: "primary_email_address", operator: "contains", value: inputValue },
        { field: "primary_phone_type", operator: "contains", value: inputValue },
        { field: "lmp_lead_id", operator: "contains", value: inputValue },
        { field: "appointment_type", operator: "contains", value: inputValue },
        { field: "booking_agency", operator: "contains", value: inputValue }
      ]
    }
  }).data;

  this.dataBinding.skip = 0;
}

@ViewChild('gridRef') gridRef!: GridComponent;

clearFilters(): void {
  const emptyFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] }; 

  
  this.gridView = process(this.gridData, { filter: emptyFilter }).data; 

  console.log('Filters cleared successfully!');

  window.location.reload();
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


// addNewRow(): void {
//   // Create a new row with default values
//   const newRow = {
//     id: this.generateUniqueId(), // Generate a unique ID for the new row
//     record_id: null,
//     full_name: '',
//     first_name: '',
//     last_name: '',
//     primary_mail: '',
//     phone: '',
//     appointment_type: '',
//     booking_agency: '',
//     job_title: '',
//     address: ''
//   };

//   // Add the new row to the top of the grid data
//   this.gridData.unshift(newRow);
//   this.gridView = [...this.gridData]; // Refresh the grid view

//   // Start editing the new row
//   this.editedRowIndex = 0; // Index of the new row
//   this.formGroup = new FormGroup({
//     full_name: new FormControl(newRow.full_name, Validators.required),
//     first_name: new FormControl(newRow.first_name, Validators.required),
//     last_name: new FormControl(newRow.last_name, Validators.required),
//     primary_mail: new FormControl(newRow.primary_mail, Validators.required),
//     phone: new FormControl(newRow.phone, Validators.required),
//     appointment_type: new FormControl(newRow.appointment_type),
//     booking_agency: new FormControl(newRow.booking_agency),
//     job_title: new FormControl(newRow.job_title),
//     address: new FormControl(newRow.address)
//   });

//   this.grid.editRow(this.editedRowIndex, this.formGroup);
//   console.log('New row added:', newRow);
// }

// // Generate a unique ID for the new row
// generateUniqueId(): string {
//   return (Math.max(...this.gridData.map(item => parseInt(item.id || '0')), 0) + 1).toString();
// }


















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
  
      // Save the updated data to the backend
      this.employeeService.updateEmployee(updatedItem.id, updatedItem).subscribe({
        next: () => {
          const index = this.gridData.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            this.gridData[index] = updatedItem; // Update the local grid data
            this.gridView = [...this.gridData]; // Refresh the grid view
          }
  
          sender.closeRow(rowIndex); // Close the edited row
          this.editedRowIndex = undefined;
          this.formGroup = undefined; // Reset the form group
          console.log('Row saved successfully:', updatedItem);
        },
        error: (err) => {
          console.error('Error saving data:', err);
        }
      });
    } else {
      console.log('Form is invalid');
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

  

  

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  saveGridPreferences(): void {
    const columnState = this.grid.columns
      .filter((col): col is ColumnBase & { field: string } => !!(col as any).field)
      .map(col => ({
        field: (col as any).field,
        width: col.width,
        hidden: col.hidden,
        orderIndex: col.orderIndex
      }));
  
    const state = {
      columns: columnState,
      filter: this.grid.filter,
      sort: this.grid.sort
    };
  
    localStorage.setItem('gridState', JSON.stringify(state));
    console.log('✅ Grid preferences saved:', state);
  }

  loadGridPreferences(): void {
    const saved = localStorage.getItem('gridState');
  
    if (saved) {
      const state = JSON.parse(saved);
  
      // Restore columns
      state.columns.forEach((savedCol: any) => {
        const col = this.grid.columns.find(
          c => (c as any).field === savedCol.field
        );
        if (col) {
          col.width = savedCol.width;
          col.hidden = savedCol.hidden;
          col.orderIndex = savedCol.orderIndex;
        }
      });
  
      // Restore sort and filter
      this.grid.sort = state.sort;
      this.grid.filter = state.filter;
  
      console.log('✅ Grid preferences loaded:', state);
    }
  }

  resetGridPreferences(): void {
    localStorage.removeItem('gridState');
    window.location.reload(); // Reload to reset grid state visually
  }

  savedPreferenceNames: string[] = [];
selectedPreference: string = '';

  





}