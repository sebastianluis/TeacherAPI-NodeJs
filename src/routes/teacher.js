const express = require('express');
const router = express.Router();
const extractMentions = require('../utils/util');
var db = require('../db/index'); // db is pool


/* ap1/register POST */
router.post('/register', function(req, res, next) {

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
		req.body.students.forEach(student => {
			const entry = `("${req.body.teacher}", "${student}")`;
			values.push(entry);
		});
	} else {
		return res.status(400).send({
			success: "false",
			message:
			  "Please provide the payload in the body in the specified format."
		  });
	}
	query = query + values.join();
	db.query(query, function (error, results, fields) {
	  	if(error){
			  console.log(error);
			  res.status(500).send({"success": false, "message": "Some unknown error occured while registering the students!"});
	  	} else {
			//const responseMessage = `${results.affectedRows} students has successfully registered with ${req.body.teacher}`
  			res.status(204).send();
	  	}
  	});
});

/* ap1/commonstudents GET */
router.get('/commonstudents', function(req, res, next) {
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
	query =`SELECT studentId, COUNT(studentId) FROM teacher_student_map where 
	teacherId IN (${conditionArr.join()}) GROUP BY studentId HAVING COUNT(studentId) > 1;`
	}
	else {
		query = `SELECT distinct studentId FROM teacher_student_map WHERE teacherId="${teachers}"`;
	}
	db.query(query, function (error, results, fields) {
		if(error) {
			console.log(error);
			res.status(500).send({"success": false, "message": "Some unknown error occured while fetching the data"});
		} else {
			const responseBody = {};
			const studentArray = []
			results.forEach(student => {
				studentArray.push(student.studentId);
			});
			responseBody["students"] = studentArray;
			res.status(200).send(responseBody);
		}
  	});
});

/* ap1/suspend POST */
router.post('/suspend', function(req, res, next) {
	if (!req.body.student) {
		return res.status(400).send({
		  success: "false",
		  message:
			"No Payload found. Please provide the payload in the body in the specified format."
		});
	  }
	let query = `UPDATE teacher_student_map SET suspended=1 WHERE studentId="${req.body.student}"`;
	db.query(query, function (error, results, fields) {
	  	if(error){
			  console.log(error);
			  res.status(500).send({"success": false, "message": "Some unknown error occured"});
	  	} else {
  			res.status(204).send();
	  	}
  	});
});

/* ap1/retrievefornotifications POST */
router.post('/retrievefornotifications', function(req, res, next) {
	if (!req.body.teacher && !req.body.notification) {
		return res.status(400).send({
		  success: "false",
		  message:
			"No Payload found. Please provide the payload in the body in the specified format."
		});
	  }
	const mentions = extractMentions(req.body.notification);
	const query = `SELECT distinct studentId FROM teacher_student_map WHERE suspended=0 AND teacherId="${req.body.teacher}"`;
	db.query(query, function (error, results, fields) {
		if(error) {
			console.log(error);
			res.status(500).send({"success": false, "message": "Some unknown error occured while fetching the data."});
		} else {
			const responseBody = {};
			const notifyStudentsArray = [];
			const registed_studentsMap= {}
			results.forEach(student => {
				//registed_studentsMap[student.studentId] = student.studentId;
				notifyStudentsArray.push(student.studentId);
			});
			mentions.forEach(item => {
				if(!notifyStudentsArray.includes(item)) {
					notifyStudentsArray.push(item);
				}
			});
			responseBody["recipients"] = notifyStudentsArray;
			res.status(200).send(responseBody);
		}
  	});

});

module.exports = router;
