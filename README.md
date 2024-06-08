# Life Planner APP

## How to run
### 1. install node.js
### 2. install yarn
### 3. install postgres and create database
### 4. add ".env" file in ./server folder and fill in the data
CONNECTION_STRING="postgresql://postgres:postgres@localhost:5432/NAMEOFDB"  
JWT_SECRET="ANYTHING YOU WANT"  
GOOGLE_CLIENT_ID="have to create your google id and secret by signing in to google as developer and adding apps"  
GOOGLE_CLIENT_SECRET="smth"  
PRODUCTION=false  
ADMIN_EMAIL="yourmail or anything else"
### 5. run "yarn dev" in the main folder of app
i think you can run this without google_client_id and secret, but then google login won't work
