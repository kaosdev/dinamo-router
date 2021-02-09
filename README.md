# dinamo-router

This is an example project for a client routing system written in typescript.

It support dynamic base urls, and typed parameters.

[Read an explanation](https://www.elialotti.com/en/blog/building-an-angular-like-router-but-better)

## Example
```typescript
// define a dynamic base url
const routing = new Routing(route`${"lang"}`);

// Define a route and get typed parameters
routing.on(route`page/${"id"}`, (params, base) => {
  outlet.innerHTML = `
    <h1>Page ${params.id}</h1>
    <h2>Language: ${base.lang}</h2>
  `;
});

// Start the routing
routing.mount();
```

## Start the project
```
npm install
npm start
```
Go to http://localhost:8080/it/ 
or http://localhost:8080/en/
