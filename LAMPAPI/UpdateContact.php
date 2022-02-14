<?php
	$inData = getRequestInfo();

	$FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $PhoneNumber = $inData["PhoneNumber"];
    $ID = $inData["ID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName='$FirstName', LastName='$LastName', PhoneNumber='$PhoneNumber' WHERE ID='$ID'");
    #$stmt->bind_param("sssi", $FirstName, $LastName, $PhoneNumber, $ID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Updated Contact");
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
