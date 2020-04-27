// Start with a blank users array (PC)
let users = [];
// Set default logged in status to false (PC)
let loggedIn = false;
// Logged in ID to blank (PC)
let loggedInID;

// if there is a logged in status in local storage (PC)
// note: booleans can't be stored in local storage, so we need to do string comparison
// https://stackoverflow.com/questions/3263161/cannot-set-boolean-values-in-localstorage
if (localStorage.loggedIn == "true") {
	console.log("already logged in");
	// put that status into variables (PC)
	loginStatusToVars();
	// get user details from storage, put into array (PC)
	userStorageToArray();
	// Update the nav bar to reflect logged in status (PC)
	updateNavLogin();
	// Populate the user account modal, in case they want to edit details (PC)
	populateAccountModal();
}

// Check if we've already stored the users to localstorage (PC)
if (localStorage.users) {
	// If so, bring the details into an array (PC)
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
}

// Place live array back into storage (PC)
function userArrayToStorage() {
	localStorage.users = JSON.stringify(users);
}

// Send login status to local storage (PC)
function loginStatusToVars() {
	loggedIn = localStorage.loggedIn;
	loggedInID = localStorage.loggedInID;
}

// Bring login status from local storage (PC)
function loginStatusToStorage() {
	localStorage.loggedIn = loggedIn;
	localStorage.loggedInID = loggedInID;
}

// Big old login function (PC)
function login() {
	// Hide the user/pass warnings on login press (PC)
	$("#invalidUsername").hide();
	$("#invalidPassword").hide();
	// Get user/pass values from input boxes
	let username = document.getElementById("uname").value;
	let password = document.getElementById("psw").value;
	// Boolean to track if we found the user in the array (PC)
	let foundUser = false;
	// loop through key/value array (PC)
	// https://stackoverflow.com/questions/1144705/best-way-to-store-a-key-value-array-in-javascript/1144737
	for (var key in users) {
		// If we found the user in the array... (PC)
		if (users[key].username == username) {
			// Flip the boolean (PC)
			foundUser = true;
			// If the password matches (PC)
			if (users[key].password == password) {
				// Trigger login success function (PC)
				loginSuccess(key);
				// Prevent the submit button from triggering a reload (PC)
				return false;
			} else {
				// Otherwise display "invalid password" warning (PC)
				$("#invalidPassword").show();
				// And prevent the submit button from triggering a reload (PC)
				return false;
			}
		}
	}

	// If we didn't find the user in the array (PC)
	if (foundUser == false) {
		// Show the "invalid password" warning (PC)
		$("#invalidUsername").show();
		// And prevent the submit button from triggering a reload (PC)
		return false;
	}
}

// Login successful function (PC)
function loginSuccess(userID) {
	// Set logged in var to true (PC)
	loggedIn = true;
	// Set logged in user ID (PC)
	loggedInID = userID;
	// Send login status to local storage (PC)
	loginStatusToStorage();
	// Update the nav bar (PC)
	updateNavLogin();
	// Hide the login modal (PC)
	document.getElementById("id01").style.display="none";
}

// Logout function (PC)
function logout() {
	console.log("Logging out");
	// Set logged in var to false (PC)
	loggedIn = false;
	// Send login status to local storage (PC)
	loginStatusToStorage();
	// Hide the account details modal (PC)
	$("#accountModal").modal("hide");
	// Update nav bar to reflect logout (PC)
	updateNavLogin();
}

// Pull in values from array into the account details modal (PC)
function populateAccountModal() {
	// Populate the header with a personalised welcome message (PC)
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

// Save modified account details to users array, then to local storage (PC)
function saveAccountData() {
	// Jquery place values into user details array (PC)
	users[loggedInID].firstname = $("#userFirstName").val();
	users[loggedInID].lastname = $("#userLastName").val();
	users[loggedInID].address1 = $("#userAddress1").val();
	users[loggedInID].address2 = $("#userAddress2").val();
	users[loggedInID].address3 = $("#userAddress3").val();
	users[loggedInID].phone = $("#userPhone").val();
	// Save users array to local storage (PC)
	userArrayToStorage();
	// Hide the user details account modal (PC)
	$("#accountModal").modal("hide");
	// Show a notification for saved details (PC)
	$("#saveDetailsToast").toast("show");
	// Repopulate it with the new values (PC)
	populateAccountModal();
}

// Update the navbar to reflect login status (PC)
function updateNavLogin() {
	// If loggedIn boolean is true... (PC)
	if (loggedIn) {
		// Show "My Account" and hide "Login"
		$("#navAccount").show();
		$("#navLogin").hide();
		$("#loginToast").toast("show");
		populateAccountModal();
	} else {
		$("#navAccount").hide();
		$("#navLogin").show();
		$("#logoutToast").toast("show");
	}
}
