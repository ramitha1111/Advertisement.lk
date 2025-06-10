const cron = require('node-cron');
const dayjs = require('dayjs');
const Order = require('../../models/Order');
const Advertisement = require('../../models/Advertisement');
const sendEmail = require('../sendEmail');

// Runs daily at 8 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Running daily ad boost check...');

    const now = new Date();
    const tomorrowStart = dayjs().add(1, 'day').startOf('day').toDate();
    const tomorrowEnd = dayjs().add(1, 'day').endOf('day').toDate();

    try {
        /** -------------------- 1. Expire Soon (Reminder) -------------------- **/
        console.log('Checking for ads expiring soon...');

        const expiringSoonAds = await Advertisement.find({
            isBoosted: true,
            boostedUntil: { $gte: tomorrowStart, $lte: tomorrowEnd },
        });

        console.log(`Found ${expiringSoonAds.length} ads expiring soon`);

        for (const ad of expiringSoonAds) {
            try {
                const order = await Order.findOne({ advertisementId: ad._id });
                if (!order || !order.userDetails?.email) {
                    console.log(`No order/email found for ad ${ad._id}`);
                    continue;
                }

                const { firstName, lastName, email } = order.userDetails;
                const userName = `${firstName} ${lastName}`;
                const expireDate = dayjs(ad.boostedUntil).format('MMMM D, YYYY');

                const subject = 'Your advertisement boost expires tomorrow - DigiteX';
                const body = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ff6b35; padding-bottom: 20px;">
                            <h1 style="color: #ff6b35; margin: 0; font-size: 28px;">DigiteX</h1>
                            <p style="margin: 5px 0; color: #666; font-size: 16px;">Boost Expiring Soon!</p>
                        </div>
                        
                        <h2 style="color: #333; text-align: center;">⏰ Your Ad Boost Expires Tomorrow</h2>
                        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
                        <p style="color: #666; font-size: 16px;">
                            Your boosted advertisement <strong>"${ad.title || 'Untitled Ad'}"</strong> will expire tomorrow on <strong>${expireDate}</strong>.
                        </p>
                        
                        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
                            <p style="margin: 0; color: #856404; font-size: 16px;">
                                <strong>⚠️ Don't lose your premium visibility!</strong><br>
                                Renew your boost package to continue getting maximum exposure for your advertisement.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL || 'https://digitex.com'}/dashboard" 
                               style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                Renew Boost Now
                            </a>
                        </div>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                                Thanks for using DigiteX!<br>
                                <strong>The DigiteX Team</strong>
                            </p>
                        </div>
                    </div>
                `;

                await sendEmail(email, subject, body);
                console.log(`✓ Sent renewal reminder to ${email} for ad: ${ad.title}`);

            } catch (emailError) {
                console.error(`Failed to send reminder email for ad ${ad._id}:`, emailError.message);
                // Continue with other ads even if one fails
            }
        }

        /** -------------------- 2. Expired Ads (Auto Deactivate) -------------------- **/
        console.log('Checking for expired ads...');

        const expiredAds = await Advertisement.find({
            isBoosted: '1',
            boostedUntil: { $lt: now },
        });

        console.log(`Found ${expiredAds.length} expired ads`);

        const expiredAdIds = expiredAds.map(ad => ad._id);

        // Bulk update expired ads for better performance
        if (expiredAdIds.length > 0) {
            const updateResult = await Advertisement.updateMany(
                { _id: { $in: expiredAdIds } },
                {
                    isBoosted: '0', // Change based on your schema: false, 'false', '0', or 0
                    isVisible: '0', // Change based on your schema: false, 'false', '0', or 0
                    boostedUntil: null,
                    packageId: null
                }
            );
            console.log(`✓ Bulk updated ${updateResult.modifiedCount} expired ads`);
        }

        // Send expiration emails
        for (const ad of expiredAds) {
            try {
                const order = await Order.findOne({ advertisementId: ad._id });
                if (!order || !order.userDetails?.email) {
                    console.log(`No order/email found for expired ad ${ad._id}`);
                    continue;
                }

                const { firstName, lastName, email } = order.userDetails;
                const userName = `${firstName} ${lastName}`;
                const expiredDate = dayjs(ad.boostedUntil).format('MMMM D, YYYY');

                const subject = 'Your advertisement boost has expired - DigiteX';
                const body = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #dc3545; padding-bottom: 20px;">
                            <h1 style="color: #dc3545; margin: 0; font-size: 28px;">DigiteX</h1>
                            <p style="margin: 5px 0; color: #666; font-size: 16px;">Boost Expired</p>
                        </div>
                        
                        <h2 style="color: #333; text-align: center;">📉 Your Ad Boost Has Expired</h2>
                        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
                        <p style="color: #666; font-size: 16px;">
                            Your boosted advertisement <strong>"${ad.title || 'Untitled Ad'}"</strong> has expired as of ${expiredDate}.
                        </p>
                        
                        <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
                            <p style="margin: 0; color: #721c24; font-size: 16px;">
                                <strong>📊 Your ad is now running with standard visibility.</strong><br>
                                To boost it again and get premium placement, you can renew your package anytime.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL || 'https://digitex.com'}/dashboard" 
                               style="background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
                                Boost Again
                            </a>
                        </div>
                        
                        <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #bee5eb;">
                            <p style="margin: 0; color: #0c5460; font-size: 14px;">
                                <strong>💡 Pro Tip:</strong> Regular boosting helps maintain consistent visibility and better results for your advertisements!
                            </p>
                        </div>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #666; font-size: 14px; margin: 0;">
                                Thank you for choosing DigiteX to promote your advertisement!<br>
                                <strong>The DigiteX Team</strong>
                            </p>
                        </div>
                    </div>
                `;

                await sendEmail(email, subject, body);
                console.log(`✓ Sent expiration email to ${email} for ad: ${ad.title}`);

            } catch (emailError) {
                console.error(`Failed to send expiration email for ad ${ad._id}:`, emailError.message);
                // Continue with other ads even if one fails
            }
        }

        console.log('✅ Boost check completed successfully');

    } catch (err) {
        console.error('❌ Error in boost check cron:', err);

        // Optional: Send admin notification about cron failure
        try {
            if (process.env.ADMIN_EMAIL) {
                await sendEmail(
                    process.env.ADMIN_EMAIL,
                    'Cron Job Failed - Ad Boost Check',
                    `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #dc3545;">⚠️ Cron Job Failure Alert</h2>
                        <p>The daily ad boost check cron job failed with the following error:</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545;">
                            <pre style="color: #721c24; margin: 0; white-space: pre-wrap;">${err.message}</pre>
                        </div>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            Please check the server logs and resolve the issue.
                        </p>
                    </div>
                    `
                );
            }
        } catch (adminEmailError) {
            console.error('Failed to send admin notification:', adminEmailError.message);
        }
    }
});

// Optional: Add a startup message
console.log('📅 Ad boost check cron job scheduled to run daily at 8:00 AM');

// Optional: Manual trigger function for testing
const runBoostCheck = async () => {
    console.log('🧪 Manually triggering boost check...');
    // The cron logic would go here for manual testing
};

module.exports = { runBoostCheck };