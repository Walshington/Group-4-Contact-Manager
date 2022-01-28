<?php
	$inData = getRequestInfo();
	
    /*Grabbing information sent from front end*/
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
    $PhoneNumber = $inData["PhoneNumber"];
    $Login = $inData["Login"];
    $Password = $inData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,PhoneNumber,Login,Password) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $FirstName, $LastName, $PhoneNumber, $Login, $Password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
        returnWithInfo($FirstName, $LastName, $PhoneNumber, $Login, $Password);
	}

    function returnWithInfo( $FirstName, $LastName, $PhoneNumber, $Login, $Password )
	{
		$retValue = '{"FirstName":"' . $FirstName . '","LastName":"' . $LastName . '","PhoneNumber":"' . $PhoneNumber . '","Login":"' . $Login . '","Password":"' . $Password . '","error":""}';
		sendResultInfoAsJson( $retValue );
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