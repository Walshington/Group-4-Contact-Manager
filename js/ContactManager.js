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
	let addFN = document.getElementById("FirstName_contact").value;
	let addLN = document.getElementById("LastName_contact").value;
	let phoneNum = document.getElementById("PhoneNumber_contact").value;

	let row = document.getElementById('contactsTable').insertRow();
	let numrow = document.getElementById('contactsTable').rows.length;

	row.insertCell().innerHTML = addFN + " " + addLN;
	row.insertCell().innerHTML = phoneNum;
	row.insertCell().innerHTML = "<button class = 'ContactBtn editBtn';> Edit </button>"
	row.insertCell().innerHTML = "<button class = 'ContactBtn deletebtn' value='"
		+ ('Delete Row') + "' onclick='deleteContact(this)';> Delete </button>";
}

function editContact()
{

}

function deleteContact(o)
{
	let p = o.parentNode.parentNode;
	p.parentNode.removeChild(p);
}

function doLogin()
{

	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("username_login").value;//Grabs typed element from document by ID
	let password = document.getElementById("password_login").value;
//	var hash = md5( password );

   if (login.length <= 0 || password.length <= 0)
    {
       document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
	 	  return;
    }

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
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
		document.getElementById("userName").innerHTML = "Hello, " + firstName + " " + lastName;
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

function Register()
{
	firstName = document.getElementById("FirstName").value;
	lastName = document.getElementById("LastName").value;

	let PhoneNumber = document.getElementById("PhoneNumber").value;
	let Login = document.getElementById("Login").value;
	let Password = document.getElementById("Password").value;
	//document.getElementById("colorAddResult").innerHTML = "";

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
				document.getElementById("RegisteredPerson").innerHTML = "New Astronaut registered";

			}
      window.location.href = "contacts.html";
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("RegisteredPerson").innerHTML = err.message;
	}

}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}
