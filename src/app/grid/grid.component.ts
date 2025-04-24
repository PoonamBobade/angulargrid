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
import { EmployeeService } from '../emloyee.service';

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

  saveHandler({ sender, rowIndex, dataItem }: any): void {
    sender.closeRow(rowIndex);

    const index = this.gridData.findIndex(item => item.id === dataItem.id);
    if (index !== -1 && this.editedItem) {
      this.gridData[index] = this.editedItem;
      this.employeeService.updateEmployee(dataItem.id, this.editedItem).subscribe(() => {
        this.fetchEmployees();
      });
    }
    this.editedItem = undefined;
  }

  removeHandler(dataItem: any): void {
    this.employeeService.deleteEmployee(dataItem.id).subscribe(() => {
      this.gridData = this.gridData.filter(item => item.id !== dataItem.id);
      this.gridView = [...this.gridData];
    });
  }

  editHandler({ sender, rowIndex, dataItem }: any): void {
    this.editedItem = { ...dataItem };
    sender.editRow(rowIndex);
  }

  cancelHandler(): void {
    this.editedItem = undefined;
  }

  onFilter(value: string): void {
    const inputValue = value.toLowerCase();
  
    const result = process(this.gridData, {
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
    });
  
    this.gridView = result.data; // ✅ Make sure this is an array!
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
