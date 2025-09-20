import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { AppSettings, SettingsService } from '@core';
import { DashboardService } from './dashboard.service';

import { ClientService } from '../../services/client.service';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponentClient implements OnInit, OnDestroy {


  constructor(private settings:SettingsService,private ngZone:NgZone,
    private clientService:ClientService,private tokenservice:TokenService
  ){


  }


  // Example dynamic values (replace with API response)
totalRevenue: number = 0;
balanceDue: number = 0;
expiringSoon: number = 0;
todayRevenue: number = 0;
newMembers: number = 0;
inactiveMembership :number=0
activeMembership  :number=0



  charts:any[]=[]
  chart1?: ApexCharts;
  chart2?: ApexCharts;




  notifySubscription = Subscription.EMPTY;

  gymId:any
   balanceDueToday: any;
  expiringMemberships: any;
  membershipDashboard: any;
  paymentDashboard: any;

  // For demo: "popularPlans" comes from your API
popularPlans :any[]= []



  ngOnInit() {
       const UserSession= this.tokenservice.getAuthData()
       this.gymId=UserSession?.gymId

    this.loadBalanceDueToday();
    this.loadExpiringMemberships();
    this.loadMembershipDashboard();
    this.loadMostPopularPlans();
    this.loadPaymentDashboard();
    this.loadLastPaymentsDashboard();
  }

    loadBalanceDueToday() {
    this.clientService.getBalanceDueToday(this.gymId).subscribe({
      next: (res) => {
        this.balanceDueToday = res.balanceDueToday;
        console.log('Balance Due Today:', res);
      },
      error: (err) => console.error('Error fetching Balance Due Today:', err),
    });
  }

  // 2️⃣ Expiring Memberships
  loadExpiringMemberships() {
    this.clientService.getExpiringMemberships(this.gymId).subscribe({
      next: (res) => {
        this.expiringMemberships = res;
        console.log('Expiring Memberships:', res);
      },
      error: (err) => console.error('Error fetching Expiring Memberships:', err),
    });
  }

  // 3️⃣ Membership Dashboard
  loadMembershipDashboard() {
    this.clientService.getMembershipDashboard(this.gymId).subscribe({
      next: (res) => {
                console.log(res.membershipBalanceTotal,'balnce...');
        this.membershipDashboard = res.membershipStats;
        this.newMembers=res.newMembers
        this.activeMembership=res.activeMembers
        this.inactiveMembership=res.expiredMembers
        this.balanceDue= res.membershipBalanceTotal[0].totalBalance
        console.log('Membership Dashboard:', res);
      },
      error: (err) => console.error('Error fetching Membership Dashboard:', err),
    });
  }

  // 4️⃣ Most Popular Plans
 mostPopularPlans: any[] = [];


loadMostPopularPlans() {
  this.clientService.getMostPopularPlans(this.gymId).subscribe({
    next: (res) => {
      this.popularPlans = res.popularPlans || [];
      console.log('Popular Plans:', this.popularPlans);
    },
    error: (err) => console.error('Error fetching Most Popular Plans:', err),
  });
}


displayedColumns: string[] = ['photo', 'name', 'amount', 'paymentType', 'time'];

 images=[
    'images/rank 1.jpg',
    'images/rank 2.jpg',
    'images/rank 3.jpg'
  ]


LatestPaymentList:any
loadLastPaymentsDashboard() {
  this.clientService.GetloadLastPaymentsDashboard(this.gymId).subscribe({
    next: (res) => {
      this.LatestPaymentList = res.last10Payments.map((p:any, index:any) => ({
  position: index + 1,
  photo: p.playerId?.photo || 'images/teckfuel_usericon.png', // fallback if no photo
  name: p.playerId?.name || '-',
  amount: p.amount,
  paymentType: p.paymentType,
  time: new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}));
    },
    error: (err) => console.error('Error fetching Most Popular Plans:', err),
  });
}

  // 5️⃣ Payment Dashboard
monthlyRevenueLabels: string[] = [];
monthlyRevenueValues: number[] = [];

revenueByTypeLabels: string[] = [];
revenueByTypeValues: number[] = [];

loadPaymentDashboard() {
  this.clientService.getPaymentDashboard(this.gymId).subscribe({
    next: (res) => {
      this.paymentDashboard = res;

      // 🔹 Split Monthly Revenue
      this.monthlyRevenueLabels = res.monthlyRevenue.map((m: any) => {
        
        this.todayRevenue= res.todayPayments
        this.totalRevenue= res.totalRevenue
        const year = m._id.year;
        const month = new Date(year, m._id.month - 1).toLocaleString('default', { month: 'short' });
        return `${month} ${year}`;
      });
      this.monthlyRevenueValues = res.monthlyRevenue.map((m: any) => m.total);

      // 🔹 Split Revenue by Type
      this.revenueByTypeLabels = res.revenueByType.map((r: any) => r._id);
      this.revenueByTypeValues = res.revenueByType.map((r: any) => r.total);

      // Now set charts
      this.SetCharts();
    },
    error: (err) => console.error('Error fetching Payment Dashboard:', err),
  });
}


 
getMonthName(month: number): string {
  return new Date(2025, month - 1).toLocaleString('default', { month: 'short' });
}

  SetCharts() {
  this.charts = [
    // 1️⃣ Dynamic Bar chart - Monthly Revenue
    {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      series: [
        {
          name: 'Revenue',
          data: this.monthlyRevenueValues, // ✅ clean values
        },
      ],
      xaxis: {
        categories: this.monthlyRevenueLabels, // ✅ clean labels
      },
      yaxis: {
        title: {
          text: 'Revenue',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `₹${val}`,
        },
      },
      colors: ['#1E88E5'],
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
    },

    // 2️⃣ Dynamic Pie chart - Revenue by Type
    {
      chart: {
        height: 350,
        type: 'pie',
      },
      series: this.revenueByTypeValues,  // ✅ clean totals
      labels: this.revenueByTypeLabels,  // ✅ clean labels
      colors: ['#4CAF50', '#FF9800', '#2196F3','#f32c21ff'],
      legend: {
        position: 'bottom',
      },
      tooltip: {
        y: {
          formatter: (val: number) => `₹${val}`,
        },
      },
    },
  ];


  this.initCharts()
}




  ngAfterViewInit() {

  }


  ngOnDestroy() {
    this.chart1?.destroy();
    this.chart2?.destroy();

    this.notifySubscription.unsubscribe();
  }

  initCharts() {
    this.chart1 = new ApexCharts(document.querySelector('#chart1'), this.charts[0]);
    this.chart1?.render();
    this.chart2 = new ApexCharts(document.querySelector('#chart2'), this.charts[1]);
    this.chart2?.render();

    this.updateCharts(this.settings.options);
  }

  updateCharts(opts: Partial<AppSettings>) {
    this.chart1?.updateOptions({
      chart: {
        foreColor: opts.theme === 'dark' ? '#ccc' : '#333',
      },
      tooltip: {
        theme: opts.theme === 'dark' ? 'dark' : 'light',
      },
      grid: {
        borderColor: opts.theme === 'dark' ? '#5a5a5a' : '#e9e9e9',
      },
    });

    this.chart2?.updateOptions({
      chart: {
        foreColor: opts.theme === 'dark' ? '#ccc' : '#333',
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: opts.theme === 'dark' ? '#5a5a5a' : '#e9e9e9',
            connectorColors: opts.theme === 'dark' ? '#5a5a5a' : '#e9e9e9',
            fill: {
              colors: opts.theme === 'dark' ? ['#2c2c2c', '#222'] : ['#f8f8f8', '#fff'],
            },
          },
        },
      },
      tooltip: {
        theme: opts.theme === 'dark' ? 'dark' : 'light',
      },
    });
  }
}
