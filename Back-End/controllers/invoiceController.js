const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const Order = require('../models/Order'); // Import the Order model
const path = require('path');

// **Invoice Controller**: Generate and send invoice
const generateInvoice = async (req, res) => {
    const { orderId } = req.params;

    try {
        // Fetch the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create a PDF document for the invoice
        const doc = new PDFDocument();
        const invoicePath = path.join(__dirname, `../invoices/invoice_${orderId}.pdf`);

        doc.pipe(fs.createWriteStream(invoicePath));

        // Add invoice content
        doc.fontSize(16).text(`Invoice for Order ID: ${orderId}`, { align: 'center' });
        doc.fontSize(12).text(`User Details: ${order.userDetails.firstName} ${order.userDetails.lastName}`, { align: 'left' });
        doc.text(`Email: ${order.userDetails.email}`);
        doc.text(`Address: ${order.userDetails.addresseLine1}, ${order.userDetails.city}, ${order.userDetails.state}, ${order.userDetails.zip}`);
        doc.text(`Package: ${order.packageId}`);
        doc.text(`Amount: $${order.amount}`);
        doc.text(`Payment Status: ${order.paymentStatus}`);
        doc.text(`Order Date: ${order.createdAt}`);
        doc.end();

        // Send email with the invoice as attachment
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: order.userDetails.email,
            subject: `Invoice for Order ${orderId}`,
            text: `Thank you for your purchase! Please find your invoice attached.`,
            attachments: [
                {
                    path: invoicePath,
                },
            ],
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                res.status(500).json({ message: 'Error sending invoice email' });
            } else {
                res.status(200).json({
                    message: 'Invoice generated and sent successfully!',
                    invoicePath,
                });
            }
        });
    } catch (err) {
        console.error('Invoice Generation Error:', err);
        res.status(500).json({ message: 'Error generating invoice', error: err.message });
    }
};

module.exports = { generateInvoice };
