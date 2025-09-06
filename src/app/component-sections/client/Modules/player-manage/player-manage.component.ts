import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { Observable } from 'rxjs';
import { CommonService } from 'app/service/common.service';
import { ClientService } from '../../services/client.service';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-player-manage',
  templateUrl: './player-manage.component.html',
  styleUrl: './player-manage.component.scss'
})
export class PlayerManageComponent  implements OnInit{


   @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;
    @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  
    selectedTabIndex = 0;
    searchText = '';
    statusFilter = '';
    RoleFilter = ''
    GenderFilter = ''
    list: any[] = [];
    filteredList: any[] = [];
    columns: MtxGridColumn[] = [];
  
    hidePassword = true;
    hideConfirmPassword = true;
  
    // track whether we're editing an existing row (optional)
    editingIndex: number | null = null;
    isEditing = false;

    UserForm!: FormGroup;
    selectedUserId: number | null = null;
     authData:any

  constructor(private fb: FormBuilder,private dialog:MatDialog,private tokenservice:TokenService,
    private clientservice:ClientService,private commonservice:CommonService,
  ) {
   
    this.UserForm = this.fb.group({
      userId: [{ value: '', disabled: true }], // readonly
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      gymId:['',[Validators.required]],
      subscriptionId: ['', [Validators.required]], // Add subscription field
      phone: [''],
      age: [''],
      gender: [''],
      dob: [''],
      role: ['', Validators.required],
      line1: [''],
      city: [''],
      district: [''],
      state: [''],
      country: [''],
      zip: [''],
      photo:[''],
      IsStatus:['Active']
    });
  }




loading=false
  onUserSubmit(): void {
  if (this.UserForm.invalid) return;

  this.loading = true; // show spinner

  const formData = { ...this.UserForm.value };

  let request$: Observable<any>;
  let successMessage = '';

  if (this.isEditing && this.selectedUserId) {
    
    // Update existing user - implement later
    // request$ = this.clientservice.updateUser({
    //   id: this.selectedUserId,
    //   obj: formData
    // });
    // successMessage = 'Player updated successfully';
    this.loading = false;
    this.openErrorDialog('Update functionality not implemented yet');
    return;
  } else {
    // Create new player using new API
    request$ = this.clientservice.createPlayer(formData);
    successMessage = 'New Player created successfully';
  }

  request$.subscribe({
    next: (response) => {
      this.loading = false;
      this.resetForm();
      const dialogRef = this.dialog.open(SaveDailogComponent, {
        width: '400px',
        data: { message: successMessage }
      });
      dialogRef.afterClosed().subscribe(() => {
        this.selectedTabIndex = 0;
        this.UserDetailsTabDisabled = true;
        this.GetPlayersList(); // refresh user list
      });
    },
    error: (err) => {
      this.loading = false;
      const errorMsg = this.isEditing
        ? 'Failed to update Player'
        : 'Failed to create Player';
      this.openErrorDialog(errorMsg + ': ' + (err.error?.message || err.message));
      console.error(err);
    }
  });
}


Gymlist:any
MembershipPlansList: any[] = []; // Add this property


      // Add this method to load membership plans
      GetMembershipPlansList(): void {
        const gymId = localStorage.getItem('gymId') 
        this.clientservice.getMembershipPlansByGymID(gymId).subscribe({
          next: (res: any) => {
                 this.MembershipPlansList = res.subscriptions
          },
          error: () => this.openErrorDialog('Failed to fetch Membership Plans'),
        });
      }


 GetPlayersList(): void {
 const gymId = localStorage.getItem('gymId') 
        this.clientservice.getPlayersListByGymId(gymId).subscribe({
          next: (res: any) => {
            console.log(res,'==userlist');
            
            this.list = res.players;
            this.filteredList = [...res.players];
            this.applyFilters()
          },
          error: () => this.openErrorDialog('Failed to fetch Players List'),
        });
      }

 resetForm(): void {
        this.UserForm.reset({ 
          IsStatus: 'Active',
          role: 'player' // Set default role to player
        });
        this.selectedUserId = null;
        this.isEditing = false;
      }
    
      onEdit(user: any): void {
        this.UserDetailsTabDisabled = false; // enable
        this.onStateChange(user.state)
        this.UserForm.patchValue(user);
        this.UserForm.patchValue({
          gymId: user.gymId?._id,
          subscriptionId: user.subscriptionId?._id
        });
        this.selectedUserId = user.userId;
        this.isEditing = true;
        this.selectedTabIndex = 1;
      }

   openSuccessDialog(message: string): void {
        this.dialog.open(SaveDailogComponent, { width: '400px', data: { message } });
      }
    
