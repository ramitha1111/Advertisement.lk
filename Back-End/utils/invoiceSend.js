const { Resend } = require('resend');
const Order = require('../models/order'); // Import the Order model

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const generateInvoiceWithParams = async (orderId) => {
    try {
        // Fetch the order based on the orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return { message: 'Order not found' };
        }

        // Format the order date nicely
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Enhanced HTML email content with better styling
        const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice - Order ${orderId}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #007bff; padding-bottom: 20px;">
                <h1 style="color: #007bff; margin: 0; font-size: 28px;">DigiteX</h1>
                <h2 style="color: #333; margin: 10px 0;">INVOICE</h2>
                <p style="margin: 5px 0; color: #666; font-size: 16px;">Order #${orderId}</p>
            </div>

            <!-- Customer Info -->
            <div style="margin-bottom: 30px;">
                <h3 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">Bill To:</h3>
                <p style="margin: 5px 0; font-size: 16px;"><strong>${order.userDetails.firstName} ${order.userDetails.lastName}</strong></p>
                <p style="margin: 5px 0; color: #666;">${order.userDetails.email}</p>
                <p style="margin: 5px 0; color: #666;">${order.userDetails.addressLine1}</p>
                <p style="margin: 5px 0; color: #666;">${order.userDetails.city}, ${order.userDetails.state} ${order.userDetails.zip}</p>
            </div>

            <!-- Invoice Details Table -->
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background-color: #007bff; color: white;">
                        <th style="border: none; padding: 15px 12px; text-align: left; font-weight: bold;">Description</th>
                        <th style="border: none; padding: 15px 12px; text-align: right; font-weight: bold;">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background-color: #f8f9fa;">
                        <td style="border: 1px solid #dee2e6; padding: 12px; font-weight: 500;">Package</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${order.packageName}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px; font-weight: 500;">Order Date</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${orderDate}</td>
                    </tr>
                    <tr style="background-color: #f8f9fa;">
                        <td style="border: 1px solid #dee2e6; padding: 12px; font-weight: 500;">Payment Method</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">${order.paymentMethod}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px; font-weight: 500;">Payment Status</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px; text-align: right;">
                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; ${order.paymentStatus === 'paid' ? 'background-color: #d4edda; color: #155724;' : 'background-color: #f8d7da; color: #721c24;'}">${order.paymentStatus.toUpperCase()}</span>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr style="background-color: #e9ecef; font-weight: bold; font-size: 18px;">
                        <td style="border: 2px solid #007bff; padding: 15px 12px;">Total Amount</td>
                        <td style="border: 2px solid #007bff; padding: 15px 12px; text-align: right; color: #007bff;">$${parseFloat(order.amount).toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #666; margin: 10px 0;">Thank you for your purchase!</p>
                <p style="color: #999; font-size: 14px; margin: 5px 0;">If you have any questions about this invoice, please contact our support team.</p>
                <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 0; color: #666; font-size: 14px;">
                        <strong>Need Help?</strong> Contact us at support@digitex.com
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Plain text version for email clients that don't support HTML
        const textContent = `
INVOICE - Order #${orderId}

Bill To:
${order.userDetails.firstName} ${order.userDetails.lastName}
${order.userDetails.email}
${order.userDetails.addressLine1}
${order.userDetails.city}, ${order.userDetails.state} ${order.userDetails.zip}

Order Details:
- Package: ${order.packageName}
- Amount: $${parseFloat(order.amount).toFixed(2)}
- Payment Status: ${order.paymentStatus}
- Payment Method: ${order.paymentMethod}
- Order Date: ${orderDate}

Thank you for your purchase!

If you have any questions, please contact our support team.
        `;

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: order.userDetails.email,
            subject: `Invoice for Order #${orderId} - $${parseFloat(order.amount).toFixed(2)}`,
            html: emailContent,
            text: textContent,
        });

        if (error) {
            console.error('Resend error:', error);
            return { message: 'Error sending invoice email', error: error.message };
        }

        console.log(`Invoice sent successfully to ${order.userDetails.email}`, data);
        return {
            message: 'Invoice sent successfully to the customer!',
            emailId: data.id,
            sentTo: order.userDetails.email
        };

    } catch (err) {
        console.error('Invoice Generation Error:', err);
        return { message: 'Error generating invoice', error: err.message };
    }
};

module.exports = { generateInvoiceWithParams };