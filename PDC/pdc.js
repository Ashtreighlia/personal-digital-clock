////////////////////////////
// personal digital clock //
////////////////////////////

// Load fonts
var simple = atob("AAAAAAAAAAD6AAAAAMAAwAAAKP4o/igANFT+VFgAwowQYoYAZLq6pk4AAMAAAAAAADhEgoIAAIKCRDgAACgQKAAAABA4EAAAAAYAAAAAABAQEAAAAAYGAAAAAgwQYIAA/oKCgv4AAID+AAAAnpKSkvIAgpKSkv4A8BAQEP4A8pKSkp4A/pKSkp4A4ICAgP4A/pKSkv4A8pKSkv4AAAAoAAAAAAAsAAAAABAoRAAAACgoKAAAAEQoEAAAwICaoOAAfIKysmQAfpCQkH4Agv6SknwAfIKCgoIAgv6CgnwAfJKSkoIAfpCQkIAAfIKSkowA/hAQEP4AAAD+AAAAjIKCgnwA/hAoRIIA/AICAgIAfsBwwH4A/mA4DP4AfIKCgnwAfpCQkGAAfIKKhn4AfpCYlGIAYpKSkowAgID+gIAA/AICAvwA8AwGDPAA/AYcBvwA7hAQEO4A4BAeEOAAhoqSosIAAHyCggAAgGAQDAIAAIKCfAAAAECAQAAAAAICAgAA");

var numbers = atob("//7//v/+4A7gDuAO4A7gDv/+//7//gAAAAAAAOAA4AD//v/+//4AAAAAAAAAAAAA4/7j/uP+447jjuOO447jjv+O/47/jgAA4A7gDuOO447jjuOO447jjv/+//7//gAA/4D/gP+AA4ADgAOAA4ADgP/+//7//gAA/47/jv+O447jjuOO447jjuP+4/7j/gAA//7//v/+447jjuOO447jjuP+4/7j/gAA/gD+AP4A4ADgAOAA4ADgAP/+//7//gAA//7//v/+447jjuOO447jjv/+//7//gAA/47/jv+O447jjuOO447jjv/+//7//gAAAAAAAAAAAAAO4A7gDuAAAAAAAAAAAAAA");

//check battery charge
var batterycharge = 0;
var batterychargechecked = false;
function getCharge(s){
  if(s == 0 || batterychargechecked == false){
    batterycharge = E.getBattery();
    batterychargechecked = true;
  }
  return batterycharge;
}

//check amount of steps
function getSteps(){
  var steps = Bangle.getHealthStatus("day").steps;
  return steps;
}

//check heart beats
function getBPM(){
  var bpm = Bangle.getHealthStatus("last").bpm;
  return bpm;
}

//Special thanks to MaBe on the Espruino forums (http://forum.espruino.com/profiles/100008/) for putting this snippet up! Did come in really handy :D
function RectRnd(x1,y1,x2,y2,r) {
      pp = [];
      pp.push.apply(pp,g.quadraticBezier([x2-r,y1, x2,y1,x2,y1+r]));
      pp.push.apply(pp,g.quadraticBezier([x2,y2-r,x2,y2,x2-r,y2]));
      pp.push.apply(pp,g.quadraticBezier([x1+r,y2,x1,y2,x1,y2-r]));
      pp.push.apply(pp,g.quadraticBezier([x1,y1+r,x1,y1,x1+r,y1]));
      return pp;
}

function fillRectRnd(x1,y1,x2,y2,r) {
      g.fillPoly(RectRnd(x1,y1,x2,y2,r),1);
}

//--CLOCK--//
var flipflop = true;
var dayName = ["MON", "TUE", "WEN", "THU", "FRI", "SAT", "SUN"];
var monthName = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function drawClock(date, bpm, steps, charge){
  g.setColor(0,0,0);
  g.fillRect(0,0,176,176);
  
  var clockX = 28;
  var clockY = 13;
  
  g.setColor(1,1,1);

  fillRectRnd(21, 7, 176 - 21, clockY + 45 + 6,        9);
  fillRectRnd(30, clockY + 62, 176 - 30, clockY + 81,  5);
  fillRectRnd(5, 103, 176 - 6, 176- 10,                9);
  
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  
  g.setColor(0,0,0);
  g.setFontCustom(numbers, 48, 12, 16+512);
  if(flipflop){
    g.drawString(("0"+h).substr(-2) + ":" + ("0"+m).substr(-2), clockX, clockY);
    flipflop = false;
  }
  else{
    g.drawString(("0"+h).substr(-2) + " " + ("0"+m).substr(-2), clockX, clockY);
    flipflop = true;
  }
  
  g.setColor(0.25,0.25,0.25);
  g.fillRect(clockX, clockY + 35, clockX + s*2, clockY + 45);
  
  var workday = date.getDay();
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  
  g.setColor(0,0,0);
  g.setFontCustom(simple, 32, 6, 8+512);
  
  g.drawString(("0"+day).substr(-2) + " " + monthName[month] + " " + ("0"+year).substr(-2), clockX+6, clockY+65);
  
  //--INFO--//
  var statusX = 13;
  var barX = statusX + 55;
  var statusY = clockX+79;
  var barlengthStatus = 99;
  
  g.setColor(0,0,0);
  g.setFontCustom(simple, 32, 6, 8+512);
  g.drawString(("0" + bpm.toFixed(0)).slice(-3) + "B",  statusX, statusY);
  g.drawString((steps/1000).toFixed(1) + "K",           statusX, statusY+21);
  g.drawString(charge + " %",                           statusX, statusY+42);
  
  g.setColor(1,0,0);
  g.fillRect(barX, statusY,    barX+bpm/200*barlengthStatus,     statusY+13);
  g.setColor(0,1,0);
  g.fillRect(barX, statusY+21, barX+steps/10000*barlengthStatus, statusY+34);
  g.setColor(0,0,1);
  g.fillRect(barX, statusY+42, barX+charge/100*barlengthStatus,  statusY+55);

}

//--MAIN--//
function main(){
  var date = new Date();
  
  var charge = getCharge(date.getSeconds());
  var steps = getSteps();
  var bpm = getBPM();
  g.clear();
  drawClock(date, bpm, steps, charge);
}

main();
setInterval(main, 1000);
Bangle.setUI("clock");