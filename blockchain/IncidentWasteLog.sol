// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IncidentWasteLog {
    struct Incident {
        uint256 id;
        string description;
        address reporter;
        uint256 timestamp;
    }
    struct WasteLog {
        uint256 id;
        string materialType;
        uint256 quantity;
        string site;
        address logger;
        uint256 timestamp;
    }

    Incident[] public incidents;
    WasteLog[] public wasteLogs;

    event IncidentReported(uint256 id, string description, address reporter, uint256 timestamp);
    event WasteLogged(uint256 id, string materialType, uint256 quantity, string site, address logger, uint256 timestamp);

    function reportIncident(string memory description) public {
        uint256 id = incidents.length;
        incidents.push(Incident(id, description, msg.sender, block.timestamp));
        emit IncidentReported(id, description, msg.sender, block.timestamp);
    }

    function logWaste(string memory materialType, uint256 quantity, string memory site) public {
        uint256 id = wasteLogs.length;
        wasteLogs.push(WasteLog(id, materialType, quantity, site, msg.sender, block.timestamp));
        emit WasteLogged(id, materialType, quantity, site, msg.sender, block.timestamp);
    }

    function getIncident(uint256 id) public view returns (Incident memory) {
        require(id < incidents.length, "Invalid incident id");
        return incidents[id];
    }

    function getWasteLog(uint256 id) public view returns (WasteLog memory) {
        require(id < wasteLogs.length, "Invalid waste log id");
        return wasteLogs[id];
    }

    function getIncidentCount() public view returns (uint256) {
        return incidents.length;
    }

    function getWasteLogCount() public view returns (uint256) {
        return wasteLogs.length;
    }
}
