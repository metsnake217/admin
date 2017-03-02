var shade = document.getElementById("shade");
var shadelight = document.getElementById("shade-light");

$('html').click(function() {
  /*$('#nameform:visible').hide();
  if($('#nameform:hidden')){
    $('#name:hidden').show();
    $('#changename:visible').hide();
    $('#pencilname:hidden').show();
  }*/
 /* $('#nameform').size()
  if($('#nameform') && $('#nameform').){
    alert();
  }*/
});

$('.cancel').click(function() {
  var cancel = $(this);
  var checked = cancel.is(':checked');
  var orderText = document.getElementById("orderText");
  if(checked){
    orderText.innerHTML = "Do you want to mark this reagent as insufficient?";
  } else {
    orderText.innerHTML = "Do you want to mark this reagent as replenished and in sufficient quantities?";
  }
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  var shade = document.getElementById("shade");
  shade.style.display = "block";

  actionorder.onclick = function(){
  var parenttr = cancel.closest('tr');
  var currentbackgroundColor = parenttr.css('backgroundColor');
  
  console.log("currentbackgroundColor: " + currentbackgroundColor);
  if(currentbackgroundColor == 'rgb(255, 255, 255)'){
    parenttr.css('background-color', 'rgba(138, 109, 59, 0.66)');
  } else {
    parenttr.css('background-color', 'rgb(255, 255, 255');
  }
  cancel.closest('form').submit();
}

  actioncancel.onclick = function(){
    if(checked){
      cancel.prop('checked', false);
    } else {
      cancel.prop('checked', true);
    }
    iosLightExit();
}

});

function materialLight(){
  var pop = document.getElementById("material-light");
  pop.style.display = "block";
  shade.style.display = "block";
}
function pencilname(){
  var nameform = $('#changename input[id="valuedetail"]'); //document.getElementById("nameform");
  var divname = document.getElementById("name");
  var changename = document.getElementById("changename");
  var pencilname = document.getElementById("pencilname");
  var checkname = document.getElementById("checkname");

  nameform.show();
  //nameform.style.display = 'block';
  divname.style.display = 'none';
  changename.style.display = 'block';
  pencilname.style.display = 'none';
  checkname.style.display = 'block';
}

function updatenameform(){
  var nameform = $('#changename input[id="valuedetail"]'); //document.getElementById("nameform");
  var divname = document.getElementById("name");
  var changename = document.getElementById("changename");
  var pencilname = document.getElementById("pencilname");
  var checkname = document.getElementById("checkname");
  nameform.hide();
  divname.style.display = 'initial';
  changename.style.display = 'none';
  pencilname.style.display = 'initial';
  checkname.style.display = 'none';

  var valentered = nameform.val().trim();
  var current = $('#name').html().trim();
  if(valentered && valentered!="" && current != valentered){ 
    $('#changename').submit();
  }

}


function pencilsurname(){
  var surnameform = $('#changesurname input[id="valuedetail"]'); //document.getElementById("surnameform");
  var divsurname = document.getElementById("surname");
  var changesurname = document.getElementById("changesurname");
  var pencilsurname = document.getElementById("pencilsurname");
  var checksurname = document.getElementById("checksurname");
  surnameform.show();
  divsurname.style.display = 'none';
  changesurname.style.display = 'block';
  pencilsurname.style.display = 'none';
  checksurname.style.display = 'block';
}

function updatesurnameform(){
  var surnameform = $('#changesurname input[id="valuedetail"]'); // document.getElementById("surnameform");
  var divsurname = document.getElementById("surname");
  var changesurname = document.getElementById("changesurname");
  var pencilsurname = document.getElementById("pencilsurname");
  var checksurname = document.getElementById("checksurname");
  surnameform.hide();
  divsurname.style.display = 'initial';
  changesurname.style.display = 'none';
  pencilsurname.style.display = 'initial';
  checksurname.style.display = 'none';

  var valentered = surnameform.val().trim();
  var current = $('#surname').html().trim();
  if(valentered && valentered!="" && current != valentered){ 
    $('#changesurname').submit();
  }

}

