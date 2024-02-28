const { EmployeeTask } = require('../models/employeeTask.js')
const employeeService = require('../services/employeeService.js')

const calculateDailyAverageTaskTime = async () => {
  try {
    // Group tasks by employee
    const tasksByEmployee = await EmployeeTask.aggregate([
      {
        $group: {
          _id: '$employeeId',
          tasks: { $push: '$$ROOT' },
        },
      },
    ])

    // Calculate daily task time for each employee
    const dailyAverageTaskTime = await Promise.all(
      tasksByEmployee.map(async (employeeTasks) => {
        const employeeId = employeeTasks._id
        const tasks = employeeTasks.tasks

        let totalTaskTime = 0

        tasks.forEach((task) => {
          const startDateTime = new Date(task.startDateTime)
          const endDateTime = new Date(task.endDateTime)

          // Calculate duration in milliseconds
          const duration = endDateTime - startDateTime

          // Convert duration to hours
          const durationInHours = duration / (1000 * 60 * 60)

          totalTaskTime += durationInHours
        })

        // Calculate average daily task time
        const averageTaskTime = totalTaskTime / tasks.length

        const employee = await employeeService.getOneEmployee(employeeId)
        return { employee, averageTaskTime }
      })
    )

    return dailyAverageTaskTime
  } catch (error) {
    console.error('Error calculating daily average task time:', error)
    throw error
  }
}


const getEmployeeDailyTasks = async (employeeId, date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    try {
        const tasks = await EmployeeTask.find({
            employeeId: employeeId,
            startDateTime: { $gte: startOfDay, $lte: endOfDay }
        })

        const totalCommission = tasks.reduce((sum, task) => sum + task.commissionAmount, 0)

        return {
            tasks,
            totalCommission
        }
    } catch (error) {
        console.error('Une erreur est survenue lors durant la récuperation des données:', error)
        throw error
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
    getEmployeeDailyTasks,
    calculateDailyAverageTaskTime
}