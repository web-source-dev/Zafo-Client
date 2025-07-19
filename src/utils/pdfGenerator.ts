import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export interface TicketData {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  attendeeName: string;
  attendeeEmail: string;
  ticketNumber: string;
  ticketPrice: number;
  currency: string;
  purchaseDate: string;
  qrCodeData: string;
}

const generateQRCodeDataURL = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 120,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    // Return a placeholder if QR generation fails
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
};

export const generateTicketPDF = async (ticketData: TicketData): Promise<void> => {
  // Generate QR code with simple list format
  const qrCodeData = `Name: ${ticketData.attendeeName}\nEmail: ${ticketData.attendeeEmail}\nTicket Number: ${ticketData.ticketNumber}\nAmount: ${ticketData.ticketPrice} ${ticketData.currency}\nPurchase Date: ${ticketData.purchaseDate}`;
  const qrCodeDataURL = await generateQRCodeDataURL(qrCodeData);
  
  // Create a temporary div to render the ticket
  const ticketDiv = document.createElement('div');
  ticketDiv.style.position = 'absolute';
  ticketDiv.style.left = '-9999px';
  ticketDiv.style.top = '0';
  ticketDiv.style.width = '500px';
  ticketDiv.style.backgroundColor = 'white';
  ticketDiv.style.fontFamily = 'Arial, sans-serif';
  ticketDiv.style.border = '4px solid #535e4b';
  ticketDiv.style.borderRadius = '15px';
  ticketDiv.style.boxSizing = 'border-box';
  ticketDiv.style.overflow = 'hidden';
  ticketDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
  
  ticketDiv.innerHTML = `
    <div style="padding: 30px; background-color: white; min-height: 400px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #535e4b; margin: 0; font-size: 28px; font-weight: bold;">ZAFO</h1>
        <p style="color: #666; margin: 8px 0; font-size: 16px;">Event Ticket</p>
      </div>
      
      <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0 0 12px 0; font-size: 20px;">${ticketData.eventTitle}</h2>
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
          <span>Date: ${ticketData.eventDate}</span>
          <span>Location: ${ticketData.eventLocation}</span>
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div style="flex: 1;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #333; font-size: 14px;">Attendee:</strong>
            <div style="font-size: 16px; color: #333; margin-top: 4px;">${ticketData.attendeeName}</div>
            <div style="font-size: 14px; color: #666; margin-top: 2px;">${ticketData.attendeeEmail}</div>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333; font-size: 14px;">Ticket Number:</strong>
            <div style="font-size: 16px; color: #535e4b; font-weight: bold; margin-top: 4px;">${ticketData.ticketNumber}</div>
          </div>
          <div>
            <strong style="color: #333; font-size: 14px;">Purchase Date:</strong>
            <div style="font-size: 14px; color: #666; margin-top: 4px;">${ticketData.purchaseDate}</div>
          </div>
        </div>
        <div style="text-align: center; margin-left: 25px;">
          <img src="${qrCodeDataURL}" style="width: 130px; height: 130px; border: 2px solid #ddd; border-radius: 8px;" alt="QR Code" />
          <div style="font-size: 12px; color: #666; margin-top: 8px;">Scan for details</div>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
        <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Total Amount</div>
        <div style="font-size: 24px; font-weight: bold; color: #535e4b;">${ticketData.ticketPrice} ${ticketData.currency}</div>
      </div>
      
      <div style="text-align: center; font-size: 12px; color: #999; padding: 15px; background-color: #fafafa; border-radius: 6px;">
        <p style="margin: 0 0 6px 0;">This ticket is valid for one-time use only.</p>
        <p style="margin: 0;">Please present this ticket at the event entrance.</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(ticketDiv);
  
  try {
    // Convert to canvas with higher quality settings
    const canvas = await html2canvas(ticketDiv, {
      width: 500,
      height: ticketDiv.scrollHeight,
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      removeContainer: false,
      foreignObjectRendering: false
    });
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;
    
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Download PDF
    pdf.save(`ticket-${ticketData.ticketNumber}.pdf`);
  } finally {
    // Clean up
    document.body.removeChild(ticketDiv);
  }
};

export const generateAllTicketsPDF = async (tickets: TicketData[]): Promise<void> => {
  if (tickets.length === 0) return;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  let currentPage = 0;
  
  for (let i = 0; i < tickets.length; i++) {
    const ticketData = tickets[i];
    
    // Generate QR code for this ticket with simple list format
    const qrCodeData = `Name: ${ticketData.attendeeName}\nEmail: ${ticketData.attendeeEmail}\nTicket Number: ${ticketData.ticketNumber}\nAmount: ${ticketData.ticketPrice} ${ticketData.currency}\nPurchase Date: ${ticketData.purchaseDate}`;
    const qrCodeDataURL = await generateQRCodeDataURL(qrCodeData);
    
    // Create a temporary div for each ticket
    const ticketDiv = document.createElement('div');
    ticketDiv.style.position = 'absolute';
    ticketDiv.style.left = '-9999px';
    ticketDiv.style.top = '0';
    ticketDiv.style.width = '500px';
    ticketDiv.style.backgroundColor = 'white';
    ticketDiv.style.fontFamily = 'Arial, sans-serif';
    ticketDiv.style.border = '4px solid #535e4b';
    ticketDiv.style.borderRadius = '15px';
    ticketDiv.style.boxSizing = 'border-box';
    ticketDiv.style.overflow = 'hidden';
    ticketDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    ticketDiv.innerHTML = `
      <div style="padding: 30px; background-color: white; min-height: 400px;">
        <div style="text-align: center; margin-bottom: 25px;">
          <h1 style="color: #535e4b; margin: 0; font-size: 28px; font-weight: bold;">ZAFO</h1>
          <p style="color: #666; margin: 8px 0; font-size: 16px;">Event Ticket</p>
        </div>
        
        <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
          <h2 style="color: #333; margin: 0 0 12px 0; font-size: 20px;">${ticketData.eventTitle}</h2>
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
            <span>Date: ${ticketData.eventDate}</span>
            <span>Location: ${ticketData.eventLocation}</span>
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; font-size: 14px;">Attendee:</strong>
              <div style="font-size: 16px; color: #333; margin-top: 4px;">${ticketData.attendeeName}</div>
              <div style="font-size: 14px; color: #666; margin-top: 2px;">${ticketData.attendeeEmail}</div>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: #333; font-size: 14px;">Ticket Number:</strong>
              <div style="font-size: 16px; color: #535e4b; font-weight: bold; margin-top: 4px;">${ticketData.ticketNumber}</div>
            </div>
            <div>
              <strong style="color: #333; font-size: 14px;">Purchase Date:</strong>
              <div style="font-size: 14px; color: #666; margin-top: 4px;">${ticketData.purchaseDate}</div>
            </div>
          </div>
          <div style="text-align: center; margin-left: 25px;">
            <img src="${qrCodeDataURL}" style="width: 130px; height: 130px; border: 2px solid #ddd; border-radius: 8px;" alt="QR Code" />
            <div style="font-size: 12px; color: #666; margin-top: 8px;">Scan for details</div>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e9ecef;">
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Total Amount</div>
          <div style="font-size: 24px; font-weight: bold; color: #535e4b;">${ticketData.ticketPrice} ${ticketData.currency}</div>
        </div>
        
        <div style="text-align: center; font-size: 12px; color: #999; padding: 15px; background-color: #fafafa; border-radius: 6px;">
          <p style="margin: 0 0 6px 0;">This ticket is valid for one-time use only.</p>
          <p style="margin: 0;">Please present this ticket at the event entrance.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(ticketDiv);
    
    try {
      const canvas = await html2canvas(ticketDiv, {
        width: 500,
        height: ticketDiv.scrollHeight,
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        removeContainer: false,
        foreignObjectRendering: false
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add new page if needed
      if (currentPage > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      currentPage++;
    } finally {
      document.body.removeChild(ticketDiv);
    }
  }
  
  // Download PDF
  pdf.save(`all-tickets-${new Date().toISOString().split('T')[0]}.pdf`);
}; 