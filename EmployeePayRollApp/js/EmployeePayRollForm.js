let isUpdate = false;
let employeePayRollObj = {};
window.addEventListener('DOMContentLoaded', (event) => {
  salaryOutput();
  validateName();
  validateDate();
  document.querySelector("#cancelButton").href = site_propertie.homepage;
  checkForUpdate();


});

function salaryOutput() {
  const salary = document.querySelector('#salary');
  const output = document.querySelector('.salary-output');
  output.textContent = salary.value;
  salary.addEventListener('input', function() {
      output.textContent = salary.value;

  });
}

function validateName() {
  let name = document.querySelector('#name');
  let textError = document.querySelector('.text-error');
  name.addEventListener('input', function() {
    if(name.value.length == 0 ){
      textError.textContent = "";
      return;
    }
    try{
      CheckName(name.value);
      setTextValue('.text-error', "");
    }catch(e){
      textError.textContent = e;
    }
    
  });
}

function validateDate() {
  let day = document.querySelector('#day');
  let month = document.querySelector('#month');
  let year = document.querySelector('#year');
  day.addEventListener('input', checkDate);
  month.addEventListener('input', checkDate);
  year.addEventListener('input', checkDate);
}

function checkDate() {
  let dateError = document.querySelector('.date-error');
  let date = day.value + " " + month.value + " " + year.value;
  try {
      checkStartDate(new Date(Date.parse(date)));
      dateError.textContent = "";
  } catch (e) {
      dateError.textContent = e;
  }

}

function CheckName(name){
  let nameRegex =RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
  if(!nameRegex.test(name))throw 'Name is Incorrect!';

}

function checkStartDate(startDate) {
  let currentDate = new Date();
  if (startDate > currentDate) {
      throw "Start date is a future date"
  }
  let differnce = Math.abs(currentDate.getTime() - startDate.getTime());
  let date = differnce / (1000 * 60 * 60 * 24) ;
  if (date > 30) {
      throw "Start date is beyond 30 days";
  }

}

function save(event) {
  event.preventDefault();
  event.stopPropagation();
  try {
    setemployeePayRollObj();
    if(site_propertie.use_local_storage.match("true")){

  
       createAndUpdateStorage();
        resetButton();
      window.location.replace("../pages/EmployeePayrollHomePage.html");
    }
    else{
      createOrUpdateEmployeePayroll();
    }
  } catch (e) {
    alert(e);
      return;
  }

}

const createOrUpdateEmployeePayroll =() =>{
  let postUrl =site_propertie.server_url;
  let methodCall = "POST";
  if(isUpdate){
    methodCall = "PUT";
    postUrl = postUrl + employeePayRollObj.id.toString();
  }
    makeServiceCall(methodCall, postUrl, true,employeePayRollObj)
        .then(responseText => {
         resetButton();
         window.location.replace(site_propertie.homepage);
        })
        .catch(error => {
        throw error;
        });
  }

function setemployeePayRollObj ()
{
  if(!isUpdate) employeePayRollObj.id = createEmployeeId();
  // employeePayRollObj.id = createEmployeeId();
  employeePayRollObj._name = getInputValueByID('#name');
  employeePayRollObj._salary = getInputValueByID('#salary');
  employeePayRollObj._notes = getInputValueByID('#notes');
  employeePayRollObj._profilePic = getSelectedValues('[name=profile]').pop();
  employeePayRollObj._gender = getSelectedValues('[name=gender]').pop();
  employeePayRollObj._department = getSelectedValues('[name=department]');
  let date = getInputValueByID('#day') + " " + getInputValueByID('#month') + " " + getInputValueByID('#year');
  employeePayRollObj._startDate = date;
}
function createEmployeePayroll() {
  let employeePayrollData = new EmployeePayrollData();
  try {
      employeePayrollData.name = getInputValueByID('#name');
      employeePayrollData.salary = getInputValueByID('#salary');
      employeePayrollData.notes = getInputValueByID('#notes');
      employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
      employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
      employeePayrollData.department = getSelectedValues('[name=department]');
  } catch (e) {
      setTextValue('.text-error', e);
  }
  try {
      let date = getInputValueByID('#day') + " " + getInputValueByID('#month') + " " + getInputValueByID('#year')
      employeePayrollData.startDate = new Date(Date.parse(date));
  } catch (e) {
      setTextValue('.date-error', e);
  }

  employeePayrollData.id = createEmployeeId();
  alert(employeePayrollData.toString());
  return employeePayrollData;
}




