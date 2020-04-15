function makeChoice() {
    // Use Date queries to determine whether today is either a Tuesday
    // or Thursday (return "Yes") or not (return "No").
    
    let choice = "No";
    
    // new Date() returns a Date object representing now.  Date.getDay()
    // returns a number representing the day of the week.
    
    let dayNum = (new Date()).getDay();
    if ((dayNum === 5)) {
        choice = "Yes";
    }
    return choice;
}


