import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrl: './invoice-report.component.scss'
})
export class InvoiceReportComponent {


  paymentData: any;
 constructor(
    private dialogRef: MatDialogRef<InvoiceReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {

    console.log(data,'data');
    
    this.paymentData=this.data
  }

  ngOnInit(): void {
  }

  

  printInvoice() {
  const content = document.getElementById('Invoice-cont')?.innerHTML;
  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow && content) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            /* Optional: Add styles for printing */
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .invoice-container {
  max-width: 800px;
  margin: auto;
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.header img {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
}

.gym-details {
  text-align: right;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.section {
  margin-bottom: 20px;
}

.section h2 {
  font-size: 18px;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  color: #555;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.total {
  text-align: right;
  font-size: 18px;
  font-weight: bold;
}

.footer {
  margin-top: 30px;
  text-align: center;
  font-size: 12px;
  color: #777;
}

          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}


  sendMail() {
   
  }
}
