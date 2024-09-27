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
  contacts: Contact[] = [];
  
  contactForm!: FormGroup;

  constructor(private contactService: ContactService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });

    this.getContacts();
  }

  getContacts() {
    const storedData = localStorage.getItem('contactData');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        this.contacts = Array.isArray(parsedData[0]) ? parsedData[0] : parsedData;
      } catch (error) {
        console.error('Error parsing contact data:', error);
        this.contacts = [];
      }
    } else {
      this.contacts = [];
    }
  }

  addContact(): void {
    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      
      return;
    }
  
    const formData = this.contactForm.value;
  
    const storedData = localStorage.getItem('contactList');
    let contactList = storedData ? JSON.parse(storedData) : [];
  
    if (!Array.isArray(contactList)) {
      contactList = [];
    }
  
    contactList.push(formData);
  
    localStorage.setItem('contactList', JSON.stringify(contactList));
  
    this.getContacts();
    this.contactForm.reset();
  }

  updateLocalStorage() {
    localStorage.setItem('contactData', JSON.stringify([this.contacts]));
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
        localStorage.removeItem('contactData');
        this.contacts = []; // Clear the contacts array in the component
        console.log('Contact list cleared successfully');
      } catch (error) {
        console.error('Error clearing contact list:', error);
      }
    }
  }
}
