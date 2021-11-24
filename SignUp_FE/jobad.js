import { User } from "./user.js";

export class Jobad
{
    constructor(id, company, position, deadline, remote, numApl)
    {
        this.id = id;
        this.company = company;
        this.position = position;
        this.deadline = deadline;
        this.remote = remote;
        this.numApl = numApl;
        this.users = [];
        this.container = null;
    }

    draw(host)
    {
        if(!host)
            throw new Error("Missing host!");
        
        var row = document.createElement("tr");
        this.container = row;
        host.appendChild(row);

        var td = document.createElement("td");
        let input = document.createElement("input");
        input.className = "inputPosition"
        input.value = this.position;
        td.appendChild(input);
        row.appendChild(td);

        td = document.createElement("td");
        input = document.createElement("input");
        input.type = "date";
        input.className = "inputDeadline"
        input.value = this.deadline;
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
        td.appendChild(input);
        row.appendChild(td);

        td = document.createElement("td");
        input = document.createElement("input");
        input.type = "checkbox";
        input.className = "inputRemote"
        input.checked = this.remote;
        td.appendChild(input);
        row.appendChild(td);

        td = document.createElement("td");
        let lbl = document.createElement("label");
        lbl.innerHTML = this.numApl;
        td.appendChild(lbl);
        let btnDetails = document.createElement("button");
        btnDetails.innerHTML = "details";
        btnDetails.addEventListener("click", (ev) => {
            this.showDetails();
        });
        td.appendChild(btnDetails);
        td.className = "numApl";
        row.appendChild(td);

        td = document.createElement("td");
        td.className = "tdBtns";
        
        let applyBtn = document.createElement("button");
        applyBtn.className = "jobAdBtns";
        applyBtn.innerHTML = "apply";
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
        if(this.deadline < date)
            applyBtn.disabled = true;
        applyBtn.addEventListener("click", (ev) => {
            this.applyAd();
        });
        td.appendChild(applyBtn);     

        let editBtn = document.createElement("button");
        editBtn.className = "jobAdBtns";
        editBtn.innerHTML = "edit";
        editBtn.addEventListener("click", (ev) => {
            this.editAd();
        });
        td.appendChild(editBtn);
        
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "jobAdBtns";
        deleteBtn.innerHTML = "delete";
        deleteBtn.addEventListener("click", (ev) => {
            this.deleteAd();
        });
        td.appendChild(deleteBtn);
        
        row.appendChild(td);
    }

    showDetails()
    {
        fetch("https://localhost:5001/JobAd/Get/" + this.id, {
                method: 'GET'
            }).then(p => {
                if (p.status == 200) {
                    p.json().then(data => {
                        var msg = "";
                        data.users.forEach(user => {
                           var u = new User(user.id, user.username, user.firstName, user.lastName, user.email, user.address, user.degree);
                           msg += u.getUserInfo() + "\n";
                        });
                        alert(msg);
                    });
                 }
        }).catch(p => {
            alert("Error while deleting!")
        });
    }

    deleteAd()
    {
        if (confirm("Are you sure you want to delete this ad?"))
        {
            fetch("https://localhost:5001/JobAd/DeleteJobAd/" + this.id, {
                    method: 'DELETE'
                }).then(p => {
                    if (p.status == 200) {
                        this.company.container.querySelector("tbody").removeChild(this.container);
                        this.company.deleteJobAd(this);
                        alert("JobAd deleted!");
                    }
            }).catch(p => {
                alert("Error while deleting!")
            });
        }
    }

    editAd()
    {
        let position = this.container.querySelector(".inputPosition").value;
        let deadline = this.container.querySelector(".inputDeadline").value;
        let remote = this.container.querySelector(".inputRemote").checked;

        if(position === "" || deadline === "")
        {
            alert("Fill all fields for JobAd update!");
            return;
        }

        fetch("https://localhost:5001/JobAd/UpdateJobAd", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: this.id,
                position: position,
                deadline: deadline,
                remote: remote,
                numApl: this.numApl
            })
        }).then(p => {
            if (p.ok) {
                this.position = position;
                this.deadline = deadline;
                this.remote = remote;
                alert("JobAd updated!")
            }
            else if (p.status == 400) {
                alert("JobAd update error!")
            }
        }).catch(p => {
            alert("JobAd update error!");
        });
    }

    applyAd()
    {
        let user = document.querySelector(".usernameEdit").value;
        let numApl = parseInt(this.container.querySelector("label").innerHTML);

        fetch("https://localhost:5001/JobAd/Apply/"+ this.id + "/" + user , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(p => {
            if (p.ok) {
                this.numApl = ++numApl;
                this.container.querySelector("label").innerHTML = this.numApl;
                alert(`User: ${user} applied for JobAd!`);   
            }
            else if (p.status == 400) {
                alert("Already applied for this JobAd!");
            }
            else if (p.status == 404) {
                alert("User not found!");
            }
        }).catch(p => {
            alert("Error while applying for JobAd!");
        });
    }
}