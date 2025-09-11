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
import { AssignMembershipComponent } from './assign-membership/assign-membership.component';

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


     hasMembership: boolean = false;
     MembershipexpiryDate: Date = new Date()

  constructor(private fb: FormBuilder,private dialog:MatDialog,private tokenservice:TokenService,
    private clientservice:ClientService,private commonservice:CommonService,
  ) {
   
    this.UserForm = this.fb.group({
      _id: [''], 
      playerid: [{ value: '', readonly: true }], // readonly
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      gymId:['',[Validators.required]],
      subscriptionId:[{ value: '', disabled: true }],// Add subscription field
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



  AssignMembership(row: any): void {
    console.log(row,'row data');
    
    const mode= row==''?'Add':'Edit'
      const dialogRef = this.dialog.open(AssignMembershipComponent, {
        width: '600px',
        data: { membership:row, mode: mode,PlayerData:this.PlayerData}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.GetPlayerByid(this.PlayerData._id)
          this.GetPlayersList()
        }
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
    request$ = this.clientservice.UpdatePlayer(formData
    );
    successMessage = 'Player updated successfully';
    this.loading = false;
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

       GetPlayerByid(id:string): void {
        this.clientservice.getPlayerById(id).subscribe({
          next: (res: any) => {
            this.UserForm.patchValue(res.Users)    
             this.UserForm.patchValue({ gymId: res.Users.gymId?._id,subscriptionId: res.Users.subscriptionId?.planId });
            this.PlayerData=res.Users   
          },
          error: () => console.log('Failed to fetch Player by id'),
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

      PlayerData:any
    
      onEdit(user: any): void {
        this.UserDetailsTabDisabled = false; // enable
        this.onStateChange(user.state)
        this.UserForm.patchValue(user);
        this.UserForm.patchValue({
          gymId: user.gymId?._id,
          subscriptionId: user.subscriptionId?.planId
        });
        this.selectedUserId = user.playerid;
        this.isEditing = true;
        this.selectedTabIndex = 1;
        this.PlayerData=user
        console.log(this.PlayerData,'playerdata');
        
      }

   openSuccessDialog(message: string): void {
        this.dialog.open(SaveDailogComponent, { width: '400px', data: { message } });
      }
    
      openErrorDialog(message: string): void {
        this.dialog.open(ErrorDailogComponent, { width: '400px', data: { message } });
      }



    get membershipTooltip(): string {
  const sub = this.PlayerData?.subscriptionId;

  if (!sub) {
    return 'No active membership. Click to add a plan.';
  }

  const today = new Date();
  const endDate = sub?.endDate ? new Date(sub.endDate) : null;
  const dueDate = sub?.dueDate ? new Date(sub.dueDate) : null;

  // Check expiry
  if (endDate && endDate < today) {
    return 'Expired membership. Please renew.';
  }

  switch (sub?.paymentStatus) {
    case 'paid':
      return `Membership active. Ends on ${endDate?.toLocaleDateString()}`;
    case 'pending':
      return `Payment pending. Due on ${dueDate?.toLocaleDateString()}`;
    case 'partially_paid':
      return `Partially paid. Balance pending. Due on ${dueDate?.toLocaleDateString()}`;
    default:
      return 'Membership status unknown';
  }
}

isExpired(): boolean {
  const sub = this.PlayerData?.subscriptionId;
  if (!sub?.endDate) return false;

  const today = new Date();
  const endDate = new Date(sub.endDate);

  // Expired if endDate < today
  return endDate < today;
}


onLogoSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // ✅ Resize image if too large (optional)
      const maxWidth = 800;   // adjust as needed
      const maxHeight = 800;  // adjust as needed
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // ✅ Convert to compressed base64 (JPEG, quality 0.7)
      let base64String = canvas.toDataURL('image/jpeg', 0.7);

      // Ensure it's within 1 MB (retry with lower quality if needed)
      let quality = 0.7;
      while (base64String.length / 1024 > 1024 && quality > 0.2) {
        quality -= 0.1;
        base64String = canvas.toDataURL('image/jpeg', quality);
      }

      this.UserForm.patchValue({
        photo: base64String
      });

      this.UserForm.get('photo')?.markAsDirty();
    };
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
    width: '80px',
    // type: 'html', // Important: specify HTML type
    formatter: (rowData: any) => {
      const photoSrc = rowData.photo || 'images/teckfuel_usericon.png';
      return `<img src="${photoSrc}" width="50" height="50" style="border-radius: 50% !important; object-fit: cover;" alt="User photo" />`;
    }
  },
  // { header: 'Player ID', field: 'playerid', sortable: true },
  { header: 'Name', field: 'name', sortable: true },
  // { 
  //   header: 'Gym Name', 
  //   field: 'gymName', 
  //   sortable: true,
  //   formatter: (rowData) => rowData.gymId?.name || '-' 
  // },
  { header: 'Phone', field: 'phone', sortable: true },
  { header: 'Email', field: 'email', sortable: true },
  { header: 'Age', field: 'age', sortable: true },
  { header: 'Gender', field: 'gender', sortable: true },
  // { 
  //   header: 'Subscription Plan', 
  //   field: 'subscriptionPlan', 
  //   sortable: true,
  //   formatter: (rowData) => rowData.subscriptionId?.planName || '-' 
  // },
  { 
    header: 'Membarship Status', 
    field: 'subscriptionStatus', 
    sortable: true 
  },
  { header: 'Role', field: 'role', sortable: true },
  // { header: 'Status', field: 'IsStatus', sortable: true },
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
      !status || item.subscriptionStatus === status;

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
