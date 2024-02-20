export const environment = {
  production: false,
  application:
  {
    name: 'salon-beaute',
    angular: 'Angular 17.0.8 Dev',
    bootstrap: 'Bootstrap 5.3.2',
    fontawesome: 'Font Awesome 6.5.1',
  },
  apiUrl: "http://localhost:3000/api/v1/",
  urlNews: './assets/params/json/mock/trailers.json',
  urlMovies: './assets/params/json/mock/movies.json',

  /* urlNews: 'http://localhost:5004/trailers', */
  // url: 'https://api.ganatan.com/tutorials',

  config: {
    /* SELECT ONE OF THOSE CONFIGURATIONS */

    /* LOCAL JSON (NO CRUD) */
    api: false,
    url: './assets/params/json/crud/',

    /* LOCAL REST API CRUD WITH POSTGRESQL */
    /* api: true,
    url: 'http://localhost:5004/', */
  },
};
