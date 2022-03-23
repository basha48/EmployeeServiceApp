
let empPayrollList;
window.addEventListener("DOMContentLoaded", (event) => {
if(site_propertie.use_local_storage.match("true")){
  getEmployeeDataFromStorage();
}
else{
  getEmployeePayrollDataFromServer();
}

});

const processEmployeePayrollDataResponse = () =>{
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
}


const getEmployeeDataFromStorage = () => {
   empPayrollList = localStorage.getItem("EmployeePayrollList")
    ? JSON.parse(localStorage.getItem("EmployeePayrollList"))
    : [];
    processEmployeePayrollDataResponse();
};

const getEmployeePayrollDataFromServer = () =>{
  makeServiceCalls("GET",site_propertie.server_url,true)
        .then(responseText => {
          empPayrollList = JSON.parse(responseText);
          processEmployeePayrollDataResponse();
        })
        .catch(error => {
          console.log("GET Error Status: " + JSON.stringify(error));
          empPayrollList =[];
          processEmployeePayrollDataResponse();
        });
      }
let createInnerHtml = () => {
  let headerHTML =
    "<tr> <th></th> <th>Name</th> <th>Gender</th> <th>Department</th> <th>Salary</th> <th>StartDate</th><th>Actions</th> </tr>";
  let innerHTML = `${headerHTML}`;
  for (const empPayrollData of empPayrollList) {
    innerHTML = `
        ${innerHTML}
    <tr>
    <td>
        <img class="profile" src="${empPayrollData._profilePic}">
    
    </td>
    <td> 
       ${empPayrollData._name}
    </td>
    <td>${empPayrollData._gender}</td>
    <td>
        ${getDeptHtml(empPayrollData._department)}
    </td>
    <td>${empPayrollData._salary}</td>
    <td>${stringifyDate(empPayrollData._startDate)}</td>
    <td>
        <img id = "${empPayrollData.id}" onclick = "remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
        <img   id = "${empPayrollData.id}" onclick = "update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg">
    </td>
      </tr>  `;
  }

  document.querySelector("#display").innerHTML = innerHTML;
};

const getDeptHtml = (deptList) => {
  let deptHtml = "";
  for (const dept of deptList) {
    deptHtml = `${deptHtml} <div class = 'dept-label'>${dept}</div>`;
  }
  return deptHtml;
};



const remove = (node) => {
  let employeePayrollData = empPayrollList.find(employeeData => employeeData.id == node.id);
  if (!employeePayrollData) return;
  const index = empPayrollList.map(employeeData => employeeData.id).indexOf(employeePayrollData.id);
  empPayrollList.splice(index, 1);
  if(site_propertie.use_local_storage.match("true")){
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    createInnerHtml();
  }
  else{
    const deleteUrl =site_propertie.server_url + employeePayrollData.id.toString();
    makeServiceCall("DELETE",deleteUrl,false)
    .then(responseText =>{
      createInnerHtml();
    })
    .catch(error =>{
      console.log("Delete error status" +Json.stringify(error));
    })
  }
  localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
};


const update = (node) => {
  let employeePayrollData = empPayrollList.find(employeeData => employeeData.id == node.id);
  if (!employeePayrollData) return;
  localStorage.setItem("editEmp", JSON.stringify(employeePayrollData));
  window.location.replace(site_propertie.add_emp_payroll_page);
};


const createEmployeePayrollJSON = () => {
  let empPayrollDB = [
    {
      id: 1,
      _name: "Prashanth Phad",
      _gender: "male",
      _department: ["Engineer", "Other"],
      _salary: "498700",
      _startDate: "16 Oct 2021",
      _note: "All In One",
      _profilePic: "../assets/profile-images/Ellipse-3.png",
    },
    {
      id: 5,
      _name: "Jyothi",
      _gender: "female",
      _department: ["Sales", "Finance"],
      _salary: "400000",
      _startDate: "12 Oct 2019",
      _note: "",
      _profilePic: "../assets/profile-images/Ellipse -1.png",
      id: 3,
    },
  ];
  return empPayrollDB;
};


function makeServiceCalls(methodType, url, async = true, data = null) {
  return new Promise(function (resolve, reject) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    console.log(methodType+ "state changed called Ready State" +xhr.readyState+"status" +xhr.status);
    if (xhr.status.toString().match('^[2][0-9]{2}$')) {
        resolve(xhr.responseText);
      } else if (xhr.status.toString().match('^[4,5][0-9]{2}$')) {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
        console.log("XR Failed!");
        console.log("Handle 400 Client Error or 500 Server Error.");
      }
    }
  xhr.onerror = function(){
      reject({
          status: xhr.status,
          statusText: xttp.statusText
        });
  };
  xhr.open(methodType, url, async);
  if (data) {
    console.log(JSON.stringify(data));
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
  } 
  else
 xhr.send();
  console.log(methodType + " request sent to the server.");
});
}
