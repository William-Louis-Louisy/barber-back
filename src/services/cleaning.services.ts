import AppointmentSchema from "../models/appointment.models";
import ScheduleSchema from "../models/schedule.models";

// DELETE APPOINTMENTS OLDER THAN 30 DAYS
export async function deleteOldAppointments() {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    const result = await AppointmentSchema.deleteMany({ date: { $lt: date } });
    console.log(
      `Deleted ${result.deletedCount} appointments older than 30 days.`
    );
  } catch (error) {
    console.error("Failed to delete old appointments:", error);
  }
}

// DELETE SCHEDULES OLDER THAN 30 DAYS
export async function deleteOldSchedules() {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);

    const result = await ScheduleSchema.deleteMany({ date: { $lt: date } });
    console.log(`Deleted ${result.deletedCount} schedules older than 30 days.`);
  } catch (error) {
    console.error("Failed to delete old schedules:", error);
  }
}
