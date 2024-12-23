import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { AddUserPopupComponent } from 'app/shared-popups/add-user-popup/add-user-popup.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  constructor(
    private translate:TranslateService,
    private matdialog:MatDialog,
    private dialog:MtxDialog
  ){
    
  }

  columns: MtxGridColumn[] = [
    { header: 'Name', field: 'name',width: '180px' },
    { header: 'Role', field: 'role',  },
    { header: 'Join Date', field: 'createdAt', },
    { header: 'Phone', field: 'phone', },
    { header: 'Email', field: 'email' },
    { header: 'Gyms', field: 'gyms' },
    {
      header: this.translate.stream('operation'),
      field: 'operation',
      minWidth: 140,
      width: '140px',
      pinned: 'right',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          icon: 'edit',
          tooltip: this.translate.stream('edit'),
          click: record => this.edit(record),
        },
        {
          type: 'icon',
          color: 'warn',
          icon: 'delete',
          tooltip: this.translate.stream('delete'),
          pop: {
            title: this.translate.stream('confirm_delete'),
            closeText: this.translate.stream('close'),
            okText: this.translate.stream('ok'),
          },
          click: record => this.delete(record),
        },
      ],
    },
  
  ];
  list: any[] = [];
  total = 0;
  isLoading = true;

  query = {
    q: 'user:nzbin',
    sort: 'stars',
    order: 'desc',
    page: 0,
    per_page: 10,
  };

  get params() {
    const p = Object.assign({}, this.query);
    p.page += 1;
    return p;
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.isLoading = true;
    
    this.isLoading = false

   
  }

  getNextPage(e: any) {
    this.query.page = e.pageIndex;
    this.query.per_page = e.pageSize;
    this.getList();
  }

  search() {
   
  }

  reset() {
    this.query.page = 0;
    this.query.per_page = 10;
    this.getList();
  }


  delete(value: any) {
    this.dialog.alert(`You have deleted ${value.position}!`);
  }

  edit(value:any){

  }


  openGymAddPopup(){
    this.matdialog.open(AddUserPopupComponent,{
      width:"700px"
    })
  }
}
