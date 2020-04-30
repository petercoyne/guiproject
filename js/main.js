// Declare empty observatories array (PC)
let observatories = [];
// Declare empty cart array (PC)
let cart = [];
// Initialise coupons array (PC)
// First item in subarray is coupon code, second is percentage discount, third is active status
let coupons = [
	["STELL10", 10, false],
	["STELL25", 25, false]
];

// Initialise cart totals to zero (PC)
let cartPreTotal = 0;
let cartPostTotal = 0;

// Call JQuery .ajax function to fetch array from observatories.json (PC)
// https://api.jquery.com/jquery.ajax/
$.ajax({
	// URL for ajax function (PC)
	url: "./observatories.json",
	// function called when ajax successfully retrieves observatories.json (PC)
	success: function(data) {
		// put resulting array into observatories variable (PC)
		observatories = data;
		// Calculate number of observatories and place in first pane (PC)
		setNumObservatoriesOnline();
		// Create the observatory thumbnails for first pane (PC)
		buildObservatoryThumbs();
		// Read and set up shopping cart stuff (PC)
		initCart();
		// If homepage, place prices from observatories array into the price fields (PC)
		if (document.title == "Stellumina") { populatePrices(); }
	}
});

// Generate html for observatory thumbnails (PC)
function buildObservatoryThumbs() {
	// iterate through observatories array (PC)
	for (let i = 0; i < observatories.length; i++) {
		// declare htmlString var and add relevant html (PC)
		let htmlString = "<a class='obsThumb' href='#obs" + observatories[i].id + "'>";
		htmlString += "<img src='" + observatories[i].thumb + "'/>";
		htmlString += "<h1>" + observatories[i].name + "</h1>";
		htmlString += "<h2>" + observatories[i].location + "</h2>";
		htmlString += "</a>";

		// add htmlString to innerhtml of thumbholder (PC)
		document.getElementById("obsThumbHolder").innerHTML += htmlString;
	}
}

// Calculate number of observatories and place in first pane (PC)
function setNumObservatoriesOnline() {
	document.getElementById("obsOnline").innerHTML = observatories.length;
}

// Place prices from observatories array into the price fields (PC)
function populatePrices() {
	// iterate through observatories (PC)
	for (let i = 0; i < observatories.length; i++) {
		// Put price into relevant element id, e.g. #price0 for Palomar (PC)
		document.getElementById("price" + i).innerHTML = observatories[i].price;
		// Same for the initial badge state (PC)
		document.getElementById("badge" + i).innerHTML = "€" + observatories[i].price;
		// initial cost = price (PC)
		observatories[i].cost = observatories[i].price;
	}
}

// This implements the slider functionality in the order box
// It's called when the user changes the slider input (PC)
function setHours(observatory, hours) {
	// put new "hours" data into hoursHolder for observatory (PC)
    document.getElementById("hoursHolder" + observatory).innerHTML = hours;
	// Calculate new cost (hours by price) (PC)
	let cost = observatories[observatory].price * hours;
	// Update hours badge with the new cost (PC)
	document.getElementById("badge" + observatory).innerHTML = "€" + cost;
	// Put the new hours and cost back into the observatories array (PC)
	observatories[observatory].numHours = hours;
	observatories[observatory].cost = cost;
}

// Read and set up shopping cart stuff (PC)
function initCart() {
	// If there's a cart already in the local storage... (PC)
	if (localStorage.cart) {
		// put the storage into our live array (PC)
		cartStorageToArray();
		// update the cart icon badge in the nav bar (PC)
		updateCartIcon();
		// update the shopping cart modal with the existing entries (PC)
		populateCartModal();
	}
}

// update the cart icon badge in the nav bar (PC)
function updateCartIcon() {
	// if there's nothing in the cart (PC)
	if (cart.length == 0) {
		// remove the badge (PC)
		document.getElementById("navBadge").innerHTML = "";
		document.getElementById("navBadgeMobile").innerHTML = "";
	} else {
		// else update the badge contents with the number of items in cart (PC)
		document.getElementById("navBadge").innerHTML = cart.length;
		document.getElementById("navBadgeMobile").innerHTML = cart.length;
	}
}

// Place live array back into storage (PC)
function cartArrayToStorage() {
	localStorage.cart = JSON.stringify(cart);
}

// Place storage array into live array (PC)
function cartStorageToArray() {
	cart = JSON.parse(localStorage.cart);
}

// Function to create the table of cart items (PC)
function populateCartModal() {
	// Wipe the cart contents, if it exists (Jquery syntax) (PC)
	$("#cartContents").html("");
	// Start counters for totals (PC)
	let hoursTotal = 0;
	let costTotal = 0;
	// Iterate through cart items (PC)
	for (let i = 0; i < cart.length; i++) {
		// First column in 2d cart array is the observatory ID (PC)
		let obsID = cart[i][0];
		// Second column is the number of hours (PC)
		let obsHours = cart[i][1];
		// Third is the cost of the item (PC)
		let obsCost = cart[i][2];
		// Add these to total counters (PC)
		hoursTotal += Number(obsHours);
		costTotal += obsCost;
		// Build a row with id of cartItem0 etc (PC)
		$("#cartContents").append("<tr id='cartItem" + i + "'>");
		// add table data cells with item details (PC)
		$("#cartItem" + i).append("<td>" + observatories[obsID].name + "</td>");
		$("#cartItem" + i).append("<td>" + obsHours + "</td>");
		$("#cartItem" + i).append("<td>€" + obsCost + "</td>");
		// Create a reference to delete handler on this cart item (PC)
		$("#cartItem" + i).append("<td class='text-right'><button type='button' class='btn btn-danger' onClick='deleteCartItem(" + i + ")'>&times;</button></td>");
	}
	// Build row for totals (PC)
	$("#cartContents").append("<tr id='cartTotal' class='table-active'>");
	// Add total figure cells (PC)
	$("#cartTotal").append("<td>Total</td>");
	$("#cartTotal").append("<td>" + hoursTotal + "</td>");
	$("#cartTotal").append("<td>€" + costTotal + "</td>");
	$("#cartTotal").append("<td></td>");
	// Update global cart total, pre coupons (PC)
	cartPreTotal = costTotal;
	updateCoupons();
}

