function createpara(buttonElt) {
    var click = document.getElementById("adjectivenoun");
    if(click.style.display =="none"){
        click.style.display = "block";
    }
    else{
        click.style.display = "none";
    }
    
    let li = document.createElement('li');
    li.textContent = 'You are';
    youarea.appendChild(li);

    li = document.createElement('li');
    li.textContent = 'a(n)';
    
    youarea.appendChild(li);
  
    
}
