import { viem } from "hardhat";
import Artifact from "../artifacts/contracts/simple-storage.sol/SimpleStorage.json";
async function main() {
  // 1. Ambil Wallet Client (Signer)
  const [walletClient] = await viem.getWalletClients();

  // 2. Ambil Public Client (Read-only)
  const publicClient = await viem.getPublicClient();

  console.log("Deploying with account:", walletClient.account.address);

  // 3. Deploy Contract
  const hash = await walletClient.deployContract({
    abi: Artifact.abi,
    bytecode: Artifact.bytecode as `0x${string}`,
    args: [], // Isi jika constructor contract kamu butuh input
  });

  console.log("Deployment tx hash:", hash);

  // 4. Tunggu Konfirmasi (Receipt)
  const receipt = await publicClient.waitForTransactionReceipt({
    hash,
  });

  console.log("✅ SimpleStorage deployed at:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});