function getInputValueByID(id) {
  let value = document.querySelector(id).value;
  return value;
}

function setTextValue(className, value) {
  let textError = document.querySelector(className);
  textError.textContent = value;
}

function getSelectedValues(propertyValue) {
  let allItems = document.querySelectorAll(propertyValue);
  let setItems = [];
  allItems.forEach(item => {
      if (item.checked) {
          setItems.push(item.value);
      }
  });
  return setItems;
}


function setSelectedValues(propertyValue,value) {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
      if (Array.isArray (value)) {
        if(value.includes(item.value))
        item.checked = true;
      }
      else if (item.value === value)
      item.checked = true;
      
  });
}

function createAndUpdateStorage() {
 
  let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
  if (employeePayrollList) {
    let employeePayrollData = employeePayrollList.find(empData => empData.id == employeePayRollObj.id)
    if (!employeePayrollData ) {
      employeePayrollList.push(employeePayRollObj);
    }
      else{
        const index = employeePayrollList.map(employeeData => employeeData.id).indexOf(employeePayrollData.id);
        employeePayrollList.splice(index, 1,employeePayRollObj);
      }
    }else{
      employeePayrollList = [employeePayRollObj];
    }
  localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
  //alert(JSON.stringify(employeePayrollList));
}

function resetButton() {
  setValue('#name', '');
  unsetSelectedValues('[name=profile]');
  unsetSelectedValues('[name=gender]');
  unsetSelectedValues('[name=department]');
  setValue('#salary', '');
  setValue('#notes', '');
  setSelectedIndex('#day', 0);
  setSelectedIndex('#month', 0);
  setSelectedIndex('#year', 0);
}

function setValue(id, value) {
  let element = document.querySelector(id);
  element.value = value;
}

function unsetSelectedValues(propertyValue) {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
      item.selected = false;
  });
}

const setSelectedIndex = (id,index) =>{
  const element = document.querySelectorAll(id);
  element.setSelectedIndex = index;
}
const createEmployeeId = () => {
  let employeeId = localStorage.getItem("EmployeeID");
  employeeId = !employeeId ? 1 : (parseInt(employeeId) + 1).toString();
  localStorage.setItem("EmployeeID", employeeId);
  return employeeId;
};

const checkForUpdate = () =>{
  const employeePayRollJson = localStorage.getItem('editEmp');
  isUpdate = employeePayRollJson ? true : false;
  if(!isUpdate)
    return
    employeePayRollObj =JSON.parse(employeePayRollJson);
    setForm();
}

const setForm = () =>{
  setValue('#name', employeePayRollObj._name);
  setSelectedValues('[name=profile]', employeePayRollObj._profilePic);
  setSelectedValues('[name=gender]', employeePayRollObj._gender);
  setSelectedValues('[name=department]', employeePayRollObj._department);
  setValue('#salary', employeePayRollObj._salary);
  setValue('#notes', employeePayRollObj._notes);
  let date =stringifyDate(employeePayRollObj._startDate).split(" ");
  setValue('#day', date[0]);
  setValue('#month', date[1]);
  setValue('#year', date[2]);
}



function makeServiceCall(methodType, url, async = true, data = null) {
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
  } else 
  xhr.send();
  console.log(methodType + " request sent to the server.");
});
}
