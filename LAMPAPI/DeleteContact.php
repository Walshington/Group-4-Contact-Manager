<?php
	$inData = getRequestInfo();
  $UserID = $inData["UserID"];
  $PhoneNumber = $inData["PhoneNumber"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID='$UserID' AND PhoneNumber = '$PhoneNumber'");
		#$stmt->bind_param("ssss", $FirstName, $LastName, $PhoneNumber, $UserID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Deleted contact");
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
