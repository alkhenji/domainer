/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


app.initialize();


function reset_messages(){
  var no = document.getElementsByClassName('no');
  var yes = document.getElementsByClassName('yes');
  for (i=0;i<3;i++){
    no[i].innerHTML = "";
    yes[i].innerHTML = "";
  }
  document.getElementById('maybe').innerHTML = "";
  return;
};

function check(extension){
  if (typeof extension === 'undefined') { extension = '.com'; }
  // var extension = ".com";

  reset_messages();
  document.getElementById('maybe').innerHTML = "Checking...";

  var myNewTitle = document.getElementById('domain').value;

  if( myNewTitle.length==0 ){
    document.getElementById('maybe').innerHTML = "Please enter a valid domain name (without .com or .net etc.)";
    return;
  }

  if (window.XMLHttpRequest){
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else { 
    // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
      // It gets here when the request is successful

      maybe = xmlhttp.responseText.match("invalid domain");
      if (maybe){
        var s = "There was an error processing your request.";
        s+= "The domain name "+ myNewTitle + " is not a valid domain name.";
        document.getElementById('maybe').innerHTML = xmlhttp.responseText;
        return xmlhttp.responseText;
      }

      var index = 0;
      if (extension == ".com"){
        index = 0;
      } else if (extension == ".net"){
        index = 1;
      } else {
        index = 2;
      }

      result = xmlhttp.responseText.match("UNAVAILABLE");
      if (result){ // domain unavailable, do something?
        document.getElementById('maybe').innerHTML = "";
        document.getElementsByClassName('no')[index].innerHTML = "Ouch.. The domain ("+myNewTitle+extension+") is not available.";
      } else { // domain available
        document.getElementById('maybe').innerHTML = "";
        document.getElementsByClassName('yes')[index].innerHTML = "Congrats! Your domain ("+myNewTitle+extension+") is available!";
      }

      if (extension === ".com"){ return check(".net"); }
      if (extension === ".net"){ return check(".qa"); }

      return xmlhttp.responseText;
    }
  }

  var fetch_from = "https://www.whoisxmlapi.com/whoisserver/WhoisService?cmd=GET_DN_AVAILABILITY&domainName="+myNewTitle+extension+"&username=linglinlal&password=pass4lal";
  // var fetch_from = "http://whois.domaintools.com/" + myNewTitle + ".com";

  try {
    xmlhttp.open("GET", fetch_from, false );
    xmlhttp.send();
  }
  catch(err) {
    reset_messages();
    document.getElementById('maybe').innerHTML = "There is a network error. Please check your internet connection and try again.";
  }

  // title.innerHTML = xmlhttp.responseText;

  // title.innerHTML = "https://www.whoisxmlapi.com/whoisserver/WhoisService?cmd=GET_DN_AVAILABILITY&domainName="+myNewTitle+"&username=linglinlal&password=pass4lal";
}