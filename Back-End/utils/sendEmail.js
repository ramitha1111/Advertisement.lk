const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: `DigiteX <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: Array.isArray(to) ? to : [to], // Support multiple recipients
            subject,
            html,
            // Auto-generate plain text version from HTML
            text: html
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
                .replace(/&amp;/g, '&') // Replace &amp; with &
                .replace(/&lt;/g, '<') // Replace &lt; with <
                .replace(/&gt;/g, '>') // Replace &gt; with >
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .trim()
        });

        if (error) {
            console.error('Resend error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        console.log(`Email sent successfully to ${Array.isArray(to) ? to.join(', ') : to}`, data);
        return data;

    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;