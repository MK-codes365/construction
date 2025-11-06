// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MilestonePayments {
    event MilestoneMarkedComplete(uint256 milestoneId);
    event MilestonePaid(uint256 milestoneId, uint256 amount, address contractor);

    function markMilestoneComplete(uint256 milestoneId) public {
        emit MilestoneMarkedComplete(milestoneId);
    }

    function payMilestone(uint256 milestoneId, uint256 amount, address contractor) public {
        emit MilestonePaid(milestoneId, amount, contractor);
    }
}
