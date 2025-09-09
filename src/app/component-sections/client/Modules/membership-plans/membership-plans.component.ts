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
  { header: 'Subscription ID', field: 'subscriptionId', sortable: true, width: '130px' },
  { header: 'Plan Name', field: 'planName', sortable: true },
  { header: 'Plan Type', field: 'planType', sortable: true, width: '100px' },
  { header: 'Active', field: 'isActive', sortable: true, width: '90px', formatter: (r:any)=> r.isActive ? 'Yes' : 'No' },
  { 
    header: 'Price', 
    field: 'price', 
    sortable: true, 
    width: '100px',
    formatter: (rowData: any) => rowData.price ? `₹${rowData.price}` : '-'
  },
  { header: 'Duration (Months)', field: 'duration', sortable: true, width: '120px' },
  { 
    header: 'Status', 
    field: 'status', 
    sortable: true, 
    width: '100px',
    formatter: (rowData: any) => {
      const status = rowData.status || 'pending';
      const statusMap: { [key: string]: string } = {
        'active': '🟢 Active',
        'expired': '🔴 Expired', 
        'cancelled': '⚪ Cancelled',
        'pending': '🟡 Pending'
      };
      return statusMap[status] || status;
    }
  },
  { 
    header: 'Auto Renew', 
    field: 'autoRenew', 
    sortable: true, 
    width: '90px',
    formatter: (rowData: any) => rowData.autoRenew ? '✅ Yes' : '❌ No'
  },
  {
    header: 'Actions',
    field: 'actions',
    width: '80px',
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
   const UserSession= this.tokenservice.getAuthData()
        this.clientservice.getSubscriptionPlans(UserSession?.gymId).subscribe({
          next: (res: any) => {
           this.list = res.subscriptions
            this.filteredList = [...this.list];
          },
          error: () => this.openErrorDialog('Failed to fetch Subscription Plans'),
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
    width: '700px',
    height:'auto',
    minHeight:'500px',    data: {
      row:record,
      heading:"Update"    }
  });

  dialogRef.afterClosed().subscribe((result:any) => {
    this.GetmemBershipPlanList()
  })

}

CreatePlan(record:any){

  const dialogRef = this.dialog.open(PlanDialogeComponent, {
    width: '700px',
    height:'auto',
    minHeight:'500px',
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
