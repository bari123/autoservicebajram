import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  print(printContent: string) {
    const printWindow = window.open('', '', 'height=400,width=800');
    printWindow?.document.write(`
      <html>
      <head>
        <title>Print</title>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  }
}
