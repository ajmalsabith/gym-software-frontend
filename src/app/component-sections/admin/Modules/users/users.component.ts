import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

    @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;
    @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  
    selectedTabIndex = 0;
    searchText = '';
    statusFilter = '';
    list: any[] = [];
    filteredList: any[] = [];
    columns: MtxGridColumn[] = [];
    reactiveForm1!: FormGroup;
  
    hidePassword = true;
    hideConfirmPassword = true;
  
    // track whether we're editing an existing row (optional)
    editingIndex: number | null = null;
  
    constructor(private fb: FormBuilder) {}
  
    ngOnInit(): void {
      // sample staff data
      this.list = [
        { user_name: 'john_doe', email: 'john@example.com', contact_number: '1234567890', status: 'Active', first_name: 'John', last_name: 'Doe', address: '123 Street', role: '1' },
        { user_name: 'jane_smith', email: 'jane@example.com', contact_number: '9876543210', status: 'Inactive', first_name: 'Jane', last_name: 'Smith', address: '456 Avenue', role: '1' }
      ];
      this.filteredList = [...this.list];
  
      this.columns = [
        { header: 'Staff Name', field: 'first_name', sortable: true, formatter: (rowData) => `${rowData.first_name} ${rowData.last_name}` },
        { header: 'Email', field: 'email', sortable: true },
        { header: 'Contact', field: 'contact_number', sortable: true },
        { header: 'Status', field: 'status', sortable: true },
        {
          header: 'Actions',
          field: 'actions',
          width: '120px',
          pinned: 'right',
          cellTemplate: this.actionTpl,
          type: 'button',
          buttons: [{ icon: 'edit', tooltip: 'Edit', type: 'icon' }]
        }
      ];
  
      this.reactiveForm1 = this.fb.group({
        first_name: [''],
        last_name: [''],
        email: ['', [Validators.required, Validators.email]],
        contact_number: [''],
        user_name: ['', Validators.required],
        password: ['', Validators.required],
        confirm_password: ['', Validators.required],
        address: [''],
        role: ['', Validators.required],
        status: ['Active'],
        latitude: [''],
        longitude: ['']
      }, { validators: this.passwordMatchValidator });
    }
  
   
  
    // Dynamically loads Google Maps JS if not already loaded
    loadGoogleMapsScript(): Promise<void> {
      const win = window as any;
      return new Promise((resolve, reject) => {
        if (win.google && win.google.maps && win.google.maps.places) {
          resolve();
          return;
        }
  
        const existing = document.querySelector('script[data-google-maps]');
        if (existing) {
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', (e) => reject(e));
          return;
        }
  
       
      });
    }
  
    
  
    applyFilters() {
      const search = this.searchText.toLowerCase().trim();
      const status = this.statusFilter;
  
      this.filteredList = this.list.filter(item => {
        const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
        const matchesSearch = !search || fullName.includes(search) || item.email.toLowerCase().includes(search);
        const matchesStatus = !status || item.status === status;
        return matchesSearch && matchesStatus;
      });
    }
  
    addClient() {
      this.selectedTabIndex = 1;
      this.editingIndex = null;
      this.reactiveForm1.reset({ status: 'Active' });
    }
  
    saveStaff() {
      if (!this.reactiveForm1.valid) return console.warn('Form invalid');
  
      const value = this.reactiveForm1.value;
      if (this.editingIndex !== null) {
        // update existing
        this.list[this.editingIndex] = { ...this.list[this.editingIndex], ...value };
        this.filteredList = [...this.list];
      } else {
        // add new
        this.list.push({ ...value });
        this.filteredList = [...this.list];
      }
  
      console.log('Staff saved:', value);
      this.selectedTabIndex = 0;
    }
  
  
  
    editStaff(row: any) {
      this.editingIndex = this.list.findIndex(r => r.user_name === row.user_name);
      this.selectedTabIndex = 1;
      this.reactiveForm1.patchValue(row);
    }
  
    onRowDoubleClick(rowData: any) {
      this.editStaff(rowData);
    }
  
  
    passwordMatchValidator(form: FormGroup) {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirm_password')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
  
    getErrorMessage() {
      return this.reactiveForm1.get('email')?.hasError('required') ? 'Email is required'
        : this.reactiveForm1.get('email')?.hasError('email') ? 'Invalid email'
        : '';
    }
  
    onRowClick(event: any) {
      if (event?.event?.detail === 2) {
        this.editStaff(event.rowData);
      }
    }

}