// Function to add a coupon to the cart (PC)
function addCoupon() {
	// Hide the invalid coupon warning (PC)
	$("#invalidCoupon").hide();
	// Get coupon code from input box (PC)
	let theCode = $("#couponInput").val();
	// Boolean if coupon code is found in array (PC)
	let foundCoupon = false;
	// Iterate through coupons array (PC)
	for (let i = 0; i < coupons.length; i++) {
		// Check if the code matches the 0th item in array (PC)
		if (theCode == coupons[i][0]) {
			// Set 2nd array item to true, indicating coupon is active (PC)
			coupons[i][2] = true;
			// Flip our boolean (PC)
			foundCoupon = true;
			// Trigger function to update the totals etc (PC)
			updateCoupons();
		}
	}
	// If we didn't find coupon code in array, warn user (PC)
	if (foundCoupon == false) {
		$("#invalidCoupon").show();
	}
}

// Function to update coupon display in cart (PC)
function updateCoupons() {
	// Clear the coupon list div (PC)
	$("#couponDetailsHolder").html("");
	// Set our total to the pre-coupon total (PC)
	cartPostTotal = cartPreTotal;
	// Tterate through coupons array (PC)
	for (let i = 0; i < coupons.length; i++) {
		// If coupon is active (PC)
		if (coupons[i][2]) {
			// Add coupon badge to display div (PC)
			$("#couponDetailsHolder").append("<p class='badge badge-primary mr-2'>" + coupons[i][0] + ": " + coupons[i][1] + "&percnt; off</p>");
			// Calculate new total (PC)
			cartPostTotal *= 1 - ((coupons[i][1]) / 100);
		}
	}
	// Display new post-coupon total below cart (PC)
	$("#cartPostTotalHolder").html("Total after coupons: &euro;" + cartPostTotal);
}

// Remove cart item with id of cartID (PC)
function deleteCartItem(cartID) {
	// Splice out the item from the live array (PC)
	cart.splice(cartID, 1);
	// Copy array back into local storage (PC)
	cartArrayToStorage();
	// update the cart icon badge in the nav bar (PC)
	updateCartIcon();
	// Update the cart table in the modal (PC)
	populateCartModal();
}

function emptyCart() {
	cart = [];
	cartArrayToStorage();
	// update the cart icon badge in the nav bar (PC)
	updateCartIcon();
	// Update the cart table in the modal (PC)
	populateCartModal();
}

function checkout() {
	if (cartPostTotal > 0) {
		$("#checkoutDetailsHolder").html(cartPostTotal);
		emptyCart();
		$("#cartModal").modal("hide");
		$("#checkoutModal").modal("show");
	} else {
		alert("Cart is empty!");
	}
}

// Jquery event listener for "add to cart" button click (PC)
$(".addToCartBtn").click(function() {
	// Get the ID of the observatory from the html attribute of the button. Magic! :) (PC)
	let obsID = this.getAttribute("data-obs-id");
	// Push array to 2d cart array: observatory ID, number of hours requested, cost of item (PC)
	cart.push([obsID, observatories[obsID].numHours, observatories[obsID].cost]);
	// Update the cart icon in the nav bar (PC)
	updateCartIcon();
	// Update the actual cart displayed in the modal (PC)
	populateCartModal();
	// Copy our live array back to storage (PC)
	cartArrayToStorage();
	// Update any coupon totals
	updateCoupons();
	// Show the "Added to cart" toast, https://getbootstrap.com/docs/4.4/components/toasts/ (PC)
	$("#addToCartToast").toast("show");
});

// -------- navbar effects on scroll (PC) adapted from: --------
// https://stackoverflow.com/questions/34551611/trying-to-fade-in-a-background-color-of-my-navigation-bar-after-i-scroll
// var for y position (PC)
let position = 0;
// var for nav element (PC)
let nav = $("nav");
// var for the jumbotron element (PC)
let jumbo = $("#homeJumbo");
// jquery "on scroll" function (PC)
$(document).scroll(function () {
	// update position var with scroll top value (PC)
	position = $(this).scrollTop();
	// if the viewport scrolls 80px down (PC)
	if (position > 80) {
		// add class fixed-top to nav element (PC)
		nav.addClass("fixed-top");
		// Kind of hacky, add spacing to top of jumbo when nav removed from flow (PC)
		jumbo.css('margin-top', '116px');
	} else {
		// if the scroll position is < 80, remove fixed-top class (PC)
		nav.removeClass("fixed-top");
		// and remove the margin-top from the jumbotron (PC)
		jumbo.css('margin-top', '0');
	}
});
