import { Jobad } from "./jobad.js";

export class Company
{
    constructor(id, name, address, email, desc, ads)
    {
        this.id = id;
        this.name = name;
        this.address = address;
        this.email = email;
        this.description = desc;
        this.ads = [];
        ads.forEach(ad => {
            var dl = new Date(ad.deadline);
            var date =dl.getFullYear();
            if(dl.getMonth()+1<10)
                date+="-0"+(dl.getMonth()+1);
            else
                date+="-"+(dl.getMonth()+1);
            if(dl.getDate()+1<10)
                date+="-0"+(dl.getDate());
            else
                date+="-"+dl.getDate();
            this.ads.push(new Jobad(ad.id, this, ad.position, date, ad.remote, ad.numApl))
        });
        this.container = null;
    }

    draw(host)
    {
        if(!host)
            throw new Error("Missing host!");
        
        this.container = document.createElement("div");
        this.container.className = "divCompany";
        host.appendChild(this.container);

        let divLeft = document.createElement("div");
        divLeft.className = "divLeft";
        this.container.appendChild(divLeft);

        let divCompanyInfo = document.createElement("div");
        divCompanyInfo.className = "divCompanyInfo";
        divLeft.appendChild(divCompanyInfo);

        let divNewJobAd = document.createElement("div");
        divNewJobAd.className = "divNewJobAd";
        divLeft.appendChild(divNewJobAd);

        this.drawCompanyInfo(divCompanyInfo);
        this.drawNewJobAd(divNewJobAd);

        let divAds = document.createElement("div");
        divAds.className = "divAds";
        this.container.appendChild(divAds);

        this.drawAds(divAds);
    }

    drawCompanyInfo(host)
    {
        if(!host)
            throw new Error("Missing host!");

        let title = document.createElement("h3");
        title.innerHTML = "Company Info"
        host.appendChild(title);
        
        let divLabelsInputs = document.createElement("div");
        divLabelsInputs.className = "divLabelsInputs";
        host.appendChild(divLabelsInputs);
        
        let divLabels = document.createElement("div");
        divLabels.className = "divLabels";
        divLabelsInputs.appendChild(divLabels);

        let divInputs = document.createElement("div");
        divInputs.className = "divInputs";
        divLabelsInputs.appendChild(divInputs);

        let label;
        let input;
        let fields = ["Name", "Email", "Address", "Description"];
        fields.forEach(field => {
            label = document.createElement("label");
            label.innerHTML = field + ":";
            divLabels.appendChild(label);
            input = document.createElement("input");
            input.className = "input"+field;
            input.value = this[field.toLowerCase()];
            divInputs.appendChild(input);
        }); 

        let editCmpBtn = document.createElement("button");
        editCmpBtn.innerHTML = "Edit Info";
        editCmpBtn.className = "editCmpBtn";
        editCmpBtn.addEventListener("click", (ev) => {
            this.editCompany();
        });
        host.appendChild(editCmpBtn);
    }

    editCompany()
    {
        let name = this.container.querySelector(".inputName").value;
        let email = this.container.querySelector(".inputEmail").value;
        let address = this.container.querySelector(".inputAddress").value;
        let desc = this.container.querySelector(".inputDescription").value;

        if(name === "" || email === "" || address === "" || desc === "")
        {
            alert("Fill all fields for Company Info!");
            return;
        }

        fetch("https://localhost:5001/Company/UpdateCompany", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.id,
                name: name,
                address: address,
                email: email,
                description: desc
            })
        }).then(p => {
            if (p.ok) {
                this.name = name;
                this.email = email;
                this.address = address;
                this.description = desc;
                alert("Company updated!")
            }
            else if (p.status == 400) {
                alert("Company update error!")
            }
        }).catch(p => {
            alert("Company update error!");
        });

    }

    drawNewJobAd(host)
    {
        if(!host)
            throw new Error("Missing host!");

        let title = document.createElement("h3");
        title.innerHTML = "New JobAd"
        host.appendChild(title);
        
        let divLabelsInputs = document.createElement("div");
        divLabelsInputs.className = "divLabelsInputs";
        host.appendChild(divLabelsInputs);

        let divLabels = document.createElement("div");
        divLabels.className = "divLabels";
        divLabelsInputs.appendChild(divLabels);

        let divInputs = document.createElement("div");
        divInputs.className = "divInputs";
        divLabelsInputs.appendChild(divInputs);

        let label;
        let input;
        let fields = ["Position", "Deadline", "Remote"];
        let types = ["text", "date", "checkbox"];
        fields.forEach((field, i) => {
            label = document.createElement("label");
            label.innerHTML = field + ":";
            divLabels.appendChild(label);
            input = document.createElement("input");
            input.className = "input"+field;
            input.type = types[i];
            if(types[i] == "date")
            {
                var dl = new Date();
                var date =dl.getFullYear();
                if(dl.getMonth()+1<10)
                    date+="-0"+(dl.getMonth()+1);
                else
                    date+="-"+(dl.getMonth()+1);
                if(dl.getDate()+1<10)
                    date+="-0"+(dl.getDate());
                else
                    date+="-"+dl.getDate();
                input.min = date;
            }
            divInputs.appendChild(input);
        }); 

        let addNewJob = document.createElement("button");
        addNewJob.innerHTML = "Add New Ad";
        addNewJob.className = "addNewJob";
        addNewJob.addEventListener("click", (ev) => {
            this.addNewJobAd();
        });
        host.appendChild(addNewJob);
    }

    addNewJobAd()
    {
        let position = this.container.querySelector(".inputPosition").value;
        let deadline = this.container.querySelector(".inputDeadline").value;
        let remote = this.container.querySelector(".inputRemote").checked;

        if(position === "" || deadline === "")
        {
            alert("Fill all fields for New JobAd!");
            return;
        }

        fetch("https://localhost:5001/JobAd/AddJobAd/"+ this.id , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                position: position,
                deadline: deadline,
                remote: remote,
                numApl: 0
            })
        }).then(p => {
            if (p.status == 201) {
                p.json().then(data => {
                    let job = new Jobad(data.id, this, position, deadline, remote, 0);
                    this.ads.push(job);
                    job.draw(this.container.querySelector("tbody"));
                    alert("JobAd created!")
                })  
            }
            else if (p.status == 400) {
                alert("JobAd create error!")
            }
        }).catch(p => {
            alert("JobAd create error!");
        });
    }

    drawAds(host)
    {
        if(!host)
            throw new Error("Missing host!");
        
        var table = document.createElement("table");
        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");
        host.appendChild(table);
        
        table.appendChild(thead);
        table.appendChild(tbody);

        var trow = document.createElement("tr");
        thead.appendChild(trow);

        let th;
        let columns = ["Position", "Deadline", "Remote", "Apl. number"];
        columns.forEach(c => {
            th = document.createElement("th");
            th.innerHTML = c;
            trow.appendChild(th);
        }); 

        this.ads.forEach(ad => {
            ad.draw(tbody);
        });
    }

    deleteJobAd(jobad)
    {
        this.ads = this.ads.filter(value => value != jobad);
    }
}