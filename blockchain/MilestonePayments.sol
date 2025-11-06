// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MilestonePayments {
    address public client;
    address public contractor;
    uint256 public totalAmount;
    uint256 public milestoneCount;
    mapping(uint256 => uint256) public milestoneAmounts;
    mapping(uint256 => bool) public milestoneCompleted;
    mapping(uint256 => bool) public milestonePaid;

    event MilestoneMarkedComplete(uint256 milestoneId);
    event MilestonePaid(uint256 milestoneId, uint256 amount, address contractor);

    constructor(address _contractor, uint256 _totalAmount, uint256[] memory _amounts) {
        client = msg.sender;
        contractor = _contractor;
        totalAmount = _totalAmount;
        milestoneCount = _amounts.length;
        for (uint256 i = 0; i < _amounts.length; i++) {
            milestoneAmounts[i] = _amounts[i];
        }
    }

    function markMilestoneComplete(uint256 milestoneId) public {
        require(msg.sender == contractor, "Only contractor can mark complete");
        require(!milestoneCompleted[milestoneId], "Already completed");
        milestoneCompleted[milestoneId] = true;
        emit MilestoneMarkedComplete(milestoneId);
    }

    function payMilestone(uint256 milestoneId) public payable {
        require(msg.sender == client, "Only client can pay");
        require(milestoneCompleted[milestoneId], "Milestone not completed");
        require(!milestonePaid[milestoneId], "Already paid");
        require(msg.value == milestoneAmounts[milestoneId], "Incorrect amount");
        milestonePaid[milestoneId] = true;
        payable(contractor).transfer(msg.value);
        emit MilestonePaid(milestoneId, msg.value, contractor);
    }
}
