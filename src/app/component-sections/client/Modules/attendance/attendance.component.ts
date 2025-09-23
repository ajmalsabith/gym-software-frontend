import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from 'app/service/token.service';
import { ClientService } from '../../services/client.service';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MarkAttendanceDailogComponent } from './mark-attendance-dailog/mark-attendance-dailog.component';
import { MembershipClearComponent } from 'app/layout-store/dialog/membership-clear/membership-clear.component';
import { ConfirmDailogComponent } from 'app/layout-store/dialog/confirm-dailog/confirm-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {


  constructor(private dailog:MatDialog,private tokenservice:TokenService,private clientservice:ClientService){}

 

  // Initialize filters
presentFilters = {
  playerName: '',
  fromDate: new Date(),
  toDate: new Date()
};

absentFilters = {
  playerName: '',
  fromDate: new Date(),
  toDate: new Date()
};

// Data lists
presentList :any[]= [];
absentList :any[] = [];

AllAbsents:any=[]
AllPresents:any=[]

// Column definitions
presentColumns: MtxGridColumn[] = [
  { header: 'Player Name', field: 'playerId.name', sortable: true },
  { header: 'Marked By', field: 'markedBy', sortable: true },
  { header: 'Date', field: 'date', type: 'date' },
{ 
    header: 'Check-In', 
    field: 'checkInTime', 
    formatter: (record) => {
      if (!record.checkInTime) return '';
      const date = new Date(record.checkInTime);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  },  { header: 'Check-Out', field: 'checkOutTime', type: 'date' },
  // { header: 'Latitude', field: 'lat', type: 'number' },
  // { header: 'Longitude', field: 'lng', type: 'number' },
  { header: 'Notes', field: 'notes', sortable: true },
  {
    header: 'Actions',
    field: 'actions',
    pinned: 'right',
    right: '0px',
    type: 'button',
    buttons: [
      {
      type: 'icon',
            text: 'Delete',
            icon: 'delete',
            tooltip: 'Delete',
            color: 'warn',
        click: (record) => this.openConfirmDialogDelete(record,'prs')
      }
    ]
  }
];
absentColumns: MtxGridColumn[] = [
  { header: 'Player Name', field: 'playerId.name', sortable: true  },
  { header: 'Marked By', field: 'markedBy', sortable: true  },
  { header: 'Date', field: 'date', type: 'date' },
  { header: 'Reason', field: 'reason', sortable: true  },
  {
    header: 'Actions',
    field: 'actions',
    pinned: 'right',
    right: '0px',
    type: 'button',
    buttons: [
      {
       type: 'icon',
            text: 'Delete',
            icon: 'delete',
            tooltip: 'Delete',
            color: 'warn',
        click: (record) => this.openConfirmDialogDelete(record,'abs')
      }
    ]
  }
];



ngOnInit(){
  this.getAbsentsList()
  this.getPresentsList()

  
}


getPresentsList(): void {
  const sessionData = this.tokenservice.getAuthData();
  if (sessionData?.gymId) {
    const from = this.presentFilters.fromDate?.toISOString().split('T')[0];
    const to = this.presentFilters.toDate?.toISOString().split('T')[0];

    this.clientservice.getPresents(sessionData.gymId, from, to).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.presentList = [...res.data];
          this.AllPresents = this.presentList;
        }
        console.log('Present list:', res);
      },
      error: (err) => {
        console.error('Error fetching presents list:', err);
        this.AllPresents = [];
        this.presentList = [];
      }
    });
  }
}

getAbsentsList(): void {
  const sessionData = this.tokenservice.getAuthData();
  if (sessionData?.gymId) {
    const from = this.absentFilters.fromDate?.toISOString().split('T')[0];
    const to = this.absentFilters.toDate?.toISOString().split('T')[0];

    this.clientservice.getAbsents(sessionData.gymId, from, to).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.absentList = [...res.data];
          this.AllAbsents = this.absentList;
        }
        console.log('Absents list:', res);
      },
      error: (err) => {
        console.error('Error fetching absents list:', err);
        this.AllAbsents = [];
        this.absentList = [];
      }
    });
  }
}



