const { ROLE } = require('./roles')

function canMarkAppointmentAsDone(user){
    return ( 
        user.role === ROLE.ADMIN ||
        user.role === ROLE.EMPLOYEE  
    )
}

function canViewAppointmentHistory(user) {
    return (
        user.role === ROLE.USER ||
        user.role === ROLE.EMPLOYEE
    )
}

function canAddAppointment(user){
    return (
        user.role === ROLE.USER
    )
}

function canAddEmployee(user){
    return (
        user.role === ROLE.ADMIN
    )
}

function canAddService(user){
    return (
        user.role === ROLE.ADMIN
    )
}

function canViewAppointment(user, appointment){
    return (
        user.role === ROLE.ADMIN ||
        user.role === ROLE.EMPLOYEE ||
        appointment.createdBy == user.id
    )
}

function canDeleteAppointment(user, appointment){
    return ( appointment.createdBy == user.id  )
}

function scopedAppointments(user, appointments){
    if(user.role === ROLE.ADMIN || user.role === ROLE.EMPLOYEE) return appointments
    
    return appointments.filter(appointment => appointment.createdBy == user.id)
}

module.exports = {
    canAddService,
    canViewAppointment,
    canAddAppointment,
    canDeleteAppointment,
    scopedAppointments,
    canAddEmployee,
    canViewAppointmentHistory,
    canMarkAppointmentAsDone
}