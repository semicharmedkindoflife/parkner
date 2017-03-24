var config = {
		apiKey: "AIzaSyBWUHtk1NlbJbFZWUHpIN7Hf57QNESgbCc",
		authDomain: "parkner-85365.firebaseapp.com",
		databaseURL: "https://parkner-85365.firebaseio.com",
		storageBucket: "parkner-85365.appspot.com",
		messagingSenderId: "339330754345"
};

var account = {
	uid: null,
	email: null,
	name: null,
	eid: null,
	hasParkSpace: false,
	bldg: null,
	flrNo: null,
	slotNo: null
};

if (firebase) {
    firebase.initializeApp(config);
}

$(document).ready(function() {

	if (!account.uid) {
		$.mobile.changePage("#loginPage", {transition: "slide"} );
	}
	
    $("#loginBtn").click(function(e){
        e.preventDefault();
        $.mobile.loading("show");
        if ($("#login_email").val() && $("#login_pw").val()) {
        	   var promise = firebase.auth().signInWithEmailAndPassword($("#login_email").val().trim(), $("#login_pw").val().trim()).then(function(user) {
        	       // Success
        		    firebase.database().ref('users/' + user.uid).on('value', function(snapshot) {
        		    	  window.account.uid = snapshot.val().uid;
        		    	  window.account.name = snapshot.val().name;
        		    	  window.account.email = snapshot.val().email;
        		    	  window.account.eid = snapshot.val().eid;
        		    	  window.account.hasParkSpace = snapshot.val().hasParkSpace;
        		    	  window.account.flrNo = snapshot.val().flrNo;
        		    	  window.account.slotNo = snapshot.val().slotNo;
        		    	  $("#profileName").html("" + account.name);
         	        	  $.mobile.changePage("#employeeListPage", {transition: "slide"} );
           	        	  $.mobile.loading("hide");
        		    }, function(error) {
        		    	console.log(error.message);
        		    });
        	   }).catch(function(error) {
        		  // Handle Errors here.
        		  var errorCode = error.code;
        		  var errorMessage = error.message;
        		  // ...
        		  console.log(errorMessage);
              		$.mobile.loading("hide");
              		$("#errorMsg").html(errorMessage);
              		$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
        	});
        	   
        	
        	
        	console.log(promise);
        	return;
        } else {
        	$.mobile.loading("hide");
        	$("#errorMsg").html("Missing email and/or password.");
        	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
        	return;
        }
    });
    
    $("#signUpBtn").click(function(e){
        e.preventDefault();
        $.mobile.loading("show");
        $.mobile.changePage("#signUpPage", {transition: "slide"} );
        $.mobile.loading("hide");
    });
	
    $('#assignedParkSpaceCheckbox').change(function() {
        if($(this).is(":checked")) {
			$( "#assignedParkingSpace" ).show("500");
        } else {
			$( "#assignedParkingSpace" ).hide("slow");
        }
        $('#assignedParkSpaceCheckbox').val($(this).is(':checked'));        
    });
    
    $("#btnRegister").click(function(e){
        e.preventDefault();
        $.mobile.loading("show");
        
        /* Check password */
        if ($("#reg_pw1").val() && $("#reg_pw2").val()) {
	        if ($("#reg_pw1").val().trim() !== $("#reg_pw2").val().trim()) {
	        	$.mobile.loading("hide");
	        	$("#errorMsg").html("Password is not the same. Please re-type your password.");
	        	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
	        	return;
	        }
        } else {
        	$.mobile.loading("hide");
        	$("#errorMsg").html("Please input your password.");
        	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
        	return;
        }
        
        if ($("#assignedParkSpaceCheckbox").prop('checked')) {
        	if ($("#reg_bldg").val()) {
        		account.bldg = $("#reg_bldg").val();
        	} else {
            	$.mobile.loading("hide");
            	$("#errorMsg").html("Please input the bldg where you have the parking space.");
            	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
            	return;
        	}
        	
        	if ($("#reg_flrNo").val()) {
        		account.flrNo = $("#reg_flrNo").val();
        	} else {
            	$.mobile.loading("hide");
            	$("#errorMsg").html("Please input the floor/basement no. where you have the parking space.");
            	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
            	return;
        	}
        	
        	if ($("#reg_parkSlotNo").val()) {
        		account.slotNo = $("#reg_parkSlotNo").val();
        	} else {
            	$.mobile.loading("hide");
            	$("#errorMsg").html("Please input your parking slot no.");
            	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
            	return;
        	}
        } else {
        	account.bldg = null;
        	account.flrNo = null;
        	account.slotNo = null;
        }
        
        if ($("#reg_name").val() && $("#reg_email").val() && $("#reg_pw1").val() && $("#reg_pw2").val()) {
			firebase.auth().createUserWithEmailAndPassword($("#reg_email").val(), $("#reg_pw1").val()).then(function(user) {
	        	account.uid = user.uid;
	        	account.name = $("#reg_name").val();
	        	account.email = $("#reg_email").val();
	        	
	        	if ($("#reg_eid").val()) {
	        		account.eid = $("#reg_eid").val();
				}
	        	
	        	account.hasParkSpace = $("#assignedParkSpaceCheckbox").prop('checked');
	        	
	        	writeUserData(account);
	        	
	        	$.mobile.changePage("#employeeListPage", {transition: "slide"} );
				$.mobile.loading("hide");
	    	}).catch(function(error) {
	    		$.mobile.loading("hide");
	        	console.log('there was an error');
	        	var errorCode = error.code;
	        	var errorMessage = error.message;
	        	console.log(errorCode + ' - ' + errorMessage);
	        	$("#errorMsg").html(errorMessage);
	        	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
	    	});
        } else {
        	$("#errorMsg").html("Please complete the mandatory fields.");
        	$.mobile.changePage("#errorDialog", {transition: "pop", role: "dialog", reverse: false} );
        }
     });
    
    $("#exitSaloonLink").click(function(e){
        e.preventDefault();
        $.mobile.loading("show");
        firebase.auth().signOut().then(function() {
        		$.mobile.changePage("#loginPage", {transition: "slide"} );
        	}, function(error) {      		
        		$.mobile.changePage("#loginPage", {transition: "slide"} );
        });
        $.mobile.loading("hide");
    });
});

function writeUserData(account) {
  firebase.database().ref('users/' + account.uid).set({
    name: account.name,
    email: account.email,
    eid: account.eid,
    hasParkSpace: account.hasParkSpace,
    bldg: account.bldg,
    flrNo: account.flrNo,
    slotNo: account.slotNo
  });
}

function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
}

function checkPassStrength(pass) {
    var score = scorePassword(pass);
    if (score > 80)
        return "Strong";
    if (score > 60)
        return "Good";
    if (score >= 30)
        return "Weak";

    return "";
}

$(document).ready(function() {
    $("#reg_pw1").on("keypress keyup keydown", function() {
        var pass = $(this).val();
        $("#strength_human").text("Strength: " + checkPassStrength(pass));
    });
});
