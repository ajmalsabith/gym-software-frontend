import { Component } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { TokenService } from 'app/service/token.service';
import { TrainerDialogComponent } from './trainer-dialog/trainer-dialog.component';
import { ConfirmDailogComponent } from 'app/layout-store/dialog/confirm-dailog/confirm-dailog.component';

@Component({
  selector: 'app-trainer-manage',
  templateUrl: './trainer-manage.component.html',
  styleUrl: './trainer-manage.component.scss'
})
export class TrainerManageComponent {
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
    this.getTrainerList();
    
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
      { header: 'Name', field: 'name', sortable: true },
      { header: 'Email', field: 'email', sortable: true },
      { header: 'Phone', field: 'phone', sortable: true, width: '120px' },
      { header: 'Age', field: 'age', sortable: true, width: '80px' },
      { header: 'Gender', field: 'gender', sortable: true, width: '100px' },
      {
        header: 'DOB',
        field: 'dob',
        sortable: true,
        width: '120px',
        formatter: (rowData: any) => rowData.dob ? new Date(rowData.dob).toLocaleDateString() : '-'
      },
      { 
        header: 'Created Date', 
        field: 'createdAt', 
        sortable: true, 
        width: '120px',
        formatter: (rowData: any) => rowData.createdAt ? new Date(rowData.createdAt).toLocaleDateString() : '-'
      },
      { 
        header: 'Status', 
        field: 'IsStatus', 
        sortable: true, 
        width: '100px',
        formatter: (rowData: any) => rowData?.IsStatus ? (String(rowData.IsStatus).toLowerCase() === 'active' ? 'Active' : 'Inactive') : '-'
      },
      {
        header: 'Operation',
        field: 'operation',
        width: '140px',
        pinned: 'right',
        right: '0px',
        type: 'button',
        buttons: [
          {
            type: 'icon',
            text: 'edit',
            icon: 'edit',
            tooltip: 'Edit',
            color: 'primary',
            click: (record: any) => this.edit(record),
          },
          {
            type: 'icon',
            text: 'delete',
            icon: 'delete',
            tooltip: 'Delete',
            color: 'warn',
            click: (record: any) => this.openConfirmDialog(record),
          },
        ],
      },
    ];
  }

  getTrainerList(): void {
    const sessionData = this.tokenservice.getAuthData();
    if (sessionData?.gymId) {
      this.clientservice.getTrainersList(sessionData.gymId).subscribe({
        next: (res: any) => {
         if(res.success){
this.filteredList = [...res.trainers];
this.list=this.filteredList
         }
          
          console.log('Trainers list:', this.list);
        },
        error: (err) => {
          console.error('Error fetching trainers:', err);
          this.list = [];
          this.filteredList = [];
        }
      });
    }
  }

  add(): void {
    const dialogRef = this.dialog.open(TrainerDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTrainerList(); // Refresh the list
      }
    });
  }

  edit(row: any): void {
    const dialogRef = this.dialog.open(TrainerDialogComponent, {
      width: '600px',
      data: { row, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTrainerList(); // Refresh the list
      }
    });
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
    if (confirm('Are you sure you want to delete this trainer?')) {
      this.clientservice.deleteTrainer(row._id).subscribe({
        next: (res: any) => {
          const dialogRef = this.dialog.open(SaveDailogComponent, {
            width: '400px',
            data: { message: 'Trainer deleted successfully' }
          });
          dialogRef.afterClosed().subscribe(() => {
            this.getTrainerList(); // Refresh the list
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
}
