import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MtxDialog } from '@ng-matero/extensions/dialog';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { AddGymPopupComponent } from 'app/shared-popups/add-gym-popup/add-gym-popup.component';

@Component({
  selector: 'app-gym-list',
  templateUrl: './gym-list.component.html',
  styleUrl: './gym-list.component.scss'
})
export class GymListComponent {


  constructor(
    private translate:TranslateService,
    private matdialog:MatDialog,
    private dialog:MtxDialog
  ){
    
  }

  columns: MtxGridColumn[] = [
    { header: 'Name', field: 'name',width: '180px' },
    { header: 'Owner', field: 'owner' },
    { header: 'Logo', field: 'logo', type: 'image' },
    { header: 'City', field: 'city', type: 'number' },
    { header: 'District', field: 'district', type: 'number' },
    { header: 'State', field: 'state', type: 'number' },
    { header: 'Phone', field: 'phone', type: 'number' },
    { header: 'Email', field: 'email' },
    { header: 'Website', field: 'website' },
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
    this.list = this.Dummylist
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
    this.matdialog.open(AddGymPopupComponent,{
      width:"600px"
    })
  }


  Dummylist = [
    {
      name: 'ArmsFit',
      logo: 'https://github.com/example/project-one',
      owner:"Hamsa",
      description: 'This is the first project.',
      city: "Kottakkal",
      forks_count: 15,
      score: 95.2,
      open_issues: 5,
      language: 'JavaScript',
      license: { name: 'MIT' },
      homepage: 'https://example.com/project-one',
      fork: false,
      archived: false,
  
    },

  ];

}
