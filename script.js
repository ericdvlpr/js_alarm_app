
$(document).ready(function(){
//Initial References
let visitorId;
const { createClient } = supabase
  const _supabase = createClient('https://xxnebbcrlclhangkvaqu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4bmViYmNybGNsaGFuZ2t2YXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMzkxNDUsImV4cCI6MjAxMTkxNTE0NX0.QA-RO66oqkm9SN9y1HZS0OmMOlC_yFqOIp44ATGKdjw')

  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
  .then(FingerprintJS => FingerprintJS.load())

// Get the visitor identifier when you need it.
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      // This is the visitor identifier:
       visitorId = result.visitorId
  })
  
  
const d = new Date();
let cuurent_day = d.getDay()
let timerRef = document.querySelector(".timer-display");
const medicineInput = document.getElementById("med_name");
const alarmTime = document.getElementById("alarmTime");
const action = document.getElementById("action");
const activeAlarms = document.querySelector(".activeAlarms");
// const setAlarm = document.getElementById("set");
let day = [d.getDay()];

let medicineArray = []
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");
  

  async function checkDeviceId(){

    const { error } = await _supabase
    .from('patient')
    .select()
    .eq('device_id', visitorId)

    if(!error){
      window.location.replace('alarms.html')
      
      
    }
    
  }

  $("#signup_form").on('submit', async function(e){
    e.preventDefault()
    var name = $('#pname').val();
    var gender = $('#genderSelect').val();
    var dob = $('#dob').val();
   
    const { error } = await _supabase
  .from('patient')
  .insert({name: name,dob:dob,gender:gender,device_id:visitorId })
    if(!error){
      console.log('Successfully added')
    }
  });

  function getDateFromHours(time) {
    time = time.split(':');
    let now = new Date();
    return new Date(now.getHours(), now.getMinutes(), ...time);
}

  async function fetchData(){
    let alarmDiv = document.createElement("div");
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const currentday = date.getDay()
    const daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];
    let { data, error } = await _supabase
    .from('medicines')
    .select('*')
    .contains('day',day)
    .order('id', { ascending: false })
      if(!error) {
        // //loop display data here
        const parent = document.getElementById('activeAlarms')
        
        let contents = ''
        data.forEach(function(item){
          let hour = item.end_time.split(':')
          let newformat = hour[0] >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          time = convertTo12Hrs(item.end_time);
          // alarmDiv.classList.add("alarm");

          // alarmDiv.setAttribute("data-id", item.id);
          alarmDiv.innerHTML +=`<div class="card alarm-card">
              <div class="card-body">
                <div class='float-start'>
                ${dayOfWeek}<br />
                <h1>${time} <small>${newformat}</small></h1>
                <p>${item.medicine_name} </p>
                </div>
                <div class='float-end'>
                  <button class='editButton ' name="edit" id='${item.id}'><i class="fa-solid fa-pen-to-square"></i></i></button>
                  <button class='deleteButton ' name="delete" id='${item.id}'><i class="fa-solid fa-trash-can" ></i></button>
                </div>
              </div>
            </div>`;


          // alarmDiv.innerHTML += `<div><span>${item.medicine_name} ${time} ${newformat}</span>`;

          // //checkbox
          // alarmDiv.innerHTML += `<button class='editButton' name="edit" id='${item.id}'><i class="fa-solid fa-pen-to-square"></i></i></button>`
          
          // //Delete button
          // alarmDiv.innerHTML += `<button class='deleteButton' name="delete" id='${item.id}'><i class="fa-solid fa-trash-can" ></i></button></div>`
          activeAlarms.appendChild(alarmDiv);
            if(item.day,find(currentday)){
              if (`${time}` === `${hours}:${minutes}`) {
                alert('Please drink your medicines')
                alarmSound.play();
                alarmSound.loop = true;
              }
            }
          })
          
        }
        $('.active_alarm').change(function(){
          if($(this).is(':checked'))
          {
            alert($(this).val());
          }
          else
          {
            alert($(this).val());
          }
        });
        $('.editButton').click(async function(){
          var alarmId = $(this).attr("id");
          $('#exampleModal').modal('show')
          let { data, error } = await _supabase
          .from('medicines')
          .select('*')
          .eq('id',alarmId)
          .select()
          
          if(!error){
            data.forEach(function(item){
              $('#med_name').val(item.medicine_name)
              $('#alarmTime').val(item.end_time)
              $('#id').val(item.id)
              item.day.forEach(function(days){
                $('#'+days).prop('checked', true);
              })
              $('#exampleModalLabel').html('Edit Alarm')
              $('#action').val('Update')
              $('.action').html('Update Alarm')
            })
          
          }
          
        });
        $('.deleteButton').click(function(){
          var alarmId = $(this).attr("id");
          if(confirm("Are you sure you want to delete this?"))
          {
            deleteAlarm(alarmId)
          }
          else
          {
            return false
          }
        })
  }
  
  fetchData()
  // fetchData().then(data => {
  //   data.forEach((alarms,index) =>{
  //     alarmDiv.classList.add("alarm");
  //     alarmDiv.setAttribute("data-id", id);
  //     alarmDiv.innerHTML = `<span>${medicineName} ${alarmHour}: ${alarmMinute}</span>`;

  //     //checkbox
  //     let checkbox = document.createElement("input");
  //     checkbox.setAttribute("type", "checkbox");
  //     checkbox.addEventListener("click", (e) => {
  //       if (e.target.checked) {
  //         startAlarm(e);
  //       } else {
  //         stopAlarm(e);
  //       }
  //     });
  //     alarmDiv.appendChild(checkbox);
      
  //     //Delete button
  //     let deleteButton = document.createElement("button");
  //     deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  //     deleteButton.classList.add("deleteButton");
  //     deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  //     alarmDiv.appendChild(deleteButton);
  //     activeAlarms.appendChild(alarmDiv);
  //   })  
  // });

