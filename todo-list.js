'use strict';

// MODEL: maintains *data* pertinent to the problem and tells the rest of the
//   program about changes to that data.

/**
 * A Subject is an observable thing, normally a chunk of model.  In addition
 * to the data it was created to hold, a Subject adds a further object, which
 * holds event names (messages), and a list of callback functions for each event.
 * Observers--that is, objects interested in changes to this Subject--can
 * subscribe to a given event type, providing a callback method to be called
 * when the event fires.
 */
class Subject {
    constructor() {
        this.handlers = new Object();
    }

    /**
     * Subscribe to events of a given type.  Adds the given callback function
     * to the list of functions to be called when the right kind of event fires.
     * 
     * @param {string} msg - the type of event subscribed to
     * @param {function} fn - the callback function to call when an event of the right kind fires.
     */
    subscribe(msg, fn) {
        if (!(Object.keys(this.handlers).includes(msg))) {
            //console.log('defining handlers for "' + msg + '"');
            this.handlers[msg] = [];
            //console.log(this.handlers[msg]);
        }
        this.handlers[msg].push(fn);
    	//console.log(Object.keys(this.handlers));
    }

    /**
     * Remove a handler FN from the handler list for event MSG.
     */
    unsubscribe(msg, fn) {
        if (Object.keys(this.handlers).includes(msg)) { // Otherwise, ignore it
            this.handlers[msg] = this.handlers[msg].filter(
                function(item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
    }

    /**
     * Publish an event of type MSG, with context CONTEXT.
     */
    publish(msg, context) {
        var scope = context || window;
        for (let fn of this.handlers[msg]) {
            fn(scope, msg);
        }
    }
}

/**
 * Task on the to-do list.  It is observable, although it is observed via the
 * whole list.
 *
 * Instance variables
 * @property {string} name - the name of the task
 * @property {string} _priority - the task's priority.  One of "High", "Medium", or "Low".
 * @property {Date=} due - a Date object when the task is due, or undefined
 * @property {Array[string]} depends - an Array with the names of other Tasks that this Task depends on
 */
class Task extends Subject {
    constructor(name, priority, due = undefined, depends = undefined) {
    	super();
	
        this.name = name;
        this._priority = priority;

	    if (due === undefined || due instanceof Date) {
	        this._due = due;
	    }
	    else {
	        this._due = new Date(due);
	    }

	    if (Array.isArray(depends)) {
	        this.depends = depends;
	    }
	    else {
	        this.depends = new Array();
	    }
    }

    /**
     * Get the priority.
     * 
     * @returns {string} - representing the priority
     *
     * @example
     *      let urgency = thisTask.priority
     */
    get priority() {
	    return this._priority;
    }
    
    /**
     * Set the priority
     * 
     * @param {string} newpri - the new priority.  One of "High", "Medium", or "Low".
     * @fires update
     * @example
     *      thisTask.priority = 'High'
     */
    set priority(newpri) {
	    this._priority = newpri;
	    this.publish('update', this);
    }

    /**
     * Get the due date
     * 
     * @returns {Date} - the due date
     * @example
     *      dropDead = thisTask.due
     */
    get due() {
    	return this._due;
    }
    
    /**
     * Set the due date
     * 
     * @param {string|int|Date} - the new date, either as an ISO8601 string, a number of milliseconds, or a Date object
     * @example
     *      thisTask.due = '2020-10-15'
     *      thisTask.due = new Date()
     *      thisTask.due = 
     */
    set due(newdate) {
        if (newdate instanceof Date) {
	        this._due = newdate;
        }
        else {
            this._due = new Date(newdate);
        }
    	this.publish('update', this);
    }

    /**
     * Add a new dependency to this Task.  The dependency is added only if it's not already present.
     * 
     * @param {string} newTask - the name of a Task this Task depends on
     */
    addDependency(newTask) {
        if (!this.depends.includes(newTask)) { // If it's not there already
            this.depends.push(newTask);
            this.publish('update', this);
        }
    }
}

/**
 * A TodoList is a list of Tasks.
 * 
 * @property {Array[Task]} tasks - the tasks on the list
 */
class TodoList extends Subject {
    constructor() {
        super();
        this.tasks = new Array();
    }

    /**
     * Add a new task to the todo list.  The list subscribes to the new Task's update events.
     * 
     * @param {Task} task - the Task to be added to the list
     * @fires newtask
     */
    addTask(task) {
        this.tasks.push(task);
	    task.subscribe('update', this.updateTask.bind(this));
        this.publish('newtask', this);
    }

    /**
     * Fire an update event in response to one fired by one of the list's Tasks.  This is done
     * because updating any of the Tasks on the TodoList requires redrawing, and the TodoView
     * doesn't have a way to redraw only one Task without redrawing all of them.
     * 
     * @fires update
     */
    updateTask() {
	    this.publish('update', this);
    }
}

/**
 * A TodoView displays a TodoList.
 */
class TodoView {
    constructor(model) {
        // The bind() method creates a new function that, when called, has its this keyword set to the provided value.
        model.subscribe('newtask', this.redrawList.bind(this));
	    model.subscribe('update', this.redrawList.bind(this));
    }

    /**
     * Draw the todo list, adding the new tasks.
     * 
     * @param {TodoList} todoList - the model
     * @param {string} msg - the event type.  Not used.
     */
    redrawList(todoList, msg) {
        let tbl = document.getElementById("todolist");
        tbl.innerHTML = ""; // Clear out the prior contents of the list from the HTML
        for (let task of todoList.tasks) {
            this.addRow(task, todoList.tasks, tbl);
        }
    }

    /**
     * Add a new row to the todo-list table, from a Task object
     * 
     * @param {Task} task - the Task for the new row
     * @param {Array[Task]} allTasks - all the tasks on the TodoList
     * @param {HTMLTableElement|HTMLTableSectionElement} parent - the new row's parent element
     */
    addRow(task, allTasks, parent) {
        let row = document.createElement("tr");
        this.addTD(task.name, row);
        this.addPrioritiesDropdown(task, row);
        this.addDueDate(task, row);
        this.addDependencyList(task.depends, row);
        this.addDependencyDropdown(task, allTasks, row);

        parent.appendChild(row);
    }

    /**
     * Add a <td> cell to a row.
     * @param {string|Node} valueOrText - Contents of the cell
     * @param {HTMLTableRowElement} parent - Parent row for the new cell
     */
    addTD(valueOrText, parent) {
        let td = document.createElement('td');
        if (valueOrText instanceof Node) { // DOM object
            td.appendChild(valueOrText);
        }
        else { // String
            td.innerHTML = valueOrText;
        }
        parent.appendChild(td);
    }

    /**
     * Add a dropdown for setting a task's priority to its row.
     * @param {Task} task - Task represented by this row
     * @param {HTMLTableRowElement} row - row that represents the Task
     */
    addPrioritiesDropdown(task, row) {
        let select = document.createElement('select');
        for (let val of ['High', 'Medium', 'Low']) {
            let opt = this.makeOption(val, select);
            if (task.priority === val) {
                opt.selected = val;  // Not completely sure why this works
            }
        }
        /**
         * @function
         * Changing the <select> element's value changes the priority of the Task 
         */
        select.oninput = function() { task.priority = select.value; }
        this.addTD(select, row);
    }

    /**
     * Add a date-picker for setting the task's due date.
     * @param {Task} task - task represented by this row
     * @param {HTMLTableRowElement} row - row that represents the Task
     */
    addDueDate(task, row) {
        let inputElt = document.createElement('input');
        inputElt.type = 'date';
        if (task.due instanceof Date) {
            inputElt.value = task.due.toISOString().substring(0, 10);
        }

        /**
         * @function
         * Update the due date of the task every time the date-picker is changed.
         */
        // Add a handler for the inputElt
        var d = new Date ();

        this.addTD(inputElt, row);
    }
    
    /**
     * Add a <td> element with a list of this Task's dependencies.
     * @param {Array[string]} dependencies - Array of names of Tasks on which this Task depends
     * @param {HTMLTableRowElement} row - row representing the current Task
     */
    addDependencyList(dependencies, row) {
    	this.addTD(dependencies.toString(), row);
    }

    /**
     * Create and return an <option> element with the given value and parent.
     * @param {string} val - value of the <option> element.  This is placed both in the value attribute and as the element contents.
     * @param {HTMLSelectElement} select - parent element of the <option>
     * @return {HTMLOptionElement}
     */
    makeOption(val, select) {
        let opt = document.createElement('option');
        opt.innerHTML = val;
        opt.value = val;
        select.appendChild(opt);
        return opt;
    }
    
    /**
     * Add a <td> element containing a dropdown menu for selecting dependencies.  The function
     * creates and populates the dropdown menu.
     * @param {Task} task - the Task represented by the row parameter
     * @param {Array[Task]} allTasks - Array of Tasks on the TodoList
     * @param {*} row - parent for the <td>
     */
    addDependencyDropdown(task, allTasks, row) {
        let select = document.createElement('select');
        // Create a blank option at the top, so selecting anything else
        // fires an input event
        this.makeOption('', select);

        // Add code here to populate the <select> control
        //let opt = document.getElementById(taskname)
        for (let val of ['taskname']) {
            let tsk = this.makeOption('', select);
            tsk.innerHTML = item[val]

        select.oninput = function(event) { task.addDependency(select.value); }
        this.addTD(select, row);
    }
}

// CONTROLLER: responds to user.  Controller knows about Model and View.

/**
 * Class for making the TodoList persistent, using the browser's local storage.
 * 
 * Because the JSON format only really handles data, the approach here is to
 * recreate the objects based on the saved data, rather than trying to 
 * serialize the objects themselves (including handler lists, etc.).
 */
class LocalListSaver {
    constructor(model) {
        let label = "todolist";
        // Restore the items (which are the model's real data) from local storage
        let saved_tasks = JSON.parse(localStorage.getItem(label));
        if (Array.isArray(saved_tasks)) {
           for (let oldtask of saved_tasks) {
               let newtask = new Task(oldtask.name, oldtask._priority,
				      oldtask._due, oldtask.depends);
               model.addTask(newtask);
            }
        }
        
        /**
         * @function
         * Every time the model changes, it's re-stored in localStorage.
         * @param {TodoList} todoList 
         * @param {string} msg 
         */
        let updateStorage = function(todoList, msg) {
	    console.log(msg);
            localStorage.setItem(label, JSON.stringify(todoList.tasks));
        };

        // Subscribe to the model's changes, so the storage can be kept up to date
        model.subscribe('newtask', updateStorage);
        model.subscribe('update', updateStorage);
    }
}

var todoModel = new TodoList();
var myView = new TodoView(todoModel);
var saver = new LocalListSaver(todoModel);

/**
 * Function to add a task to the todo list.
 */
function clickedon() {
    let rowcolids = ['taskname', 'priority']
    let vals = {}
    for (let cid of rowcolids) {
        vals[cid] = document.getElementById(cid).value;
    }
    let task = new Task(vals.taskname, vals.priority);
    todoModel.addTask(task);
}