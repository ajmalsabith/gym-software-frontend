import { Component } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { TokenService } from 'app/service/token.service';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';


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
      header: 'Payment Date',
      field: 'date',
      sortable: true,
      formatter: (row: any) =>
        row?.date ? new Date(row.date).toLocaleDateString() : '-'
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
  header: 'Invoice',
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
        this.PaymentList=res.data
      },(err)=>{
        console.log(err);
        
      })
    }
   }
    
    applyFilter(): void {
      this.filteredList = this.list.filter(trainer => {
        const searchMatch = !this.searchText || 
    trainer.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
          trainer.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
          trainer.phone?.includes(this.searchText);
  
        const statusMatch = !this.statusFilter || 
    (this.statusFilter === 'active' && String(trainer?.IsStatus).toLowerCase() === 'active') ||
    (this.statusFilter === 'inactive' && String(trainer?.IsStatus).toLowerCase() === 'inactive');
  
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



}
