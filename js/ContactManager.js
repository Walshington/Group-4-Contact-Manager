
const urlBase = 'http://cop4331spacebook.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function signInPopup()
{
	let popup = document.getElementById("mdl");
	let x = document.getElementsByClassName("close")[0];

	// make popup visible on click
	popup.style.visibility = "visible";
	popup.style.display = "block";

	x.onclick = function() {
		// popup closes when x is clicked
		popup.style.visibility = "hidden";
	}
}

function AddContactPopUp()
{
	let popup = document.getElementById("mdl_1");
	let x = document.getElementsByClassName("close_1")[0];

	// make popup visible on click
	popup.style.visibility = "visible";
	popup.style.display = "block";

	x.onclick = function() {
		// popup closes when x is clicked
		popup.style.visibility = "hidden";
	}
}

function AddContact()
{
	readCookie();
	let addFN = document.getElementById("FirstName_contact").value;
	let addLN = document.getElementById("LastName_contact").value;
	let phoneNum = document.getElementById("PhoneNumber_contact").value;

	if (addFN.length <= 0 || addLN.length <= 0 || phoneNum.length <= 0)
	{
		// user left at least one field empty
	     	document.getElementById("AddContactResult").innerHTML = "Please Enter All fields";
	     	return;
	}

	let row = document.getElementById('contactsTable').insertRow();
	let numrow = document.getElementById('contactsTable').rows.length;

	let deleteIcon = "<i class='fa fa-trash'></i>";
	let editIcon = "<i class='fa fa-pencil'></i>";

	// add row to table with correct information
  	row.insertCell().innerHTML = addFN;
  	row.insertCell().innerHTML = addLN;
  	row.insertCell().innerHTML = phoneNum;
	row.insertCell().innerHTML = "<button class = 'ContactBtn editBtn' onclick='editContact(this)';>" + editIcon + "</button>"
	row.insertCell().innerHTML = "<button class = 'ContactBtn deletebtn' value='"
		+ ('Delete Row') + "' onclick='deleteContact(this)';>" + deleteIcon + "</button>";
	
	// now we add contact to database
	let tmp = {FirstName:addFN,LastName:addLN,PhoneNumber:phoneNum,UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("AddContactResult").innerHTML = "New contact registered";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("AddContactResult").innerHTML = err.message;
	}

}

function renderContactList()
{
  	readCookie();

  	let tmp = {UserID: userId};

	let jsonPayload = JSON.stringify( tmp ); //JSON file being sent to API is filled with tmp value taken from document

	let url = urlBase + '/RenderContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				// got contacts from database, now we add them to table for user to see
        			let userList = JSON.parse(xhr.responseText);

        			for (let i = 0; i < userList.Contacts.length; i++)
        			{
					// adds each row to contacts with each contact's information
          				let fn = (userList.Contacts[i].firstName);
          				let ln = (userList.Contacts[i].lastName);
          				let pn = (userList.Contacts[i].phoneNumber);

          				let deleteIcon = "<i class='fa fa-trash'></i>";
	        			let editIcon = "<i class='fa fa-pencil'></i>";
          				let textCell = "<div contenteditable='false' class='donotresize'>";
          				let row = document.getElementById('contactsTable').insertRow();

					row.insertCell().innerHTML = fn;
					row.insertCell().innerHTML = ln;
					row.insertCell().innerHTML = pn;
					row.insertCell().innerHTML = "<button class = 'ContactBtn editBtn' onclick='editContact(this)';>" + editIcon + "</button>"
					row.insertCell().innerHTML = "<button class = 'ContactBtn deletebtn' value='"
		      			+ ('Delete Row') + "' onclick='deleteContact(this)';>" + deleteIcon + "</button>";
        			}
			}
		};
    		xhr.send(jsonPayload);
	}
	catch(err)
	{
    		document.getElementById("userName").innerHTML = "Error Loading Contacts";
	}
}

