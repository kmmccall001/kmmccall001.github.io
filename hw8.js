function buttonChecked(buttons, required = 1, flagElt = undefined) {
    
    let checked = 0; // Count of how many buttons in BUTTONS have been checked
    for (let button of buttons) {  // Loop over the buttons
        if (button.checked) {      // each time we find one that's checked
            checked = checked + 1; // increase the count by 1
        }
    }
    console.log('Checked: ' + checked); // For debugging
    let enoughChecked = (checked >= required);
    
    if (flagElt) { // If flagElt exists, set (or remove) its "valid" attribute
	if (enoughChecked) {
	    flagElt.classList.add("valid");
	}
	else {
	    flagElt.classList.remove("valid");
	}
    }
    return enoughChecked;
}

function validInput(formElt) {
    let valid = true;
    valid = valid && buttonChecked(document.querySelectorAll(".colors input"), 4);
    return valid;
}