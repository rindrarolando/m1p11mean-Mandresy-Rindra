const Appointment = require('../models/appointment')

exports.calculateMonthlyRevenue = async (selectedYear) => {
    const monthlyRevenues = []

    for (let month = 1; month <= 12; month++) {
        const startOfMonth = new Date(Date.UTC(selectedYear, month - 1, 1))
        const endOfMonth = new Date(Date.UTC(selectedYear, month, 0, 23, 59, 59, 999))

        const monthlyAppointments = await Appointment.find({
            startDateTime: { $gte: startOfMonth, $lte: endOfMonth }
        })

        const monthlyRevenue = monthlyAppointments.reduce((total, appointment) => {
            return total + appointment.price
        }, 0)

        monthlyRevenues.push({ month, revenue: monthlyRevenue })
    }

    return monthlyRevenues
}

exports.calculateDailyRevenue = async (selectedYear, selectedMonth) => {
    const dailyRevenues = [];

    // Get the last day of the selected month
    const lastDayOfMonth = new Date(Date.UTC(selectedYear, selectedMonth, 0, 23, 59, 59, 999))

    for (let day = 1; day <= lastDayOfMonth.getUTCDate(); day++) {
        const startOfDay = new Date(Date.UTC(selectedYear, selectedMonth - 1, day))
        const endOfDay = new Date(Date.UTC(selectedYear, selectedMonth - 1, day, 23, 59, 59, 999))

        const dailyAppointments = await Appointment.find({
            startDateTime: { $gte: startOfDay, $lte: endOfDay }
        });

        const dailyRevenue = dailyAppointments.reduce((total, appointment) => {
            return total + appointment.price
        }, 0);

        dailyRevenues.push({ day, revenue: dailyRevenue })
    }

    return dailyRevenues
}