// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';
// import { map, tap } from 'rxjs/operators';

// // Define your data model
// export interface Employee {
//   id: number;
//   record_id: string;
//   last_name: string;
//   first_name: string;
//   primary_mail: string;
//   phone: string;
//   budget: number;
//   appointment_type: string;
//   booking_agency: string;
// }

// const CREATE_ACTION = "create";
// const UPDATE_ACTION = "update";
// const REMOVE_ACTION = "destroy";

// @Injectable({
//   providedIn: 'root'
// })
// export class EditService extends BehaviorSubject<Employee[]> {
//   private data: Employee[] = [];

//   constructor(private http: HttpClient) {
//     super([]);
//   }

//   public read(): void {
//     if (this.data.length) {
//       return super.next(this.data);
//     }

//     this.fetch()
//       .pipe(tap(data => this.data = data))
//       .subscribe(data => super.next(data));
//   }

//   public save(data: Employee[], isNew?: boolean): void {
//     const action = isNew ? CREATE_ACTION : UPDATE_ACTION;
//     this.reset();
//     this.fetch(action, data).subscribe(
//       () => this.read(),
//       () => this.read()
//     );
//   }

//   public remove(data: Employee[]): void {
//     this.reset();
//     this.fetch(REMOVE_ACTION, data).subscribe(
//       () => this.read(),
//       () => this.read()
//     );
//   }

//   public resetItem(dataItem: Employee): void {
//     if (!dataItem) return;
//     const original = this.data.find(item => item.id === dataItem.id);
//     if (original) {
//       Object.assign(original, dataItem);
//       super.next(this.data);
//     }
//   }

//   private reset(): void {
//     this.data = [];
//   }

//   private fetch(action = '', data?: Employee[]): Observable<Employee[]> {
//     return this.http.jsonp(
//       `https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(data)}`,
//       'callback'
//     ).pipe(map((res: Object) => <Employee[]>res));
//   }

//   private serializeModels(data?: Employee[]): string {
//     return data ? `&models=${JSON.stringify(data)}` : '';
//   }
// }
