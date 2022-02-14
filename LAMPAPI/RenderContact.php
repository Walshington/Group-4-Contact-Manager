<?php

	$inData = getRequestInfo();
  $UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
   	$stmt = $conn->prepare("Select FirstName, LastName, PhoneNumber From Contacts where UserID=?");
    $stmt->bind_param("i", $UserID);
    $stmt->execute();

    /*
    if($result = $stmt->get_result())
    {
      $AllContacts = $result->fetch_all();
      returnWithInfo($AllContacts);
    }
    else
		{
			returnWithError("No Records Found");
		}


    $stmt->close();
		$conn->close();
  }
  */

  $result = $stmt->get_result();

		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"phoneNumber":' . $row["PhoneNumber"] . ',"firstName":"' . $row["FirstName"] . '","lastName":"' . $row["LastName"] . '","error":""}';

		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
		$conn->close();
	}


  function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}


 /*
  function returnWithInfo( $SearchArray )
	{
		$retValue = json_encode($SearchArray);
		sendResultInfoAsJson( $retValue );
	}
 */

 function returnWithInfo( $searchResults )
	{
		$retValue = '{"Contacts":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

 	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
?>
