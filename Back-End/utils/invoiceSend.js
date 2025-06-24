const { Resend } = require('resend');
const Order = require('../models/order');

const resend = new Resend(process.env.RESEND_API_KEY);

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
                <td style="border: 1px solid #ddd; padding: 8px;">Payment Method</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.paymentMethod}</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">Order Date</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.createdAt}</td>
            </tr>
        </table>
        <p>Thank you for your purchase! Please find your invoice details above.</p>
        `;

        // Send email with the invoice details formatted in HTML content
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
            to: order.userDetails.email,
            subject: `Invoice for Order ${orderId}`,
            html: emailContent, // Use HTML content here
        });

        return { message: 'Invoice sent successfully to the customer!' };
    } catch (err) {
        console.error('Invoice Generation Error:', err);
        return { message: 'Error generating invoice', error: err.message };
    }
};

module.exports = { generateInvoiceWithParams };