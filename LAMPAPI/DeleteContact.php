<?php
	$inData = getRequestInfo();
  $ID = $inData["ID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID='$ID'");
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
