// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IncidentWasteLog {
    event IncidentReported(uint256 id, string description, address reporter, uint256 timestamp);
    event WasteLogged(uint256 id, string materialType, uint256 quantity, string site, address logger, uint256 timestamp);

    uint256 public incidentCount;
    uint256 public wasteLogCount;

    function reportIncident(string memory description) public {
        incidentCount++;
        emit IncidentReported(incidentCount, description, msg.sender, block.timestamp);
    }

    function logWaste(string memory materialType, uint256 quantity, string memory site) public {
        wasteLogCount++;
        emit WasteLogged(wasteLogCount, materialType, quantity, site, msg.sender, block.timestamp);
    }
}
