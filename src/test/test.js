var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:4001");
describe("SAMPLE unit test",function(){

  // #1 should return home 
  it("/GET HOME",function(done){
    // calling home  api
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
    });
  });
    // #2 should return 204
  it("/POST REGISTER",function(done){
    const payload ={
        "teacher": "testteacher1@gmail.com",
        "students":
          [
            "teststudent1@gmail.com",
            "teststudent2@gmail.com"
          ]
      };
    server
    .post('/api/register')
    .send(payload)
    .expect("Content-type",/json/)
    .expect(204)
    .end(function(err,res){
      res.status.should.equal(204);
      done();
    });
  });

   // #3 should return home page
   it("/GET COMMON STUDENTS",function(done){
    server
    .get("/api/commonstudents")
    .query({teacher: "testteacher1@gmail.com"})
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      res.body.should.have.property('students');
      done();
    });
  });

  it("/POST SUSPEND",function(done){
    const payload ={
        "student" : "teststudent1@gmail.com"
      }
    server
    .post('/api/suspend')
    .send(payload)
    .expect("Content-type",/json/)
    .expect(204)
    .end(function(err,res){
      res.status.should.equal(204);
      done();
    });
  });

  it("/POST RETRIEVE FOR NOTIFICATIONS",function(done){
    const payload ={
        "teacher":  "testteacher1@gmail.com",
        "notification": "Hello students! @studentagnes@gmail.com @teststudent1@gmail.com @studentjon@gmail.com"
      }
    server
    .post('/api/retrievefornotifications')
    .send(payload)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.should.have.property('recipients');
      done();
    });
  });

});