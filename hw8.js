function buttonChecked(buttons, required = 1, flagElt = undefined) {
    
    let checked = 0; 
    for (let button of buttons) {  
        if (button.checked) {     
            checked = checked + 1; 
        }
    }
    console.log('Checked: ' + checked); 
    let enoughChecked = (checked >= required);
    
    if (flagElt) { 
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
