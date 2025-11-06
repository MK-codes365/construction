import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const hre = require("hardhat");

async function main() {
  console.log("Starting mainnet deployment...");
  console.log("Warning: This will deploy to Ethereum mainnet and cost real ETH!");
  
  // Confirm gas price is acceptable
  const gasPrice = await hre.ethers.provider.getGasPrice();
  const gasPriceGwei = hre.ethers.utils.formatUnits(gasPrice, "gwei");
  console.log(`Current gas price: ${gasPriceGwei} gwei`);
  
  // Deploy IncidentWasteLog
  console.log("\nDeploying IncidentWasteLog...");
  const IncidentWasteLog = await hre.ethers.getContractFactory("IncidentWasteLog");
  const incidentWasteLog = await IncidentWasteLog.deploy();
  await incidentWasteLog.deployed();
  console.log("IncidentWasteLog deployed to:", incidentWasteLog.address);

  // Deploy MilestonePayments
  console.log("\nDeploying MilestonePayments...");
  const MilestonePayments = await hre.ethers.getContractFactory("MilestonePayments");
  const milestonePayments = await MilestonePayments.deploy();
  await milestonePayments.deployed();
  console.log("MilestonePayments deployed to:", milestonePayments.address);

  // Verify contracts on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("\nVerifying contracts on Etherscan...");
    await hre.run("verify:verify", {
      address: incidentWasteLog.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: milestonePayments.address,
      constructorArguments: [],
    });
    console.log("Verification complete!");
  }

  // Save deployed addresses
  const fs = require('fs');
  const deploymentInfo = {
    network: "mainnet",
    incidentWasteLogAddress: incidentWasteLog.address,
    milestonePaymentsAddress: milestonePayments.address,
    deploymentDate: new Date().toISOString()
  };

  fs.writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment complete! Addresses saved to deployment.json");
  console.log("\nNext steps:");
  console.log("1. Update these addresses in your .env file");
  console.log("2. Update the blockchain listener configuration");
  console.log("3. Update your frontend configuration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });