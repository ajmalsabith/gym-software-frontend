import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ApiServiceService } from 'app/service/api-service.service';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.component.html',
  styleUrl: './gym.component.scss'
})
export class GymComponent {

   @ViewChild('addressInput') addressInput!: ElementRef;
  
    selectedTabIndex = 0;
    clientDetailsTabDisabled = true; // controls tab enable/disable
  
    list: any[] = [];
    filteredList: any[] = [];
  
    searchText: string = '';
    statusFilter: string = '';
  
    reactiveForm1: FormGroup;
  
    hidePassword = true;
    hideConfirmPassword = true;
  
    selectedClientId: number | null = null;
    isEditing = false;
  
    columns: MtxGridColumn[] = [
      {
        header: 'Client Name',
        sortable: true,
        field: 'first_name',
        formatter: (rowData: any) => `${rowData.first_name || ''} ${rowData.last_name || ''}`.trim(),
      },
      { header: 'Email', field: 'email', sortable: true },
      { header: 'Contact', field: 'contact_number', sortable: true },
      { header: 'Status', field: 'status', sortable: true },
      {
        header: 'Actions',
        field: 'actions',
        width: '120px',
        pinned: 'right',
        type: 'button',
        buttons: [
          {
            icon: 'edit',
            tooltip: 'Edit',
            type: 'icon',
            click: (record: any) => this.onEdit(record),
          },
        ],
      },
    ];
  
    constructor(
      private fb: FormBuilder,
      private apiService: ApiServiceService,
      private dialog: MatDialog,
    ) {
      this.reactiveForm1 = this.fb.group(
        {
          user_name: ['', Validators.required],
          password: ['', Validators.required],
          confirm_password: ['', Validators.required],
          first_name: ['', Validators.required],
          last_name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          contact_number: ['', Validators.required],
          address: [''],
          status: ['Active', Validators.required],
        },
        { validators: this.passwordMatchValidator, updateOn: 'change' }
      );
    }
  
    ngOnInit(): void {
      
    }
  
   
    // Handle tab change
    onTabChange(index: number): void {
      this.selectedTabIndex = index;
  
      // If switched to Client List tab (index 0) -> disable details tab
      if (index === 0) {
        this.clientDetailsTabDisabled = true;
      }
    }
  


    loading = false; 
    onSubmit(): void {
      if (!this.reactiveForm1.valid) return;
    
      this.loading = true; // show spinner
    
      const formData = { ...this.reactiveForm1.value };
      delete formData.confirm_password;
    
      if (this.isEditing && this.selectedClientId) {
        this.apiService.updateClient(this.selectedClientId, formData).subscribe({
          next: () => {
            this.loading = false; // hide spinner
            this.resetForm();
            // Show dialog first, then go to first tab
            const dialogRef = this.dialog.open(SaveDailogComponent, {
              width: '400px',
              data: { message: 'Client updated successfully' },
            });
            dialogRef.afterClosed().subscribe(() => {
              this.selectedTabIndex = 0;
              this.clientDetailsTabDisabled = true;
            });
          },
          error: () => {
            this.loading = false;
            this.openErrorDialog('Failed to update client');
          },
        });
      } else {
        this.apiService.createClient(formData).subscribe({
          next: () => {
            this.loading = false;
            this.resetForm();
            const dialogRef = this.dialog.open(SaveDailogComponent, {
              width: '400px',
              data: { message: 'Client created successfully' },
            });
            dialogRef.afterClosed().subscribe(() => {
              this.selectedTabIndex = 0;
              this.clientDetailsTabDisabled = true;
            });
          },
          error: () => {
            this.loading = false;
            this.openErrorDialog('Failed to create client');
          },
        });
      }
    }
    
      resetForm(): void {
        this.reactiveForm1.reset({ status: 'Active' });
        this.selectedClientId = null;
        this.isEditing = false;
      }
    
      onEdit(client: any): void {
        this.clientDetailsTabDisabled = false; // enable
        this.reactiveForm1.patchValue({
          ...client,
          confirm_password: client.password,
        });
        this.selectedClientId = client.id;
        this.isEditing = true;
        this.selectedTabIndex = 1;
      }
    
      onRowClick(event: any) {
        if (event?.event?.detail === 2) {
          const rowData = event?.row || event?.data;
          if (rowData) this.onEdit(rowData);
        }
      }
    
      openSuccessDialog(message: string): void {
        this.dialog.open(SaveDailogComponent, { width: '400px', data: { message } });
      }
    
      openErrorDialog(message: string): void {
        this.dialog.open(ErrorDailogComponent, { width: '400px', data: { message } });
      }
    
      applyFilters(): void {
        this.filteredList = this.list.filter((item) => {
          const fullName = `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase();
          const matchesSearch = this.searchText
            ? fullName.includes(this.searchText.toLowerCase()) ||
              item.email.toLowerCase().includes(this.searchText.toLowerCase())
            : true;
          const matchesStatus = this.statusFilter ? item.status === this.statusFilter : true;
          return matchesSearch && matchesStatus;
        });
      }
    
      getErrorMessage(): string {
        const emailControl = this.reactiveForm1.get('email');
        if (emailControl?.hasError('required')) return 'Email is required';
        if (emailControl?.hasError('email')) return 'Invalid email';
        return '';
      }
    
      GetGymList(): void {
        this.apiService.getClients().subscribe({
          next: (res: any) => {
            this.list = res;
            this.filteredList = [...res];
          },
          error: () => this.openErrorDialog('Failed to fetch Gym Details'),
        });
      }
    
      passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
        const pass = group.get('password')?.value;
        const confirm = group.get('confirm_password')?.value;
        return pass === confirm ? null : { passwordMismatch: true };
      }
    
      addClient(): void {
        this.clientDetailsTabDisabled = false; // enable
        this.selectedTabIndex = 1;
      }
    
    
  

}
