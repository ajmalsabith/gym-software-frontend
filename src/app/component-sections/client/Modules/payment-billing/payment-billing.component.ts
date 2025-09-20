import { Component } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { TokenService } from 'app/service/token.service';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { ConfirmDailogComponent } from 'app/layout-store/dialog/confirm-dailog/confirm-dailog.component';


@Component({
  selector: 'app-payment-billing',
  templateUrl: './payment-billing.component.html',
  styleUrl: './payment-billing.component.scss'
})
export class PaymentBillingComponent {


   searchText = '';
  statusFilter = '';
  list: any[] = [];
  filteredList: any[] = [];
  columns: MtxGridColumn[] = [];
  
  constructor(
    private dialog: MatDialog,
    private clientservice: ClientService,
    private tokenservice: TokenService
  ) {}


  ngOnInit(): void {
  this.GetPaymentHistory();
  this.columns = [
    {
      header: 'Name',
      field: 'playerId.name',
      sortable: true,
      formatter: (row: any) => row?.playerId?.name || '-'
    },
    {
      header: 'Email',
      field: 'playerId.email',
      sortable: true,
      formatter: (row: any) => row?.playerId?.email || '-'
    },
    // {
    //   header: 'Plan Amount',
    //   field: 'membershipId.totalAmount',
    //   sortable: true,
    //   formatter: (row: any) => row?.membershipId?.totalAmount ?? '-'
    // },
    // {
    //   header: 'Paid Amount',
    //   field: 'membershipId.paidAmount',
    //   sortable: true,
    //   formatter: (row: any) => row?.membershipId?.paidAmount ?? '-'
    // },
    // {
    //   header: 'Balance',
    //   field: 'membershipId.balance',
    //   sortable: true,
    //   formatter: (row: any) => row?.membershipId?.balance ?? '-'
    // },
    // {
    //   header: 'Membership Status',
    //   field: 'membershipId.status',
    //   sortable: true,
    //   formatter: (row: any) => row?.membershipId?.status || '-'
    // },
    {
      header: 'Payment Amount',
      field: 'amount',
      sortable: true,
      formatter: (row: any) => row?.amount ?? '-'
    },
    {
      header: 'Payment Type',
      field: 'paymentType',
      sortable: true,
      formatter: (row: any) => row?.paymentType || '-'
    },
    {
      header: 'Payment Status',
      field: 'status',
      sortable: true,
      formatter: (row: any) => row?.status || '-'
    },
    {
      header: 'Transaction Id',
      field: 'transactionId',
      sortable: true,
      formatter: (row: any) => row?.transactionId || '-'
    },
   {
  header: 'Payment Date & Time',
  field: 'date',
  sortable: true,
  formatter: (row: any) =>
    row?.date ? new Date(row.date).toLocaleString() : '-'
},
    {
      header: 'Notes',
      field: 'notes',
      sortable: false,
      formatter: (row: any) => row?.notes || '-'
    },
    {
      header: 'Created Date',
      field: 'createdAt',
      sortable: true,
      formatter: (row: any) =>
        row?.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'
    },
    {
  header: 'Operation',
  field: 'actions',
  width: '120px',
  pinned: 'right',
  type: 'button',
  buttons: [
    {
      icon: 'receipt_long',   // Material Icon for invoice/receipt
      tooltip: 'View Invoice',
      type: 'icon',           // or 'label' if you want only text
      click: (record: any) => this.openInvoiceDialog(record),
    },
              {
            type: 'icon',
            text: 'delete',
            icon: 'delete',
            tooltip: 'Delete',
            color: 'warn',
            click: (record: any) => this.openConfirmDialog(record),
          }
  ]
}

  ];
}


    PaymentList:any
    GetPaymentHistory(){
      const sessionData = this.tokenservice.getAuthData();
     if (sessionData?.gymId) {
      this.clientservice.getPaymentsByGym(sessionData.gymId).subscribe((res:any)=>{
        console.log(res.data,'payment list');
        this.PaymentList = res.data.reverse();
        this.list=res.data
      },(err)=>{
        console.log(err);
        
      })
    }
   }
    
    applyFilter(): void {
  this.PaymentList = this.list.filter(payment => {
    // Check search text match
    const searchMatch =
      !this.searchText ||
      payment.playerId.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      payment.playerId.email?.toLowerCase().includes(this.searchText.toLowerCase());

    // Check status filter match
    const statusMatch =
      !this.statusFilter ||
      payment.paymentType.toLowerCase() === this.statusFilter.toLowerCase();

    return searchMatch && statusMatch;
  });
}


   openInvoiceDialog(row: string) {
  this.dialog.open(InvoiceReportComponent, {
    width: '900px',
    height:'auto',
    data: row
  });
}
sendRenewalReminder(name: string, phone: string, dueDate: string) {
  const message = `💪 Hi ${name},
📅 Your membership renewal is pending on ${dueDate}.
⚡ Please complete it soon to continue your workouts.

🙏 Regards,
Your Gym Team`;

  // Encode the whole message safely (this keeps emojis intact)
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}




 openConfirmDialog(row:any) {
  const dialogRef = this.dialog.open(ConfirmDailogComponent, {
    width: '350px',
    data: { message: 'Are you sure you want to Delete?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.delete(row)
      console.log('Confirmed');
    } 
  });
}


  delete(row: any): void {
      this.clientservice.DeletePaymentByid(row._id).subscribe({
        next: (res: any) => {
          const dialogRef = this.dialog.open(SaveDailogComponent, {
            width: '400px',
            data: { message: 'Payment deleted successfully' }
          });
          dialogRef.afterClosed().subscribe(() => {
            this.GetPaymentHistory(); // Refresh the list
          });
        },
        error: (err) => {
          console.error('Error deleting trainer:', err);
          const dialogRef = this.dialog.open(ErrorDailogComponent, {
            width: '400px',
            data: { message: 'Error deleting trainer. Please try again.' }
          });
        }
      });
    
  }

}
