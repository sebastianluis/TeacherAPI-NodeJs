# TeacherAPI-NodeJs

Instructions

# Step 1

Pull the code into your local computer.
Navigate to your folder and run the docker-compose.yml file first to spin up the mysql instance if you have docker installed in your machine.

Docker compose up 

If no Docker installed specify the local MySQL database credentials in the src/db/index.js file.
Once MySQL is up and running continue step 2

# Step2
Navigate to the folder and run the following command in the terminal 

npm install 

This will install all the dependacies. 


# Step3
Run the following command to run the server

npm start

Now your server will be running in http://localhost:4001 

# Step 4

You can now test the api's using postman or similar tools.

To run unit test run the following command

npm run test
