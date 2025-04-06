const nodemailer = require('nodemailer');
const Order = require('../models/Order'); // Import the Order model

const generateInvoice = async (req, res) => {
    const { orderId } = req.body;

    try {
        // Fetch the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // HTML email content with a table
        const emailContent = `
        <h3>Invoice for Order ${orderId}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Field</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Details</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Name</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.userDetails.firstName} ${order.userDetails.lastName}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.userDetails.email}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Address</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.userDetails.addressLine1}, ${order.userDetails.city}, ${order.userDetails.state}, ${order.userDetails.zip}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Package</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.packageName}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Amount</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${order.amount}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Payment Status</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.paymentStatus}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Order Date</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.createdAt}</td>
            </tr>
        </table>
        <p>Thank you for your purchase! Please find your invoice attached.</p>
        `;

        // Send email with the invoice as attachment and formatted HTML content
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Replace with your email
            to: order.userDetails.email,
            subject: `Invoice for Order ${orderId}`,
            html: emailContent
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

const generateInvoiceWithParams = async (orderId) => {
    try {
        // Fetch the order based on the orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return { message: 'Order not found' };
        }

        // HTML email content with a table
        const emailContent = `
        <h3>Invoice for Order ${orderId}</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Field</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Details</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Name</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.userDetails.firstName} ${order.userDetails.lastName}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Email</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.userDetails.email}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Address</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.userDetails.addressLine1}, ${order.userDetails.city}, ${order.userDetails.state}, ${order.userDetails.zip}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Package</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.packageName}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Amount</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${order.amount}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Payment Status</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.paymentStatus}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Order Date</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.createdAt}</td>
            </tr>
        </table>
        <p>Thank you for your purchase! Please find your invoice details above.</p>
        `;

        // Send email with the invoice details formatted in HTML content
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER, // Replace with your email
            to: order.userDetails.email,
            subject: `Invoice for Order ${orderId}`,
            html: emailContent, // Use HTML content here
        };

        await transporter.sendMail(mailOptions);

        return { message: 'Invoice sent successfully to the customer!' };
    } catch (err) {
        console.error('Invoice Generation Error:', err);
        return { message: 'Error generating invoice', error: err.message };
    }
};

module.exports = { generateInvoice, generateInvoiceWithParams };