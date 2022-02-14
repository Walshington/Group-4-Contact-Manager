
<?php

	$inData = getRequestInfo();

	$UserID = 0;
	$FirstName = "";
	$LastName = "";

	//Opens a connection to the MySQL database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		/*
		The search parameters provided by the user are concatenated with %
		(We need % to tell MySQL to search the database for first and last names starting with either  *****We should change this to search by start of string instead
		Parameter markers are bound to application variables $FirstNameSearch, $LastNameSearch, and $UserID using bind_param()
		*/
		$FirstNameSearch =  $inData['FirstName'] . '%';
		$LastNameSearch =  $inData['LastName'] . '%';
		$UserID = $inData['UserID'];

		/*Here we will search for contacts by first or last name. The query will grab all rows containing firstnames and lastnames according to the substring
		provided as each of their search parameters*/
		$stmt = $conn->prepare("SELECT FirstName , LastName, PhoneNumber, ID FROM Contacts WHERE FirstName LIKE ? AND LastName LIKE ? AND UserID=?");
		$stmt->bind_param("ssi", $FirstNameSearch, $LastNameSearch, $UserID);
		$stmt->execute();

        /*Fetches the data from our MySQLI object and assigns it to $result. If this variable assignment follows through
		the if statement executes (We are checking if we got any results from the query). Then we fetch all rows specified by
		our query and asisgn them to the $SearchData object and send them as a JSON file to the frontend*/
		if($result = $stmt->get_result())
		{
			$SearchData = $result->fetch_all();
			returnWithInfo($SearchData);
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithInfo( $SearchArray )
	{
		$retValue = json_encode($SearchArray);
		sendResultInfoAsJson( $retValue );
	}

?>
