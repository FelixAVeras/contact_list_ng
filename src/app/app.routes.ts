import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    { path:'', redirectTo:'contacts', pathMatch:'full' },
    { path:'contacts', component: ContactComponent }
];
