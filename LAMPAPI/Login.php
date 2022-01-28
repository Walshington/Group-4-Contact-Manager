
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	//Opens a connection to the MySQL database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		/*
		Prepares the SQL query, and returns a statement handle to be used 
		for further operations on the statement 
		*/
		$stmt = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?"); 

		/*
		 The parameter markers must be bound to application variables using 
		 mysqli_stmt_bind_param() before executing the statement. s being type String
         and assigning the login and password to the question marks in $conn->prepare
		*/
		$stmt->bind_param("ss", $inData["Login"], $inData["Password"]);
        /*Executes MySQL statement searching for first and last name based
        on the login and password of the user*/
		$stmt->execute(); 
        /*Gets a result set from a prepared statement as a mysqli_result object*/
		$result = $stmt->get_result();

        /*Fetches the associate array related to the row of data in MySQL 
        and assigns it to $row. If this variable assignment follows through
         the if statement executes*/
		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
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

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
