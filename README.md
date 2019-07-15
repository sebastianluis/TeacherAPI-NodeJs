# TeacherAPI-NodeJs

Instructions.
# Prerequisites
1. Node version 8 or above 
2. Docker and Docker Compose ( If Mysql instance to be running in docker)
3. Postman or similar tools ( To test API endpoints)

# Step 1

Pull the code into your local computer.
Navigate to your folder and run the docker-compose.yml file first to spin up the mysql instance if you have docker installed in your machine.
Run the following command 

docker-compose up 

If you have no docker installed and have MySQL installed locally in your system 
then create a new database and specify the local MySQL database credentials and database name in the src/db/index.js file.

Once MySQL is up and running continue step 2

# Step 2
Navigate to the folder and run the following command in the terminal 

npm install 

This will install all the dependancies. 


# Step 3
Run the following command to run the server

npm start

Now your server will be running in http://localhost:4001 

# Step 4

You can now test the api's using postman or similar tools.
Postman collections are also included.

To run unit test run the following command

npm run test

If mocha command fails, please install mocha globally using the following command

npm install -g mocha 

