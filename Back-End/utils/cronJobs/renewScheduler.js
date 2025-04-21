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
        const expiringSoonAds = await Advertisement.find({
            isBoosted: true,
            boostedUntil: { $gte: tomorrowStart, $lte: tomorrowEnd },
        });

        for (const ad of expiringSoonAds) {
            const order = await Order.findOne({ advertisementId: ad._id });
            if (!order || !order.userDetails?.email) continue;

            const { firstName, lastName, email } = order.userDetails;
            const userName = `${firstName} ${lastName}`;
            const expireDate = dayjs(ad.boostedUntil).format('YYYY-MM-DD');

            const subject = 'Your advertisement is about to expire';
            const body = `
                <p>Hello ${userName},</p>
                <p>Your boosted advertisement titled <strong>${ad.title || 'your ad'}</strong> will expire on <strong>${expireDate}</strong>.</p>
                <p>Please renew your package to continue boosting it.</p>
                <p>Thanks for using DigiteX!</p>
            `;

            await sendEmail(email, subject, body);
            console.log(`Sent renewal reminder to ${email}`);
        }

        /** -------------------- 2. Expired Ads (Auto Deactivate) -------------------- **/
        const expiredAds = await Advertisement.find({
            isBoosted: true,
            boostedUntil: { $lt: now },
        });

        for (const ad of expiredAds) {
            // Update ad
            ad.isBoosted = '0';
            ad.isVisible = '0';
            ad.boostedUntil = null;
            await ad.save();

            // Send expiration email
            const order = await Order.findOne({ advertisementId: ad._id });
            if (!order || !order.userDetails?.email) continue;

            const { firstName, lastName, email } = order.userDetails;
            const userName = `${firstName} ${lastName}`;

            const subject = 'Your boosted advertisement has expired';
            const body = `
                <p>Hello ${userName},</p>
                <p>Your boosted advertisement titled <strong>${ad.title || 'your ad'}</strong> has now expired.</p>
                <p>If you want to boost it again, please visit your dashboard and renew the package.</p>
                <p>Thank you for choosing DigiteX!</p>
            `;

            await sendEmail(email, subject, body);
            console.log(`Sent expiration email to ${email}`);
        }

        console.log('Boost check completed');
    } catch (err) {
        console.error('Error in boost check cron:', err);
    }
});
