# DevCamper API

> Backend API for DevCamper application, which is a bootcamp directory website

## Usage

Open the "index.html" file in the public folder via live server- by doing so you can have a preview of all the routes used in this application and use as such. eg: api/v1/bootcamps, api/v1/users

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode

npm run dev

# Run in prod mode

npm start
```

#### Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

##### Destroy all data

node seeder -d

##### Import all data

node seeder -i

- Version: 1.0.0
- License: MIT