      openErrorDialog(message: string): void {
        this.dialog.open(ErrorDailogComponent, { width: '400px', data: { message } });
      }


      onLogoSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const base64String = (reader.result as string).split(',')[1] || '';

    this.UserForm.patchValue({
      photo: `data:${file.type};base64,${base64String}`
    });

    // Optionally mark the form control as touched
    this.UserForm.get('photo')?.markAsDirty();
  };

  reader.readAsDataURL(file);
}
    

  getErrorMessage(): string {
    if (this.UserForm.get('email')?.hasError('required')) {
      return 'Email is required';
    }
    return this.UserForm.get('email')?.hasError('email') ? 'Not a valid email' : '';
  }

  @ViewChild('photoTpl', { static: true }) photoTpl!: TemplateRef<any>;

  
    ngOnInit(): void {
       this.authData = this.tokenservice.getAuthData()
       this.UserForm.controls['gymId'].setValue(this.authData.gymId)
      this.GetPlayersList()
      this.GetIndianStateDistList()
      this.GetMembershipPlansList() // Add this line
      

  
   this.columns = [
  {
      header: 'Photo',
      field: 'photo',
      cellTemplate: this.photoTpl,   // ✅ works with ViewChild
      width: '80px'
  },
  { header: 'User ID', field: 'userId', sortable: true },
  { header: 'Name', field: 'name', sortable: true },
  { 
    header: 'Gym Name', 
    field: 'gymName', 
    sortable: true,
    formatter: (rowData) => rowData.gymId?.name || '-' 
  },
  { header: 'Email', field: 'email', sortable: true },
  { header: 'Phone', field: 'phone', sortable: true },
  { header: 'Age', field: 'age', sortable: true },
  { header: 'Gender', field: 'gender', sortable: true },
  { 
    header: 'Subscription Plan', 
    field: 'subscriptionPlan', 
    sortable: true,
    formatter: (rowData) => rowData.subscriptionId?.planName || '-' 
  },
  { 
    header: 'Subscription Status', 
    field: 'subscriptionStatus', 
    sortable: true 
  },
  { header: 'Role', field: 'role', sortable: true },
  { header: 'Status', field: 'IsStatus', sortable: true },
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
      }
    ]
  }
];

  
    }
  
   

  
    
  applyFilters() {
  const search = this.searchText?.toLowerCase().trim() || '';
  const status = this.statusFilter;
  const role = this.RoleFilter;
  const gender = this.GenderFilter;

  this.filteredList = this.list.filter(item => {
    const fullName = `${item.name}`.toLowerCase();

    const matchesSearch =
      !search ||
      fullName.includes(search) ||
      item.email.toLowerCase().includes(search) || 
      item.phone.toLowerCase().includes(search) 

    const matchesStatus =
      !status || item.IsStatus === status;

    const matchesRole =
      !role || item.role === role;

    const matchesGender =
      !gender || item.gender === gender;

    return matchesSearch && matchesStatus && matchesRole && matchesGender
  });
}

  
    UserDetailsTabDisabled=true
    addUser() {
      const UserSession= this.tokenservice.getUserSession()
      this.UserForm.reset()
      this.UserForm.patchValue({gymId:UserSession?.gymId})
      this.selectedTabIndex = 1;
      this.UserDetailsTabDisabled = false; // enable
      
      // Set default values for new player
      const userSession = this.tokenservice.getAuthData();
      this.UserForm.patchValue({
        role: 'player',
        IsStatus: 'Active',
        gymId: userSession?.gymId
      });
    }

      
  
  
  
  
    
  
    onRowDoubleClick(rowData: any) {
      this.onEdit(rowData);
    }
  
  
    passwordMatchValidator(form: FormGroup) {
      const password = form.get('password')?.value;
      const confirmPassword = form.get('confirm_password')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
  

    onRowClick(event: any) {
      if (event?.event?.detail === 2) {
        this.onEdit(event.rowData);
      }
    }



     IndianCitiesList:any
      IndianStateDistList:any
       GetIndianCitiesList(): void {
        this.commonservice.getIndianCitiesList().subscribe({
          next: (res: any) => {            
            this.IndianCitiesList = res;
          },
          error: (err) => console.log(err.error),
        });
      }

       GetIndianStateDistList(): void {
        this.commonservice.getIndianStatesDistList().subscribe({
          next: (res: any) => {
            
            this.IndianStateDistList = res;
          },
          error: (err) => console.log(err.error),
          
        });
      }
  
        filteredDistricts: string[] = [];
    filtredCities:any[]=[]
onStateChange(selectedState: string) {
  const state = this.IndianStateDistList.find((s:any) => s.state === selectedState);
  this.filteredDistricts = state ? state.districts : [];

}

}
