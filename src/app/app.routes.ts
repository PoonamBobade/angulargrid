import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GridComponent } from './grid/grid.component';
import { EditService } from './edit.service';

export const routes: Routes = [

{path :  'navbar' , component : NavbarComponent },
{path : 'grid' ,  component : GridComponent},
// {path : 'editservice' ,  component : EditService},


   


];