function editContact(o)
{
	let elements = document.querySelectorAll("[contenteditable=true]");
  	let p = o.parentNode.parentNode; // row where button is

	for (let i = 0; i < elements.length; i++)
	{
		// resets all other rows so we don't have 2 rows editable at once
		elements[i].setAttribute("contenteditable", false);
		elements[i].style.border = "none";
		elements[i].style.borderTop= "solid black 0.5px";
	}

	// make rows editable and add borders so user can see which cells they can edit

  	oldfn = p.cells[0].innerHTML;
 	oldln = p.cells[1].innerHTML;
 	oldpn = p.cells[2].innerHTML;

	p.cells[0].setAttribute("contenteditable", true);
	p.cells[1].setAttribute("contenteditable", true);
  	p.cells[2].setAttribute("contenteditable", true);

	p.cells[0].style.border = "1px solid black";
	p.cells[1].style.border = "1px solid black";
  	p.cells[2].style.border = "1px solid black";

	// reset table when user clicks out of the container and saves changes made
	let container = document.getElementsByClassName('theContainerThatHoldsBothDivs')[0];
	document.addEventListener('click', function( event ) {
	if ( (container == event.target && container.contains(event.target)) ||
	 	((container !== event.target && !container.contains(event.target)) ) )
		{
			p.cells[0].setAttribute("contenteditable", false);
			p.cells[1].setAttribute("contenteditable", false);
     			p.cells[2].setAttribute("contenteditable", false);

			p.cells[0].style.border = "none";
			p.cells[1].style.border = "none";
      			p.cells[2].style.border = "none";

			p.cells[0].style.borderTop= "solid black 0.5px";
			p.cells[1].style.borderTop= "solid black 0.5px";
      			p.cells[2].style.borderTop= "solid black 0.5px";

      			updateContactBackend(o,oldfn,oldln,oldpn);
	  	}
	});
}