function penciltel(){
  var telform = $('#changetel input[id="valuedetail"]'); //document.getElementById("telform");
  var divtel = document.getElementById("tel");
  var changetel = document.getElementById("changetel");
  var penciltel = document.getElementById("penciltel");
  var checktel = document.getElementById("checktel");
  telform.show();
  divtel.style.display = 'none';
  changetel.style.display = 'block';
  penciltel.style.display = 'none';
  checktel.style.display = 'block';
}

function updatetelform(){
  var telform = $('#changetel input[id="valuedetail"]'); //document.getElementById("telform");
  var divtel = document.getElementById("tel");
  var changetel = document.getElementById("changetel");
  var penciltel = document.getElementById("penciltel");
  var checktel = document.getElementById("checktel");
  telform.hide();
  divtel.style.display = 'initial';
  changetel.style.display = 'none';
  penciltel.style.display = 'initial';
  checktel.style.display = 'none';

  var valentered = telform.val().trim();
  var currenttel = $('#tel').html().trim();
  if(valentered && valentered!="" && currenttel != valentered){ 
    $('#changetel').submit();
  }
}


function iosLight(){
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  shade.style.display = "block";
}
function iosLight(agent,vendor,catalognumber,reqemail,location,category,qty,lab){
  var actionorder = document.getElementById("actionorder");
  var orderText = document.getElementById("orderText");
  var emailform = document.getElementById("emailform");
  var agentform = document.getElementById("agentform");
  var vendorform = document.getElementById("vendorform");
  var catalogform = document.getElementById("catalogform");
  var locationform = document.getElementById("locationform");
  var categoryform = document.getElementById("categoryform");
  var qtyform = document.getElementById("qtyform");
  var labform = document.getElementById("labform");
  emailform.value = reqemail;
  agentform.value = agent;
  vendorform.value = vendor;
  catalogform.value = catalognumber;
  locationform.value = location;
  categoryform.value = category;
  qtyform.value = qty;
  labform.value = lab;
  orderText.innerHTML = "You are about to order <br/>Reagent: " + agent + "<br/>Vendor: "+vendor+"<br/>Catalog#: "+catalognumber;
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  var shade = document.getElementById("shade");
  shade.style.display = "block";
  actionorder.onclick = function(){iosLightOrder(reqemail)};
}

