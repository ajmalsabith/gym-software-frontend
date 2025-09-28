import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { CommonService } from 'app/service/common.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrl: './invoice-report.component.scss'
})
export class InvoiceReportComponent {


  paymentData: any;
 constructor(
    private dialogRef: MatDialogRef<InvoiceReportComponent>,private commonservice:CommonService,private dialog:MatDialog,
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








 @ViewChild('invoiceCont', { static: false }) invoiceElement!: ElementRef;

    
async sendMail() {
    const element = this.invoiceElement.nativeElement;
    const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');

  const htmltemp = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>${this.paymentData?.paymentFor} Payment Invoice</title>
    </head>
    <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f5f5;">
      <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:#2c3e50; color:#ffffff; text-align:center; padding:20px;">
            <h2 style="margin:0;">🏋️ ${this.paymentData?.gymId?.name} - ${this.paymentData?.paymentFor} Payment Invoice</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:20px; color:#333333;">
            <p>Dear <strong>${this.paymentData?.playerId?.name}</strong>,</p>
            <p>Thank you for choosing <strong>${this.paymentData?.gymId?.name}</strong>. Please find attached your ${this.paymentData?.paymentFor} Payment Invoice.</p>
            <p style="margin:15px 0;">
              <strong>Invoice Date:</strong> ${formattedDate} <br/>
              <strong>Invoice Number:</strong> ${this.paymentData?._id}
            </p>
            <p>
              If you have any questions about this invoice, feel free to reach out to us at 
              <a href="mailto:${this.paymentData?.gymId?.ownerEmail}" style="color:#2980b9;">${this.paymentData?.gymId?.ownerEmail}</a>.
            </p>
            <p style="margin-top:20px;">Best regards, <br/> <strong>${this.paymentData?.gymId?.name} Team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background:#ecf0f1; text-align:center; padding:15px; font-size:12px; color:#555;">
            © ${new Date().getFullYear()} ${this.paymentData?.gymId?.name}. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;

// Capture invoice as canvas
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  // Convert to PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  // ✅ Get Base64 string of PDF
  const pdfBase64 = pdf.output('datauristring');
  const base64String = pdfBase64.split(',')[1];


    
  // Example → "28-09-2025"
const fname = this.paymentData?.paymentFor?.toUpperCase();

  // ✅ Dynamic file name
  const filename = `${fname}-INVOICE-${formattedDate}.pdf`;
    // ✅ Prepare payload
    const payload = {
      sub: `${fname}-INVOICE-${formattedDate}`,
      mail: [this.paymentData?.playerId?.email],
      cc: [],
      attach: [
        {
          filename: filename,
          filestring: `data:application/pdf;base64,${base64String}`
        }
      ],
      html:htmltemp
    };

    // ✅ Send to backend
    this.commonservice.Sendmail(payload).subscribe({
      next: (res) =>{
           const dialogRef = this.dialog.open(SaveDailogComponent, {
            width: '400px',
            data: { message:"Invoice sent successfully" }
          });
       console.log('Invoice sent successfully:', res)}    
     ,error: (err) => 
      {
          const dialogRef = this.dialog.open(ErrorDailogComponent, {
            width: '400px',
            data: { message: 'Error sending invoice:', err }
          });
        console.error('Error sending invoice:', err)

      }
    });
  }


 
}