function updateContactBackend(o, oldfn, oldln, oldpn)
{
  	let p = o.parentNode.parentNode; // row that we just edited

	let tmp = {FirstName: oldfn, LastName: oldln, UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

        			tmp = {FirstName: p.cells[0].innerHTML,LastName: p.cells[1].innerHTML,ID: jsonObject[0][3],PhoneNumber: p.cells[2].innerHTML};

	      			jsonPayload = JSON.stringify( tmp ); //JSON file being sent to API is filled with tmp value taken from document

	      			url = urlBase + '/UpdateContact.' + extension;

				xhr = new XMLHttpRequest();
				xhr.open("POST", url, true);
				xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	      			try
	      			{
		      			xhr.onreadystatechange = function()
		      			{
			      			if (this.readyState == 4 && this.status == 200) //When http request has received a response
			      			{

		      				}
	      				};
          				xhr.send(jsonPayload);
      				}
      				catch(err)
      				{
          				document.getElementById("userName").innerHTML = "Error Loading Contacts";
	     			}

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function deleteContact(o)
{
 	let row = document.getElementById('contactsTable').insertRow();
  	var x = o.cellIndex; // Get the index of the cell
  	console.log(x);
  	console.log(row[x]);
	let p = o.parentNode.parentNode;
	let a = p.cells[2].innerText;

  	if (!(confirm("Are you sure you want to delete " + p.cells[0].innerText + "?"))) return;

	p.parentNode.removeChild(p);

	let tmp = {UserID:userId,PhoneNumber:a};

	let jsonPayload = JSON.stringify( tmp ); //JSON file being sent to API is filled with tmp value taken from document

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest(); //Assigning our http request objects
	xhr.open("POST", url, true); //Initializes a newly created request

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() //Event handler (Runs whenever anything happens in regards to this connection)
		{
			if (this.readyState == 4 && this.status == 200) //When http request has received a response
			{

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doLogin()
{

	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("username_login").value;//Grabs typed element from document by ID
	let password = document.getElementById("password_login").value;

   	if (login.length <= 0 || password.length <= 0)
    	{
      		document.getElementById("loginResult").innerHTML = "Please Enter Login & Password";
	 	return;
    	}

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:login,Password:password};

	let jsonPayload = JSON.stringify( tmp ); //JSON file being sent to API is filled with tmp value taken from document

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest(); //Assigning our http request objects
	xhr.open("POST", url, true); //Initializes a newly created request

	/*sets the value of an HTTP request header. When using setRequestHeader(),
	you must call it after calling open(), but before calling send().*/
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() //Event handler (Runs whenever anything happens in regards to this connection)
		{
			if (this.readyState == 4 && this.status == 200) //When http request has received a response
			{
				/*The JSON.parse() method parses a JSON string, constructing the
				JavaScript value or object described by the string.*/
				let jsonObject = JSON.parse( xhr.responseText ); //Grabbing json Response from API
				userId = jsonObject.id; //ID is the row number in the database

				if( userId < 1 ) //Failed to login
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");

		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function switchtoSignUp()
{
  window.location.href = "signUp.html";
}

function switchtoLogIn()
{
  window.location.href = "index.html";
}

function Register()
{

	firstName = document.getElementById("FirstName").value;
	lastName = document.getElementById("LastName").value;

	let PhoneNumber = document.getElementById("PhoneNumber").value;
	let Login = document.getElementById("Login").value;
	let Password = document.getElementById("Password").value;

	if (firstName.length <= 0 || lastName.length <= 0 || PhoneNumber.length <= 0 || Login.length <= 0 || Password.length <= 0)
   	{
     		document.getElementById("RegisteredPerson").innerHTML = "Please Enter All fields";
     		return;
   	}

	let tmp = {FirstName:firstName,LastName:lastName, PhoneNumber:PhoneNumber, Login:Login, Password:Password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("RegisteredPerson").innerHTML = "Welcome to SpaceBook!";

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("RegisteredPerson").innerHTML = err.message;
	}

}

function deleteTable(jsonObject)
{
	let table;

	for( let i=1; i<10; i++ )
	{
		table = document.getElementById("contactsTable").deleteRow(i);
		console.log("we hit for loop" + i);
	}
}

function searchContact()
{
	let searchParam = document.getElementById("Search_bar").value;

	/*Now we split our $searchParam string up by spaces and assign them to FirstName and LastName in our JSON file*/
	let arrParam = searchParam.split(" ");
	let tmp = {FirstName: arrParam[0], LastName: arrParam[1], UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  	let FNlist = [];

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				//Here we clear all contents of table by writing new html to the contacts table
				let table = document.getElementById("contactsTable");
				table.innerHTML = " <thead> <tr> <th>Contacts</th> <th></th> <th>Phone Number</th><th></th><th></th></tr></thead>"

				//Check to see if no search results were found
				if(jsonObject.length == 0)
				{
          				searchLastNames(false, FNlist);
					return;
				}

				for( let i=0; i<jsonObject.length; i++ )
				{
					//Creates a new row in html for us to insert data
          				FNlist.push(jsonObject[i][3]);
					let row = document.getElementById("contactsTable").insertRow();
					//row = row.insertRow();
					let htmldiv = "<div contenteditable='false' class='donotresize'>";
          				let deleteIcon = "<i class='fa fa-trash'></i>";
	        			let editIcon = "<i class='fa fa-pencil'></i>";

					//Here we grab the ith object of our query and access the firstname, lastname, and phonenumber
					let FirstName = jsonObject[i][0];
					let LastName = jsonObject[i][1];
					let PhoneNumber = jsonObject[i][2];
					//Now we insert our parameters one by one in each cell of the row
					row.insertCell().innerHTML = FirstName;
					row.insertCell().innerHTML = LastName;
					row.insertCell().innerHTML = PhoneNumber;
					row.insertCell().innerHTML = "<button class = 'ContactBtn editBtn' onclick='editContact(this)';>" + editIcon + "</button>"
	        			row.insertCell().innerHTML = "<button class = 'ContactBtn deletebtn' value='"
		      			+ ('Delete Row') + "' onclick='deleteContact(this)';>" + deleteIcon + "</button>";
				}
				if (arrParam[0] != "")
				{
					// we don't want to repeat the list if user is not searching
					searchLastNames(true, FNlist);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}

function searchLastNames(foundFN, FNlist)
{
  	console.log("Searching for Last Names");
  	let searchParam = document.getElementById("Search_bar").value;

	/*Now we split our $searchParam string up by spaces and assign them to FirstName and LastName in our JSON file*/
	let arrParam = searchParam.split(" ");
	let tmp = {FirstName: "", LastName: arrParam[0], UserID:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Search.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				//Here we clear all contents of table by writing new html to the contacts table
				let table = document.getElementById("contactsTable");

				//Check to see if no search results were found
				if(jsonObject.length == 0)
				{
					if (!foundFN)
          				{
					   	// we did not find matching first names or last names
					    	document.getElementById("contactsTable").insertRow(1).innerHTML = "no contacts found";
          				}
          				// we found matching first name but not last names
					return;
				}

				for( let i=0; i<jsonObject.length; i++ )
				{
          				if (FNlist.includes(jsonObject[i][3])) continue; // contact is already on table
					//Creates a new row in html for us to insert data

					let row = document.getElementById("contactsTable").insertRow();
					//row = row.insertRow();
					let htmldiv = "<div contenteditable='false' class='donotresize'>";
          				let deleteIcon = "<i class='fa fa-trash'></i>";
	        			let editIcon = "<i class='fa fa-pencil'></i>";

					//Here we grab the ith object of our query and access the firstname, lastname, and phonenumber
					let FirstName = jsonObject[i][0];
					let LastName = jsonObject[i][1];
					let PhoneNumber = jsonObject[i][2];
					//Now we insert our parameters one by one in each cell of the row
					row.insertCell().innerHTML = FirstName;
					row.insertCell().innerHTML = LastName;
					row.insertCell().innerHTML = PhoneNumber;
					row.insertCell().innerHTML = "<button class = 'ContactBtn editBtn' onclick='editContact(this)';>" + editIcon + "</button>"
	        			row.insertCell().innerHTML = "<button class = 'ContactBtn deletebtn' value='"
		      			+ ('Delete Row') + "' onclick='deleteContact(this)';>" + deleteIcon + "</button>";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}
