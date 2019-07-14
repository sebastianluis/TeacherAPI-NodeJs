const express = require('express');
const router = express.Router();
const extractMentions = require('../utils/util');
var db = require('../db/index'); // db is pool

/* ap1/register POST */
router.post('/register', async function(req, res, next) {
	if (!req.body.teacher && !req.body.students) {
		return res.status(400).send({
		  success: "false",
		  message:
			"No Payload found. Please provide the payload in the body in the specified format."
		});
	  }
	let query = 'INSERT INTO teacher_student_map(teacherId,studentId) VALUES '
	let values = [];
	if(Array.isArray(req.body.students)) {
		try {
			const registeredStudentsMap = {};
			// fetching existing list to avoid duplicate registration
			const result = await db.query(`SELECT studentId FROM teacher_student_map WHERE teacherId="${req.body.teacher}"`);
			result.forEach(student => {
				registeredStudentsMap[student.studentId] = student.studentId;
			});
			req.body.students.forEach(student => {
				if(!registeredStudentsMap[student]) { 
				const entry = `("${req.body.teacher}", "${student}")`;
				values.push(entry);
				}
			});
			query = query + values.join();
			if(values.length > 0) { // execute query only if there is values to insert
				await db.query(query);
			}
			res.status(204).send();
		} catch(err) {
			console.log(err);
			res.status(500).send({"success": false, "message": "Some unknown error occured while registering the students!"});
		}
	} else {
		return res.status(400).send({
			success: "false",
			message:
			  "Please provide the payload in the body in the specified format."
		  });
	}
});

/* ap1/commonstudents GET */
router.get('/commonstudents', async function(req, res, next) {
	const teachers = req.query.teacher;
	if(!teachers) {
		return res.status(400).send({
			success: "false",
			message:
			  "Please provide the values in specified format"
		  });
	}
	let query = "";
	let conditionArr = [];
	if(Array.isArray(teachers)) {
		teachers.forEach(teacher => {
			const condition = `"${teacher}"`;
			conditionArr.push(condition);
		});
	const teacherCount = conditionArr.length;
	query =`SELECT studentId, COUNT(studentId) FROM teacher_student_map where 
	teacherId IN (${conditionArr.join()}) GROUP BY studentId HAVING COUNT(studentId) >= ${teacherCount}`;
	}
	else {
		query = `SELECT distinct studentId FROM teacher_student_map WHERE teacherId="${teachers}"`;
	}
	try {
			const results = await db.query(query);
			const responseBody = {};
			const studentArray = []
			results.forEach(student => {
				studentArray.push(student.studentId);
			});
			responseBody["students"] = studentArray;
			res.status(200).send(responseBody);
	} catch (error){
		console.log(error);
		res.status(500).send({"success": false, "message": "Some unknown error occured while fetching the data"});
	}
});

/* ap1/suspend POST */
router.post('/suspend', async function(req, res, next) {
	if (!req.body.student) {
		return res.status(400).send({
		  success: "false",
		  message:
			"No Payload found. Please provide the payload in the body in the specified format."
		});
	  }
	const query = `UPDATE teacher_student_map SET suspended=1 WHERE studentId="${req.body.student}"`;
	try {
		await db.query(query);
		res.status(204).send();
	} catch (error){
		console.log(error);
		res.status(500).send({"success": false, "message": "Some unknown error occured"});
	}
});

/* ap1/retrievefornotifications POST */
router.post('/retrievefornotifications', async function(req, res, next) {
	if (!req.body.teacher && !req.body.notification) {
		return res.status(400).send({
		  success: "false",
		  message:
			"No Payload found. Please provide the payload in the body in the specified format."
		});
	  }
	const mentions = extractMentions(req.body.notification);
	const query = `SELECT distinct studentId FROM teacher_student_map WHERE suspended=0 AND teacherId="${req.body.teacher}"`;

	try {
		const results = await db.query(query);
		const responseBody = {};
		const notifyStudentsArray = [];
		results.forEach(student => {
			notifyStudentsArray.push(student.studentId);
		});
		mentions.forEach(item => {
			if(!notifyStudentsArray.includes(item)) {
				notifyStudentsArray.push(item);
			}
		});
		responseBody["recipients"] = notifyStudentsArray;
		res.status(200).send(responseBody);
	} catch (error){
		console.log(error);
		res.status(500).send({"success": false, "message": "Some unknown error occured while fetching the data."});
	}
});

module.exports = router;
