import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const hre = require("hardhat");

async function main() {
  // Deploy IncidentWasteLog
  const IncidentWasteLog = await hre.ethers.getContractFactory("IncidentWasteLog");
  const incidentWasteLog = await IncidentWasteLog.deploy();
  await incidentWasteLog.deployed();
  console.log("IncidentWasteLog deployed to:", incidentWasteLog.address);

  // Deploy MilestonePayments
  const MilestonePayments = await hre.ethers.getContractFactory("MilestonePayments");
  const milestonePayments = await MilestonePayments.deploy();
  await milestonePayments.deployed();
  console.log("MilestonePayments deployed to:", milestonePayments.address);

  // Update contract addresses in blockchain-listener/index.js
  console.log("\nUpdate these addresses in backend/blockchain-listener/index.js:");
  console.log(`const milestonePaymentsAddress = '${milestonePayments.address}';`);
  console.log(`const incidentWasteLogAddress = '${incidentWasteLog.address}';`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
