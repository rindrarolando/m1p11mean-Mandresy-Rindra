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