function iosLightOrder(email){
  console.log("TODO - ordering: " + email);
  document.getElementById("orders").submit();
}
function iosDark(){
  var pop = document.getElementById("ios-dark");
  pop.style.display = "block";
  shade.style.display = "block";
}
function modernLight(){
  var pop = document.getElementById("modern-light");
  pop.style.display = "block";
  shadelight.style.display = "block";
}
function modernDark(){
  var pop = document.getElementById("modern-dark");
  pop.style.display = "block";
  shade.style.display = "block";
}
function iosLightExit(){
  var pop = document.getElementById("ios-light");
  pop.style.display = "none";
  shade.style.display = "none";
}
function modernExit(){
  var pop = document.getElementById("modern-light");
  pop.style.display = "none";
  shadelight.style.display = "none";
}
function modernDarkExit(){
  var pop = document.getElementById("modern-dark");
  pop.style.display = "none";
  shade.style.display = "none";
}
function iosDarkExit(){
  var pop = document.getElementById("ios-dark");
  pop.style.display = "none";
  shade.style.display = "none";
}
function materialLightAnime(){
  var pop = document.getElementById("material-light-anime");
  var head = document.getElementById("head-anime");
  var text = document.getElementById("text-anime");
  pop.style.display = "block";
  shade.style.display = "block";
  setTimeout(function() {
    pop.style.width = "40%";
    pop.style.height = "auto";
    pop.style.borderRadius = "2px";
  }, 800);
  setTimeout(function() {
    head.style.marginTop = "0px";
    head.style.opacity = "0.8";
  }, 1200);
  setTimeout(function() {
    text.style.marginTop = "-12px";
    text.style.opacity = "1.0";
  }, 1800);
}
function materialDarkAnime(){
  var pop = document.getElementById("material-dark-anime");
  var head = document.getElementById("head-anime-dark");
  var text = document.getElementById("text-anime-dark");
  pop.style.display = "block";
  shade.style.display = "block";
  setTimeout(function() {
    pop.style.width = "40%";
    pop.style.height = "auto";
    pop.style.borderRadius = "2px";
  }, 800);
  setTimeout(function() {
    head.style.marginTop = "0px";
    head.style.opacity = "0.8";
  }, 1200);
  setTimeout(function() {
    text.style.marginTop = "-12px";
    text.style.opacity = "1.0";
  }, 1800);
}
function exitLightAnime(){
  var pop = document.getElementById("material-light-anime");
  var head = document.getElementById("head-anime");
  var text = document.getElementById("text-anime");
  pop.style.width = "20px";
  pop.style.height = "20px";
  pop.style.borderRadius = "100%";
  shade.style.display = "none";
  setTimeout(function(){
    pop.style.display = "none";  }, 600);
    head.style.opacity = "0.0";
    head.style.marginTop = "40px";
    text.style.opacity = "0.0";
    text.style.marginTop = "20px";
}
function exitDarkAnime(){
  var pop = document.getElementById("material-dark-anime");
  var head = document.getElementById("head-anime-dark");
  var text = document.getElementById("text-anime-dark");
  pop.style.width = "20px";
  pop.style.height = "20px";
  pop.style.borderRadius = "100%";
  shade.style.display = "none";
  setTimeout(function(){
    pop.style.display = "none";  }, 600);
    head.style.opacity = "0.0";
    head.style.marginTop = "40px";
    text.style.opacity = "0.0";
    text.style.marginTop = "20px";
}
function modernLightAnime(){
  var pop = document.getElementById("modern-light-anime");
  var head = document.getElementById("modernlight-head");
  var text = document.getElementById("modernlight-text");
  pop.style.display = "block";
  shadelight.style.display = "block";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    pop.style.top = "40%";
    pop.style.opacity = "1.0";
    head.style.top = "-120px";
}, 800);
  setTimeout(function() {
    head.style.top = "-120px";
  }, 1000);
  setTimeout(function() {
    text.style.top = "-140px";
  }, 1000);

}
function modernDarkAnime(){
  var pop = document.getElementById("modern-dark-anime");
  var head = document.getElementById("moderndark-head");
  var text = document.getElementById("moderndark-text");
  pop.style.display = "block";
  shade.style.display = "block";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    pop.style.top = "40%";
    pop.style.opacity = "1.0";
    head.style.top = "-120px";
}, 800);
  setTimeout(function() {
    head.style.top = "-120px";
  }, 1000);
  setTimeout(function() {
    text.style.top = "-140px";
  }, 1000);

}
function modernlightanimatedExit(){
  var pop = document.getElementById("modern-light-anime");
  var head = document.getElementById("modernlight-head");
  var text = document.getElementById("modernlight-text");
  pop.style.top = "60%";
  pop.style.opacity = "0.0";
  head.style.top = "-60px";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    shadelight.style.display = "none";
    pop.style.display = "none";

}, 800);
  setTimeout(function() {

  }, 1000);
  setTimeout(function() {
  }, 1200);

}
function moderndarkanimatedExit(){
  var pop = document.getElementById("modern-dark-anime");
  var head = document.getElementById("moderndark-head");
  var text = document.getElementById("moderndark-text");
  pop.style.top = "60%";
  pop.style.opacity = "0.0";
  head.style.top = "-60px";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    shade.style.display = "none";
    pop.style.display = "none";

}, 800);
  setTimeout(function() {

  }, 1000);
  setTimeout(function() {
  }, 1200);

}
function Exit(){
  var pop = document.getElementById("material-light");
  pop.style.display = "none";
  shade.style.display = "none";
}
function materialDark(){
  var pop = document.getElementById("material-dark");
  pop.style.display = "block";
  shade.style.display = "block";
}
function exitDark(){
  var pop = document.getElementById("material-dark");
  pop.style.display = "none";
  shade.style.display = "none";
}

function About(){
  var v =document.getElementById("aboutpage");
  v.style.display= "block";
}
function aboutExit(){
  var v =document.getElementById("aboutpage");
  v.style.display= "none";
}