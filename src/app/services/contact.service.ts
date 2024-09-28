import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact } from '../models/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private localStorageKey = 'contactList';

  constructor() { }

  getContacts(): Contact[] {
    const contacts = localStorage.getItem(this.localStorageKey);
    return contacts ? JSON.parse(contacts) : [];
  }

  addContact(contact: Contact): void {
    const contacts = this.getContacts();
    contact.id = contacts.length ? contacts[contacts.length - 1].id + 1 : 1;
    contacts.push(contact);
    this.saveContacts(contacts);
  }

  updateContact(contact: Contact): void {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === contact.id);
    
    if (index !== -1) {
      contacts[index] = contact;
      this.saveContacts(contacts);
    }
  }

  deleteContact(index: number): void {
    const contacts = this.getContacts();
    contacts.splice(index, 1);
    localStorage.setItem(this.localStorageKey, JSON.stringify(contacts));
  }

  saveContacts(contacts: Contact[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(contacts));
  }
}
