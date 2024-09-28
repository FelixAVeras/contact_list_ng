import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../models/Contact';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  contacts: Contact[] = [];
  isEditing: boolean = false;
  currentContactId: number | null = null;

  constructor(private contactService: ContactService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });

    this.loadContacts();
  }

  loadContacts() {
    this.contacts = this.contactService.getContacts();
  }

  addOrUpdateContact(): void {
    if (!this.contactForm.valid) {
      alert('The form is empty');

      return;
    }

    const newContact: Contact = {
      id: this.currentContactId ? this.currentContactId : 0,
      name: this.contactForm.value.name,
      phone: this.contactForm.value.phone,
      email: this.contactForm.value.email,
      address: this.contactForm.value.address
    }

    // this.contactService.addContact(newContact);

    if (this.isEditing && this.currentContactId) {
      this.contactService.updateContact(newContact);
      this.isEditing = false;
      this.currentContactId = null;  // Reiniciar el ID actual
    } else {
      this.contactService.addContact(newContact);
    }

    this.loadContacts();

    this.contactForm.reset();
  }

  editContact(contact: Contact): void {
    this.isEditing = true;
    this.currentContactId = contact.id;

    this.contactForm.patchValue({
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      address: contact.address
    });
  }

  updateLocalStorage() {
    localStorage.setItem('contactList', JSON.stringify([this.contacts]));
  }

  deleteContact(contact: Contact) {
    this.contacts = this.contacts.filter(c => c.email !== contact.email);
    this.updateLocalStorage();
  }

  clearForm() {
    this.contactForm.reset()
  }
  
  clearList() {
    if (confirm('Are you sure you want to clear all contacts? This action cannot be undone.')) {
      try {
        localStorage.removeItem('contactList');
        this.contacts = []; // Clear the contacts array in the component
        console.log('Contact list cleared successfully');
      } catch (error) {
        console.error('Error clearing contact list:', error);
      }
    }
  }
}
