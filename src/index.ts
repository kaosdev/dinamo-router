import { route, Routing } from "./router";

const btnHome = document.getElementById("btn-home")!!;
const btnPage1 = document.getElementById("btn-page1")!!;
const outlet = document.getElementById("outlet")!!;

const routing = new Routing(route`${"lang"}`);

routing.on(route``, ({}, base) => {
  outlet.innerHTML = `
    <h1>Home</h1>
    <h2>Language: ${base.lang}</h2>
  `;
});

routing.on(route`user/${"userId"}/project/${"projectId"}`, (params, base) => {
  outlet.innerHTML = `
    <h1>User ${params.userId}</h1>
    <h1>Project ${params.projectId}</h1>
    <h2>Language: ${base.lang}</h2>
  `;
});

routing.mount();

btnHome.addEventListener("click", () => routing.navigate("/"));
btnPage1.addEventListener("click", () => routing.navigate("/user/1/project/2"));
