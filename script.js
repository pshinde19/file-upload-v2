const selectbtn = document.querySelector("#selectfile")
const fileInput = document.querySelector(".file-input")
const uploadedArea = document.querySelector(".uploaded-area")
const dropArea = document.getElementById('drop-area');

selectbtn.addEventListener("click", () =>{
  fileInput.click();
});

dropArea.addEventListener('dragover', (e) => {
  preventDefaults(e);
  dropArea.classList.add('active');
});

dropArea.addEventListener('dragleave', (e) => {
  preventDefaults(e);
  dropArea.classList.remove('active');
});

dropArea.addEventListener('drop', (e) => {
    preventDefaults(e);
    dropArea.classList.remove('active');
    let fileInput1 = e.dataTransfer.files;
    fileInput.files=fileInput1
    showupload()
});

fileInput.addEventListener('change', (e) => {
  e.preventDefault();
  showupload()
});


$('#submitupload').click((e)=>{
  clearshowmsg()
  e.preventDefault();
  $("#myloader").show()
  fileInput.disabled=true;
  var files = fileInput.files;
  if(files.length > 0){
    var formData = new FormData(); 
    var files = $('.file-input')[0].files;
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]); 
    }
    console.log('formData',formData);
    $.ajax({
      url: '/upload', 
      type:'POST',
      data:formData ,
      contentType: false, 
      processData: false, 
      success: function(data) {
       if(data.status=='success'){
        $(".showupload").html('')
        $("#submitform").css('width','')
        $("#fitbox1").removeClass('d-flex justify-content-center align-items-center justify-content-sm-around flex-column flex-sm-row')
        let type='info'
        let msg='Successfull'
        appendmsg(type, msg);
        fileInput.value=''
        $("#myloader").hide()
        fileInput.disabled=false;
        setTimeout(clearshowmsg, 3000); 
      }else{
        let type='danger'
        let msg='my error'
        appendmsg(type, msg);
        $("#myloader").hide()
        fileInput.disabled=false;
        setTimeout(clearshowmsg, 3000); 
       }
      },
      error: function(error) {
        console.error('Error uploading files:', error);
        $("#myloader").hide() 
        fileInput.disabled=false;        
      }
     });
    
  }else{
    alert('Please Upload the files...')
    $("#myloader").hide() 
    fileInput.disabled=false; 
  }
  
  
})

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
}


function showupload(){
  $("#submitform").css('width','fit-content')
  $("#fitbox1").addClass('d-flex justify-content-center align-items-center justify-content-sm-around flex-column flex-sm-row')
  $(".showupload").html('')
    const files = fileInput.files;    
    for(let i=0;i<files.length;i++){
      let fname=files[i].name.length > 15 ? formname(files[i].name): files[i].name;        
      let htmlbody=`<li class="row">
                      <div class="content upload">
                        <i class="fas fa-file-alt"></i>
                        <div class="details">
                          <span class="name">${fname}</span>
                          <i class="fas fa-check"></i>
                        </div>
                      </div> 
                    </li>`
      $(".showupload").append(htmlbody)
    }
    
}

function formname(longString){
  var shortString = longString.substring(0, 14) +"...";
  var lastPart = longString.substring(longString.lastIndexOf('.') + 1);
  return shortString+lastPart
}

$("#c4mbdata_uploadbtn").click(()=>{
  var formData = new FormData(); 
    var files = $('#c4mbdata')[0].files;
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]); 
    }
    formData.append('name','c4mbdata'); 
    if(files.length > 0){
      additional_upload(formData)
    }else{
      alert('Please Upload the files...')
    } 
})

$("#Revenuereport_uploadbtn").click(()=>{
  var formData = new FormData(); 
    var files = $('#Revenuereport')[0].files;
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i]); 
    }
    formData.append('name','Revenuereport');
    if(files.length > 0){
      additional_upload(formData)
    }else{
      alert('Please Upload the files...')
    } 
    
})

function additional_upload(formData){
  clearshowmsg()
  $.ajax({
    url: '/additionalupload', 
    type:'POST',
    data:formData ,
    contentType: false, 
    processData: false, 
    success: function(data) {
     console.log(data);
     if(data.status=='success'){
      let type='info'
      let msg='success'
      appendmsg(type, msg);
      let selector = data.masterdata.id.replace(/\.xlsx$/, '');
      let viewid='#'+selector+"_view"
      let viewid_a='#'+selector+"_view"+" "+"a"
      let viewid_time='.'+selector+"_"+"ctime"
      let input_id="#"+selector
      $(viewid).show()
      $(viewid_a).attr('href', data.masterdata.folder_path);
      $(viewid_time).text("Last updated at "+data.masterdata.time)
      $(input_id).val('')
      setTimeout(clearshowmsg, 3000);
     }else{
      let type='danger'
      let msg='my error'
      appendmsg(type, msg); 
      setTimeout(clearshowmsg, 3000);
     }
    },
    error: function(error) {
      console.error('Error uploading files:', error);
               
    }
 });
}

$(document).ready(function() {
  $.ajax({
    url: '/getfilenames', 
    type:'GET',
    contentType: false, 
    processData: false, 
    success: function(data) {
     console.log(data);
     let keys=Object.keys(data)
     if (Object.keys(data).length>0){
      for (let i of keys){
        if(Object.keys(data[i]).length>0){
          let selector = i.replace(/\.xlsx$/, '');
          let viewid='#'+selector+"_view"
          let viewid_a='#'+selector+"_view"+" "+"a"
          let viewid_time='.'+selector+"_"+"ctime"
          $(viewid).show()
          $(viewid_a).attr('href', data[[i]].folder_path);
          $(viewid_time).text("Last updated at "+data[[i]].time)
        }
      }
     }else{
        $('#c4mbdata_view').hide()
        $('#Revenuereport_view').hide()
        $(".Revenuereport_ctime").text('')
        $(".c4mbdata_ctime").text('')
      }
    // if(data.filenames.length>1){
    //   $('#c4mbdata_view').show()
    //   $('#Revenuereport_view').show()
    //   $('#c4mbdata_view a').attr('href', `/${data.folder_path}/${data.filenames[0]}`);
    //   $('#Revenuereport_view a').attr('href', `/${data.folder_path}/${data.filenames[1]}`);
    //   $("#ctime").text('Last Updated at ' + data.time[0])
    //   $("#rtime").text('Last Updated at ' + data.time[1])
    // }
    
    },
    error: function(error) {
      console.error('Error uploading files:', error);
               
    }
 });
});



function appendmsg(type, msg) {
  const alertPlaceholder = document.getElementById('showmsg');
  let wrapper = `<div class="alert alert-${type} alert-dismissible mb-0 mt-3" role="alert">
                    <div>${msg}</div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
  alertPlaceholder.innerHTML = wrapper; // Use assignment instead of concatenation
}

function clearshowmsg() {
  const alertPlaceholder = document.getElementById('showmsg');
  
  alertPlaceholder.innerHTML = ''; // Use assignment instead of concatenation
}

