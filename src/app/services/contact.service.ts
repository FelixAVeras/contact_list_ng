import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact } from '../models/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private localStorageKey = 'contacts';

  constructor() { }

  getContacts(): any[] {
    const contacts = localStorage.getItem(this.localStorageKey);
    return contacts ? JSON.parse(contacts) : [];
  }

  saveContact(contact: any): void {
    const contacts = this.getContacts();
    contacts.push(contact);
    localStorage.setItem(this.localStorageKey, JSON.stringify(contacts));
  }

  deleteContact(index: number): void {
    const contacts = this.getContacts();
    contacts.splice(index, 1);
    localStorage.setItem(this.localStorageKey, JSON.stringify(contacts));
  }
}