deletePresent(id: string) {
    this.clientservice.deletePresent(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.getPresentsList()
          // this.presentList = this.presentList.filter(p => p._id !== id);
          // this.AllPresents = [...this.presentList];
          console.log('Present deleted successfully');
        }
      },
      error: (err) => {
        console.error('Error deleting present:', err);
      }
    });
  
}

deleteAbsent(id: string) {
    this.clientservice.deleteAbsent(id).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.getAbsentsList()
          // this.absentList = this.absentList.filter(a => a._id !== id);
          // this.AllAbsents = [...this.absentList];
          console.log('Absent deleted successfully');
        }
      },
      error: (err) => {
        console.error('Error deleting absent:', err);
      }
    });
  
}

 openConfirmDialogDelete(row:any,type:any) {
  const dialogRef = this.dailog.open(ConfirmDailogComponent, {
    width: '350px',
    data: { message: 'Are you sure you want to Delete?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if(type=='prs'){
        this.deletePresent(row?._id)
      }else{
        this.deleteAbsent(row?._id)
      }
      console.log('Confirmed');
    } 
  });
}



openConfirmDialog() {
  const dialogRef = this.dailog.open(ConfirmDailogComponent, {
    width: '350px',
    data: { message: 'Are you sure you want to mark all absent members today?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const sessionData = this.tokenservice.getAuthData();
      if(sessionData?.gymId){
      this.clientservice.markAbsentsForToday(sessionData?.gymId).subscribe((res:any)=>{
                   this.dailog.open(SaveDailogComponent, {
                        width: '400px',
                        data: { message:"Absents marked successfully" }
                  });
                  this.getAbsentsList()
      },(err)=>{
                this.dailog.open(ErrorDailogComponent, {
                      width: '400px',
                      data: { message: err.error.message }
                });
      })
      }

      console.log('Confirmed');
    } 
  });
}


applyPresentFilter(): void {
  const name = this.presentFilters.playerName?.toLowerCase();

  // Frontend filter only
  this.presentList = this.AllPresents.filter((p: any) => {
    const playerName = p.playerId?.name?.toLowerCase() || '';
    const matchesName = !name || playerName.includes(name);
    return matchesName 
  });
}


fetchPresents(): void {
  this.presentFilters.playerName=""
  const from = this.presentFilters.fromDate?.toISOString().split('T')[0];
  const to = this.presentFilters.toDate?.toISOString().split('T')[0];

  const sessionData = this.tokenservice.getAuthData();
  if (sessionData?.gymId) {
    this.clientservice.getPresents(sessionData.gymId, from, to).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.AllPresents = [...res.data];
          this.presentList = [...res.data]; // initial display
        }
      },
      error: (err) => console.error('Error fetching presents:', err)
    });
  }
}
 


fetchabsents(): void {
  this.absentFilters.playerName=""
  const from = this.absentFilters.fromDate?.toISOString().split('T')[0];
  const to = this.absentFilters.toDate?.toISOString().split('T')[0];

  const sessionData = this.tokenservice.getAuthData();
  if (sessionData?.gymId) {
  this.clientservice.getAbsents(sessionData.gymId, from, to).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.absentList = [...res.data];
          this.AllAbsents = [...res.data]; // update master list
        }
      },
      error: (err) => console.error('Error fetching absents:', err)
    });
  }
}



applyAbsentFilter(): void {
  const name = this.absentFilters.playerName?.toLowerCase();

  // Frontend filter only
  this.absentList = this.AllAbsents.filter((p: any) => {
    const playerName = p.playerId?.name?.toLowerCase() || '';
    const matchesName = !name || playerName.includes(name);
    return matchesName 
  });
}




// Example functions
markPresent() {
  console.log('Marking present', this.presentFilters);
     const dialogRef = this.dailog.open(MarkAttendanceDailogComponent, {
                  width: '500px',
            })
            dialogRef.afterClosed().subscribe((res:any)=>{
              this.getPresentsList()
            })
}

markAbsent() {
  console.log('Marking absent', this.absentFilters);
  // call attendance service
}


}
