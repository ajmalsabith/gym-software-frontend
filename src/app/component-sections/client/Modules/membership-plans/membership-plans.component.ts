import { Component } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { PlanDialogeComponent } from './plan-dialoge/plan-dialoge.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-membership-plans',
  templateUrl: './membership-plans.component.html',
  styleUrl: './membership-plans.component.scss'
})
export class MembershipPlansComponent {


  searchText = '';
  statusFilter = '';
  list: any[] = [];
  filteredList: any[] = [];
  columns: MtxGridColumn[] = [];
  
  constructor(private dialog:MatDialog,private clientservice:ClientService,private tokenservice:TokenService){}

   ngOnInit(): void {


   this.GetmemBershipPlanList()
  
   this.columns = [
  { header: 'Plan Name', field: 'planName', sortable: true },
  { header: 'Plan Type', field: 'planType', sortable: true },
  { header: 'Duration (Months)', field: 'durationInMonths', sortable: true },
  { header: 'Price', field: 'price', sortable: true },
  { header: 'Features', field: 'features', sortable: true },
  { 
    header: 'Gym Name', 
    field: 'gymId', 
    sortable: true,
    formatter: (rowData) => rowData.gymId?.name || '-' 
  },
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
      }
    ]
  }
];


  
}

 GetmemBershipPlanList(): void {
   const UserSession= this.tokenservice.getUserSession()
        this.clientservice.getMembershipPlansByGymID(UserSession?.gymId).subscribe({
          next: (res: any) => {
            
            this.list = res;
            this.filteredList = [...res];
          },
          error: () => this.openErrorDialog('Failed to fetch Players List'),
        });
  }

  applyFilters() {
  const search = this.searchText?.toLowerCase().trim() || '';
  const status = this.statusFilter;

  this.filteredList = this.list.filter(item => {
    const fullName = `${item.planName}`.toLowerCase();

    const matchesSearch =
      !search ||
      fullName.includes(search)  
      
    const matchesStatus =
      !status || item.status === status;


    return matchesSearch && matchesStatus 
  });
}


onEdit(record:any){

  const dialogRef = this.dialog.open(PlanDialogeComponent, {
    width: '600px',
    height:'auto',
    minHeight:'350px',    data: {
      row:record,
      heading:"Update"    }
  });

  dialogRef.afterClosed().subscribe((result:any) => {
    this.GetmemBershipPlanList()
  })

}

CreatePlan(record:any){

  const dialogRef = this.dialog.open(PlanDialogeComponent, {
    width: '600px',
    height:'auto',
    minHeight:'350px',
    data: {
      heading:"Create"
    }
  });

  dialogRef.afterClosed().subscribe((result:any) => {
 this.GetmemBershipPlanList()
  })

}


 openSuccessDialog(message: string): void {
        this.dialog.open(SaveDailogComponent, { width: '400px', data: { message } });
      }
    
      openErrorDialog(message: string): void {
        this.dialog.open(ErrorDailogComponent, { width: '400px', data: { message } });
      }



}
