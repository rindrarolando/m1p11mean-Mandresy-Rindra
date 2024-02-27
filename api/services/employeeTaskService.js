const { EmployeeTask } = require('../models/employeeTask.js')

const getEmployeeDailyTasks = async (employeeId, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const tasks = await EmployeeTask.find({
            employeeId: employeeId,
            startDateTime: { $gte: startOfDay, $lte: endOfDay }
        });

        const totalCommission = tasks.reduce((sum, task) => sum + task.commissionAmount, 0);

        return {
            tasks,
            totalCommission
        };
    } catch (error) {
        console.error('Une erreur est survenue lors durant la récuperation des données:', error);
        throw error;
    }
}

const addTask = async (mapServiceEmployees) => {
    const employeeId = mapServiceEmployees.employee._id
    const service = mapServiceEmployees.service
    // commission amount = service amount * service commission
    const commissionAmount = service.price * (service.commission/100)
    const startDateTime = mapServiceEmployees.startDateTime
    // end date time = start date time plus duration minute
    const endDateTime = new Date(startDateTime.getTime() + service.duration * 60000)

    return await new EmployeeTask({employeeId, service, commissionAmount, startDateTime, endDateTime}).save()
}

module.exports = {
    addTask,
    getEmployeeDailyTasks
}