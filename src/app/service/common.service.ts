import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApisConfig } from 'app/Apis/apis.config';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import jsPDF from 'jspdf';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
 constructor(private http: HttpClient,private apiConfig:ApisConfig,private dialog :MatDialog) {}

  private apiKey = 'GYM_SOFT_43'; // or load from environment

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey
    });
  }


getIndianCitiesList(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_INDIAN_CITIES_LIST}`,
      { headers: this.getHeaders() }
    );
  }

  getIndianStatesDistList(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_INDIAN_STATES_DIST_LIST}`,
      { headers: this.getHeaders() }
    );
  }

    Sendmail(data:any): Observable<any> {
       return this.http.post(
         `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.SEND_MAIL_COMMON}`,data,
         { headers: this.getHeaders() }
       );
     }










  async generateInvoicePDF(invoiceData: any) {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = 20;

    // ===== HEADER =====
    if (invoiceData?.gymId?.logo) {
    const img = await this.loadImage(invoiceData?.gymId?.logo);
    doc.addImage(img, 'PNG', 15, 10, 25, 25); // logo left
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(invoiceData?.gymId?.name || 'Organization Name', 45, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const addressLine = `${invoiceData?.gymId?.line1 || ''}, ${invoiceData?.gymId?.city || ''}, ${invoiceData?.gymId?.state || ''}, ${invoiceData?.gymId?.country || ''} - ${invoiceData?.gymId?.zip || ''}`;
  doc.text(addressLine, 45, 25);
  doc.text(`Phone: ${invoiceData?.gymId?.phone || ''}`, 45, 30);
  doc.text(`Email: ${invoiceData?.gymId?.ownerEmail || ''}`, 45, 35);

  y = 45;

    // ===== INVOICE SECTION =====
    this.sectionTitle(doc, 'Invoice', y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Invoice ID: ${ invoiceData?._id  || ''}`, 15, y);
    doc.text(`Date: ${invoiceData.date || ''}`, 140, y);
    y += 7;
    doc.text(`Payment Status: ${invoiceData.paymentStatus || ''}`, 15, y);
    doc.text(`Payment Type: ${invoiceData.paymentType || ''}`, 140, y);
    y += 7;
    doc.text(`Transaction ID: ${invoiceData.transactionId || ''}`, 15, y);
    doc.text(`Notes: ${invoiceData.notes || ''}`, 140, y);
    y += 15;

    // ===== MEMBER DETAILS =====
    this.sectionTitle(doc, 'Member Details', y);
    y += 10;
    doc.text(`Name: ${invoiceData.playerId?.name  || ''}`, 15, y);
    doc.text(`Phone: ${invoiceData.playerId?.phone || ''}`, 140, y);
    y += 10;
    doc.text(`Email: ${invoiceData.playerId?.email || ''}`, 15, y);
    doc.text(`Age: ${invoiceData.playerId?.age || ''}`, 140, y);
    y += 10;

    const memberAddress = `${invoiceData?.playerId?.line1 || ''}, ${invoiceData?.playerId?.city || ''}, ${invoiceData?.playerId?.state || ''}, ${invoiceData?.playerId?.country || ''} - ${invoiceData?.playerId?.zip || ''}`;

    const addressText = doc.splitTextToSize(`Address: ${memberAddress}`, 180); // 180mm width
    doc.text(addressText, 15, y);

    y += 10;

    // ===== PAYMENT SUMMARY =====
    this.sectionTitle(doc, 'Payment Summary', y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.text('Payment For', 20, y);
    doc.text('Membership', 50, y);
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.text(`Membership Total Amount`, 20, y);
    doc.text(`₹${invoiceData.membershipId?.totalAmount || '0'}`, 160, y, { align: 'right' });
    y += 7;

    doc.text(`Membership Paid Amount`, 20, y);
    doc.text(`₹${invoiceData.membershipId?.paidAmount || '0'}`, 160, y, { align: 'right' });
    y += 7;

    doc.text(`Pay Amount`, 20, y);
    doc.text(`₹${invoiceData.amount || '0'}`, 160, y, { align: 'right' });
    y += 7;

    doc.text(`Balance`, 20, y);
    doc.text(`₹${invoiceData.membershipId?.balance || '0'}`, 160, y, { align: 'right' });
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Pay Amount: ₹${invoiceData.amount || '0'}`, 160, y, { align: 'right' });

    y += 15;

    // ===== FOOTER =====
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Thank you for your payment!', 105, y, { align: 'center' });
    y += 5;
    doc.text('Stay Fit, Stay Healthy 💪', 105, y, { align: 'center' });

    // ===== RETURN PDF BASE64 =====
    const pdfBase64 = doc.output('datauristring');
    return pdfBase64.split(',')[1];
  }

  private sectionTitle(doc: jsPDF, title: string, y: number) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setFillColor(230, 230, 230);
    doc.rect(10, y - 5, 190, 8, 'F');
    doc.text(title, 15, y);
  }

  private loadImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => resolve(src);
      img.onerror = reject;
    });
  }




  async sendInvoiceMail(paymentData: any): Promise<void> {
    try {

      const pdfBase64 = await this.generateInvoicePDF(paymentData);

      // Format date
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');
      const fname = paymentData?.paymentFor?.toUpperCase() || 'INVOICE';
      const filename = `${fname}-INVOICE-${formattedDate}.pdf`;

      // Build Email Template
      const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>${paymentData?.paymentFor} Payment Invoice</title>
        </head>
        <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f5f5f5;">
          <table align="center" width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            
            <tr>
              <td style="background:#2c3e50; color:#ffffff; text-align:center; padding:20px;">
                <h2 style="margin:0;">🏋️ ${paymentData?.gymId?.name || ''} - ${paymentData?.paymentFor} Payment Invoice</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:20px; color:#333333;">
                <p>Dear <strong>${paymentData?.playerId?.name || ''}</strong>,</p>
                <p>Thank you for choosing <strong>${paymentData?.gymId?.name || ''}</strong>. Please find attached your ${paymentData?.paymentFor} Payment Invoice.</p>
                
                <p style="margin:15px 0;">
                  <strong>Invoice Date:</strong> ${formattedDate} <br/>
                  <strong>Invoice Number:</strong> ${paymentData?._id}
                </p>

                <p>
                  If you have any questions about this invoice, feel free to reach out to us at 
                  <a href="mailto:${paymentData?.gymId?.ownerEmail}" style="color:#2980b9;">${paymentData?.gymId?.ownerEmail}</a>.
                </p>

                <p style="margin-top:20px;">
                  Best regards, <br/> <strong>${paymentData?.gymId?.name} Team</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#ecf0f1; text-align:center; padding:15px; font-size:12px; color:#555;">
                © ${new Date().getFullYear()} ${paymentData?.gymId?.name}. All rights reserved.
              </td>
            </tr>
          </table>
        </body>
      </html>
      `;

      // Prepare email payload
      const payload = {
        sub: `${fname}-INVOICE-${formattedDate}`,
        mail: [paymentData?.playerId?.email],
        cc: [],
        attach: [
          {
            filename,
            filestring: `data:application/pdf;base64,${pdfBase64}`
          }
        ],
        html: htmlTemplate
      };

      // Send email
      this.Sendmail(payload).subscribe({
        next: (res) => {
          this.dialog.open(SaveDailogComponent, {
            width: '400px',
            data: { message: 'Invoice sent successfully!' }
          });
          console.log('Invoice sent successfully:', res);
        },
        error: (err) => {
          this.dialog.open(ErrorDailogComponent, {
            width: '400px',
            data: { message: 'Error sending invoice', err }
          });
          console.error('Error sending invoice:', err);
        }
      });
    } catch (err) {
      this.dialog.open(ErrorDailogComponent, {
        width: '400px',
        data: { message: 'Error generating or sending invoice', err }
      });
      console.error('Error generating or sending invoice:', err);
    }
  }

}
