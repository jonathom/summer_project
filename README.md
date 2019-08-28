# summer project geosoftware 1
This is our solution for the final project in geosoftware 1, in summer semester 2019.
It is based on a forked solution of Aufgabe 7.
## weblinks
the code of this project can be found on github: [https://github.com/jonathom/summer_project](https://github.com/jonathom/summer_project)
and the docker container can be found here: [https://cloud.docker.com/u/jonathom/repository/docker/jonathom/summerproject](https://cloud.docker.com/u/jonathom/repository/docker/jonathom/summerproject)
## openweathermap api key
please got to [https://home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up) to get your openweathermap API key it needs to be inserted into meeting.js, line 3.
## movebank account
you will be asked to enter movebank credentials, so a movebank.org account is necessary.
## how to set things up
To start the application via npm navigate to the app´s folder, open your commandprompt and enter
`npm install`
`npm start`
The application will then be found in your browser at http://localhost:3000
To start the application via docker navigate to the app´s folder, open your commandprompt and enter
`docker-compose up`
The application will then be found in your browser at http://192.168.99.100:3000/
## tests
can be run by typing `npm test`
