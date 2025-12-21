// lib/mail-service.ts
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// 1. Configure the Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2. Helper to generate PDF Buffer
function generateInvoicePDF(invoice: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // --- PDF CONTENT ---
      const storeName = invoice.store?.name || "Hisaab Store";
      // Header
      doc.fontSize(20).text("INVOICE", { align: "center" });
      doc.fontSize(15).text(storeName, { align: "center" });
      doc.moveDown();

      // Store/Customer Info
      doc.fontSize(12).text(`Invoice ID: ${invoice.id}`);
      doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
      doc.text(`Customer: ${invoice.customer.name || "Valued Customer"}`);
      doc.moveDown();

      // Table Header
      const tableTop = 150;
      doc.font("Helvetica-Bold");
      doc.text("Item", 50, tableTop);
      doc.text("Qty", 250, tableTop);
      doc.text("Price", 350, tableTop);
      doc.text("Total", 450, tableTop);
      doc.moveDown();

      // Table Rows
      let yPosition = tableTop + 25;
      doc.font("Helvetica");

      invoice.items.forEach((item: any) => {
        const productName = item.product?.name || "Product";
        const total = item.quantity * item.unitPrice;

        doc.text(productName, 50, yPosition);
        doc.text(item.quantity.toString(), 250, yPosition);
        doc.text(`₹${item.unitPrice}`, 350, yPosition);
        doc.text(`₹${total}`, 450, yPosition);

        yPosition += 25;
      });

      // Total
      doc.moveDown();
      doc.font("Helvetica-Bold").text(`Total Amount: ₹${invoice.totalAmount}`, 400, yPosition + 20);

      // Footer
      doc.fontSize(10).text("Thank you for shopping with us!", 50, 700, { align: "center" });
      doc.fontSize(10).text("Powered by Hisaab Technologies", 50, 725, { align: "center" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// 3. Main function to send email
export async function sendInvoiceEmail(toEmail: string, invoice: any) {
  try {
    const pdfBuffer = await generateInvoicePDF(invoice);
    const storeNameForEmail = invoice.store?.name || "Hisaab Store";

    const mailOptions = {
      from: `"${storeNameForEmail}" <${process.env.SMTP_USER}>`, // Update with your app name
      to: toEmail,
      subject: `Your Invoice #${invoice.id.slice(-6).toUpperCase()}`,
      html: `
        <h1>Thank you for your purchase!</h1>
        <p>Please find your invoice attached below.</p>
        <p><strong>Total Paid:</strong> ₹${invoice.totalAmount}</p>
      `,
      attachments: [
        {
          filename: `invoice-${invoice.id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}