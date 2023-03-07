function popUp(data) {
    const body = document.body;
    body.classList.add("blocked"); 
    const window = document.createElement("div");
    window.classList.add('statistics');
    const table = document.createElement("table");
    data.forEach (later => {
        const row = document.createElement("tr");
        const col1 = document.createElement("td");
        const col2 = document.createElement("td");
        col1.textContent = later.name;
        col2.textContent = later.late;
        row.appendChild(col1);
        row.appendChild(col2);
        table.appendChild(row);
    })
    document.querySelectorAll('.statistics').forEach(win => win.remove() );
    window.appendChild(table);
    body.appendChild(window);
    table.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); })
    window.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); window.remove(); body.classList.remove("blocked"); } )
}


function parseDateTime(str) {
    const docInfo = str.trim().split(" ");
    const [day, month, year] = docInfo[1].split(".");
    docInfo[2] = docInfo[2].replace("]:","").replace("]","");
    return new Date(year + '-' + month + '-' + day + 'T' + docInfo[2]);
}


function checkDates(timeLimit) {

    const docElement = document.querySelector(".resolution-item__timestamp");
    const docDate = parseDateTime(docElement.textContent);
    let limit30 = new Date(docDate);
    limit30 = limit30.setMinutes(limit30.getMinutes() + parseInt(timeLimit));
    const employees = [];
    const lates = [];

    const employesElement = document.querySelectorAll(".resolution-item__header");
    employesElement.forEach(el => {
        let employee = {};
        if (el.querySelector(".resolution-item__author") !== null) {
            employee.name = el.querySelector(".resolution-item__author").textContent.trim();
            employee.time = parseDateTime(el.querySelector(".resolution-item__timestamp").textContent);
            employees.push(employee)
            
            if (limit30 < employee.time) {
                let late = "";
                if (((employee.time - limit30)/60000) < 100) {
                    late = Math.round((employee.time - limit30)/60000) + " мин.";
                }else{
                    late = Math.round((employee.time - limit30)/3600000) + " ч.";
                }
                lates.push({"name":employee.name,"late":late});
            }
        }
    })
    popUp(lates);
}

chrome.runtime.onMessage.addListener(
    function(request) {
        let timeLimit = (typeof request.timeLimit === undefined) ? 30 : request.timeLimit;
        checkDates(timeLimit);
    }
);
