let users = [];
let loggedIn = false;
let loggedInID;

if (localStorage.loggedIn) {
	console.log("logged in detected");
	loginStatusToArray();
	userStorageToArray();
	updateNavLogin();
	populateAccountModal();
}

// Check if we've already stored the users to localstorage (PC)
if (localStorage.users) {
	console.log("users detected in local storage");
	userStorageToArray();
} else {
	// Call JQuery .ajax function to fetch default user details from .json (PC)
	// https://api.jquery.com/jquery.ajax/
	$.ajax({
		// URL for ajax function (PC)
		url: "./data/users.json",
		// function called when ajax successfully retrieves users.json (PC)
		success: function(data) {
			// put resulting array into users variable (PC)
			users = data;
			// Save users to local storage
			userArrayToStorage();
		}
	});
}

// Place storage array into live array (PC)
function userStorageToArray() {
	users = JSON.parse(localStorage.users);
	console.log("brought users to array");
}

// Place live array back into storage (PC)
function userArrayToStorage() {
	console.log("storing users");
	localStorage.users = JSON.stringify(users);
}

function loginStatusToArray() {
	loggedIn = localStorage.loggedIn;
	loggedInID = localStorage.loggedInID;
}

function loginStatusToStorage() {
	localStorage.loggedIn = loggedIn;
	localStorage.loggedInID = loggedInID;
}

function login() {
	$("#invalidUsername").hide();
	$("#invalidPassword").hide();
	let username = document.getElementById("uname").value;
	let password = document.getElementById("psw").value;
	let foundUser = false;
	// loop through key/value array (PC)
	// https://stackoverflow.com/questions/1144705/best-way-to-store-a-key-value-array-in-javascript/1144737
	for (var key in users) {
		if (users[key].username == username) {
			foundUser = true;
			if (users[key].password == password) {
				loginSuccess(key);
			} else {
				$("#invalidPassword").show();
				return false;
			}
		}
	}

	if (foundUser == false) {
		$("#invalidUsername").show();
		return false;
	}
}

function loginSuccess(userID) {
	loggedIn = true;
	loggedInID = userID;
	loginStatusToStorage();
	console.log("logged in " + userID);
	console.log("login status " + loggedIn);
	updateNavLogin();
	document.getElementById("id01").style.display="none";
}

function logout() {
	loggedIn = false;
	loginStatusToStorage();
	console.log("logged out");
	$("#accountModal").modal("hide");
	updateNavLogin();
}

function populateAccountModal() {
	document.getElementById("userNameHolder").innerHTML = users[loggedInID].firstname;
	// Jquery place user details into input values (PC)
	// https://stackoverflow.com/questions/5709258/jquery-change-input-text-value
	$("#userFirstName").val(users[loggedInID].firstname);
	$("#userLastName").val(users[loggedInID].lastname);
	$("#userAddress1").val(users[loggedInID].address1);
	$("#userAddress2").val(users[loggedInID].address2);
	$("#userAddress3").val(users[loggedInID].address3);
	$("#userPhone").val(users[loggedInID].phone);
}

function saveAccountData() {
	users[loggedInID].firstname = $("#userFirstName").val();
	users[loggedInID].lastname = $("#userLastName").val();
	users[loggedInID].address1 = $("#userAddress1").val();
	users[loggedInID].address2 = $("#userAddress2").val();
	users[loggedInID].address3 = $("#userAddress3").val();
	users[loggedInID].phone = $("#userPhone").val();
	userArrayToStorage();
	$("#accountModal").modal("hide");
	populateAccountModal();
}

function updateNavLogin() {
	if (loggedIn) {
		console.log("nav: user logged in");
		$("#navAccount").show();
		$("#navLogin").hide();
		populateAccountModal();
	} else {
		console.log("nav: user not logged in");
		$("#navAccount").hide();
		$("#navLogin").show();
	}
}
