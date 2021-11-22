import { Company } from "./company.js";

const usernamelbl = document.createElement("label");
usernamelbl.innerHTML = "Username: ";
usernamelbl.className = "usernameLbl";
const username = document.createElement("input");
username.className = "usernameEdit";
document.body.appendChild(username);
document.body.appendChild(usernamelbl);
document.body.appendChild(document.createElement("br"));

const title = document.createElement("h1");
title.innerHTML = "Companies";
title.className = "mainTitle";
document.body.appendChild(title);

const divCompanies = document.createElement("div");
divCompanies.className = "divCompanies";
document.body.appendChild(divCompanies);

fetch("https://localhost:5001/Company/GetAll", {method: "GET"}).then(p => {
    if(p.ok)
    {
        p.json().then(data => {
            data.forEach(company => {
                var cmp = new Company(company.id, company.name, company.address, company.email, company.description, company.ads);
                cmp.draw(divCompanies);
            });
        });
    }
    else
    {
        alert("Company method GetAll failed!");
    }  
}).catch(p => {
    alert("Company method GetAll failed!");
});