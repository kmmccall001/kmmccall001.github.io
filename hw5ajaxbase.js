/**
 * Function to get an XMLHttpRequest object.  Lightly modified from the code
 * at https://developer.mozilla.org/En/AJAX/Getting_Started.
 * 
 * @returns {XMLHttpRequest}
 */
function GetXmlHttpObject() {
    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Giving up.  Cannot create an XMLHTTP instance.');
    }
    return httpRequest;
}

/**
 * Function to make the actual request, using GET.  Again, copied from
 * Mozilla's code.
 * 
 * @param {XMLHttpRequest} request - Request object
 * @param {string} url - URL to use for the request
 */
function makeRequest(request, url) {
    request.open("GET", url, true);
    request.send();
}

/**
 * Generic request handler, which makes a request to the URL specified by 
 * URLSTR and executes the function FN whenever the request state changes.
 * Note that FN is executed even when the request fails, or when the response
 * is incomplete.
 * 
 * @param {Function} fn - Function to be called when the request returns.
 *                          The function should take an XMLHTTPRequest as a parameter
 *                          and return nothing.
 * @param {string} urlStr - URL to use for the request
 */
function handleRequest(fn, urlStr) {
    let request = GetXmlHttpObject();

    // Specify a callback
    request.onreadystatechange = function callback() { fn(request); }

    // Make the request
    makeRequest(request, urlStr);
}

/**
 * Almost-generic request handler, which makes a request to the URL given
 * by URLSTR and executes the function FN specifically when the response is
 * complete and successful.  Basically, I got sick of retyping the nested
 * if-statements that check whether the response is complete and OK.
 * 
 * @param {Function} fn - Function to execute when the response is complete and OK.
 *                          The function should take an XMLHTTPRequest as a parameter
 *                          and return nothing.
 * @param {string} urlStr - URL to use for the request
 */
function handleRequestOnCompletion(fn, urlStr) {
    var handlerFn = function handler(req) {
        if (req.readyState === XMLHttpRequest.DONE) { // Response is complete
            if (req.status === 200) {  // HTTP OK (code number is from the HTTP standard)
                fn(req);
            }
        }
    };
    handleRequest(handlerFn, urlStr);
}

/**
 * Makes a request to URLSTR, which expects text or HTML as a response.
 * When the response returns, the text or HTML is used to fill in the
 * element with ID ELTID.
 * 
 * @param {string} eltID - String matcching the id attribute of the element to be filled
 * @param {string} urlStr - URL to use for the request
 */
function updateElement(eltID, urlStr) {
    var fillFn = function fillIn(request) {
		var elt = document.getElementById(eltID);
		elt.innerHTML = request.responseText;
    }

    handleRequestOnCompletion(fillFn, urlStr);
}


/**
 * Makes and returns an HTML element of type TAGTYPE, setting its innerHTML
 * to the given DATA.  DATA should be text or HTML.
 * 
 * @param {string} tagType - tag name of the element to be created
 * @param {string} data - string or HTML used as the innerHTML of the new element
 * @returns {HTMLElement} - the new element
 */
function makeAndFillElt(tagType, data) {
    var elt = document.createElement(tagType);
    elt.innerHTML = data;
    return elt;
}
