import cron from 'node-cron';

// Set up a cron job to run every minute (for demonstration purposes)
cron.schedule('* 20 * * *', () => {
    console.log('Cron job running every minute');
    // Place your cron job logic here
});
export async function GET(req, res) {
    // return Response.json({  message: 'Cron job endpoint' });
    return Response.status(200).json({ message: 'Cron job endpoint' });
}