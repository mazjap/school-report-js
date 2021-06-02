const csv = require("csv-parser")
const fs = require("fs")
const crypto = require("crypto")

const fullTimeTuition = 3000
const perCreditTuition = 250

let students = []

fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', currentStudent => {
    const studentIndex = students.findIndex((student) => student.id === currentStudent.id)

    if (studentIndex === -1) {
        students.push({
            id: currentStudent.id,
            firstName: currentStudent.firstName,
            lastName: currentStudent.lastName,
            credits: Number(currentStudent.credits) ?? 0
        })
    } else {
        students[studentIndex].credits += Number(currentStudent.credits) ?? 0
    }
  })
  .on('end', () => {
    let fullTimeTotal = 0
    let fullTimeCount = 0

    let partTimeTotal = 0
    let partTimeCount = 0

    const csvStudents = students.map((student) => {
        let tuition
        const isFullTime = student.credits >= 12

        if (isFullTime) {
            if (student.credits <= 18) {
                tuition = fullTimeTuition
            } else {
                const additionalCredits = student.credits - 18
                console.log("Additional creds: " + additionalCredits)
                tuition = fullTimeTuition + (perCreditTuition * additionalCredits)
            }

            fullTimeTotal += tuition
            fullTimeCount++
        } else {
            tuition = perCreditTuition * student.credits

            partTimeTotal += tuition
            partTimeCount++
        }

        return {
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            status: isFullTime ? "FT" : "PT",
            tuition: tuition
        }
    })

    console.log(students)

    csvStudentWriter.writeRecords(csvStudents)

    let item = {
        FullTimeCount: fullTimeCount,
        FTtuition: fullTimeTotal,
        PartTimeCount: partTimeCount,
        PTtuition: partTimeTotal,
        GrandTotal: partTimeTotal + fullTimeTotal,
    }

    console.log(item)
    csvSchoolWriter.writeRecords([item])
  })

const createCsvWriter = require('csv-writer').createObjectCsvWriter

const csvSchoolWriter = createCsvWriter({
  path: 'school-report.csv',
  header: [
    {id: 'FullTimeCount', title: 'FullTimeCount'},
    {id: 'FTtuition', title: 'FT-tuition'},
    {id: "PartTimeCount", title: 'PartTimeCount'},
    {id: "PTtuition", title: 'PT-tuition'},
    {id: "GrandTotal", title: 'GrandTotal'},
  ]
})

const csvStudentWriter = createCsvWriter({
    path: 'students.csv',
    header: [
      {id: 'id', title: 'id'},
      {id: 'firstName', title: 'firstName'},
      {id: "lastName", title: 'lastName'},
      {id: "status", title: 'status'},
      {id: "tuition", title: 'tuition'},
    ]
})