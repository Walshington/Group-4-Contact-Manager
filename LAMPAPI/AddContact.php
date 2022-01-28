<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
    	$LastName = $inData["LastName"];
    	$PhoneNumber = $inData["PhoneNumber"];
    	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,PhoneNumber,UserID) VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $FirstName, $LastName, $PhoneNumber, $UserID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Successfully added new contact");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