let initialHour = 0,
  initialMinute = 0,
  alarmIndex = 0;

//Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

//Display Time
function displayTimer() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // Check whether AM or PM
  let newformat = hours >= 12 ? 'PM' : 'AM';
  // Find current hour in AM-PM Format

  // To display "0" as "12"
  hours = hours == 12 ? hours : hours % 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  
  //Display time
  // timerRef.innerHTML = `${hours}:${minutes}:${seconds} ${newformat}`;
  //Alarm
  
}

function convertTo12Hrs(time){
  let hours;
  let minutes;

  var tempTime = time.split(':');
  hours = tempTime[0] % 12;
  minutes = tempTime[1] < 10 ?  tempTime[1] : tempTime[1];
  return hours +':'+minutes;
}

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

//Create alarm div
const createAlarm = async (alarmObj) => {
  let alarmDiv = document.createElement("div");
  //Keys from object
  const { id,medicineName, alarmTime,days,isActive,p_id } = alarmObj;
  //Alarm div$

    const {data, error } = await _supabase
    .from('medicines')
    .insert({medicine_name: medicineName,p_id:p_id,day:days,end_time:alarmTime,active:isActive })
    .select()
    .contains('day',day)
    if(!error) {

      // //loop display data here
      const parent = document.getElementById('activeAlarms')
      
      let contents = ''
      data.forEach(function(item){
        let hour = item.end_time.split(':')
        let newformat = hour[0] >= 12 ? 'PM' : 'AM';
        // hours = hours % 12;
        // minutes = minutes < 10 ? '0' + minutes : minutes;
        time = convertTo12Hrs(item.end_time);
          // contents += `<div> ${item.medicine_name} - ${time} ${newformat}</div>` 
          alarmDiv.classList.add("alarm");
        alarmDiv.setAttribute("data-id", item.id);
        alarmDiv.innerHTML += `<span>${item.medicine_name} ${time} ${newformat}</span>`;
        //checkbox
        alarmDiv.innerHTML += `<button class='editButton' name="edit" id='${item.id}'><i class="fa-solid fa-pen-to-square"></i></i></button>`
            
        //Delete button
        alarmDiv.innerHTML += `<button class='deleteButton' name="delete" id='${item.id}'><i class="fa-solid fa-trash-can" ></i></button>`
        activeAlarms.appendChild(alarmDiv);
        location.reload();
        })
      }


 
  

  // 
  // alarmDiv.classList.add("alarm");
  // alarmDiv.setAttribute("data-id", id);
  // alarmDiv.innerHTML = `<span>${medicineName} ${alarmTime}</span>`;

  // //checkbox
  // let checkbox = document.createElement("input");
  // checkbox.setAttribute("type", "checkbox");
  // checkbox.addEventListener("click", (e) => {
  //   if (e.target.checked) {
  //     startAlarm(e);
  //   } else {
  //     stopAlarm(e);
  //   }
  // });
  // alarmDiv.appendChild(checkbox);
  
  //Delete button
  // let deleteButton = document.createElement("button");
  // deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  // deleteButton.classList.add("deleteButton");
  // deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  // alarmDiv.appendChild(deleteButton);
  // activeAlarms.appendChild(alarmDiv);
};

// checkbox.addEventListener("click", (e) => {
//   console.log(e)
//   if (e.target.checked) {
    
//     startAlarm(e);
//   } else {
//     stopAlarm(e);
//   }
// });

// openModalBtn.addEventListener("click",() =>{
//   document.getElementById('add-alarm-modal').classList.add("active");
// })
// closeModalBtn.addEventListener("click",() =>{
//   document.getElementById('add-alarm-modal').classList.remove("active");
// })
//Set Alarm
const editAlarm = async (alarmObj) => {
  const { id,medicineName, alarmTime,days,isActive,p_id } = alarmObj;
  //Alarm div$
    console.log(id)
    const {data, error } = await _supabase
    .from('medicines')
    .update({medicine_name: medicineName,p_id:p_id,day:days,end_time:alarmTime,active:isActive })
    .eq('id', id)
    .select()
    if(!error){
      location.reload()
    }
}
$('.action').on("click", function(e){
  alarmIndex += 1;
  $('#exampleModal').modal('hide')
  //alarmObject
  const id = $('#id').val()
  var days = $.map($('input[name="days"]:checked'), function(c){return c.value; })
  let alarmObj = {};
  alarmObj.id = id;
  alarmObj.medicineName = medicineInput.value;
  alarmObj.alarmTime = alarmTime.value;
  alarmObj.isActive = false;
  alarmObj.p_id = visitorId;
  alarmObj.days = days;

  alarmsArray.push(alarmObj);
  // console.log(alarmObj
  
 if(action.value == 'Add'){
  createAlarm(alarmObj);
 }else{

  editAlarm(alarmObj);
 }
  
  medicineInput.value = '';
  alarmTime.value=''
  $('input[name="days"]').prop('checked', false);
});

//Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
    alarmSound.pause();
  }
};

//delete alarm
const deleteAlarm = async (id) => {
  let { data, error } = await _supabase
  .from('medicines')
  .delete()
  .eq('id',id)
  if(!error) {
    location.reload();
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  medicineInput.value = ''
  
};

})
