// document.ENV will rewrite process.env configs

document.ENV = document.ENV || Object.freeze({
  /* ... */
  VITE_ENVIRONMENT: 'development',
  VITE_API_URL: 'http://localhost:1337',
})
