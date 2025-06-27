import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// este sería un endpoint del microservicio de actividades
const ACTIVITY_API = process.env.ACTIVITY_API_URL || 'http://localhost:3004/schedule/activities/upcoming';

export const startReminderJob = () => {
  cron.schedule('* * * * *', async () => { // cada minuto
    console.log('⏰ Ejecutando job de recordatorios...');

    try {
      const { data: activities } = await axios.get(`${ACTIVITY_API}?minutesBefore=60`);

      for (const activity of activities) {
        const participants = [...activity.assistants, activity.exhibitorId];

        for (const userId of participants) {
          await axios.post('http://localhost:3004/notification/notifications', {
            title: 'Recordatorio de actividad',
            message: `Tenés la actividad "${activity.title}" a las ${new Date(activity.startTime).toLocaleTimeString()}`,
            recipientUserId: userId,
            type: 'reminder',
            relatedActivityId: activity._id
          });
        }
      }

    } catch (err) {
      console.error('❌ Error en job de recordatorios:', err.message);
    }
  });
};
