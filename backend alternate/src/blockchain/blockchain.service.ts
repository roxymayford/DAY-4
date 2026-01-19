import { 
  Injectable, 
  InternalServerErrorException, 
  ServiceUnavailableException 
} from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE_ABI from './simple-storage.abi.json'; 

@Injectable()
export class BlockchainService {
  private client;
  // JANGAN LUPA: Pastikan alamat ini BENAR sesuai deploy Day 2 Anda!
  private contractAddress = "0xA85B42479b13759Ce6Bfa06762576e900a08b05E"; 

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });
  }

  // === READ LATEST VALUE ===
  async getLatestValue() {
    try {
      const value = await this.client.readContract({
        address: this.contractAddress,
        abi: SIMPLE_STORAGE_ABI,
        functionName: 'getValue',
      });
      return { value: value.toString() };
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // === GET EVENTS ===
  async getValueUpdatedEvents(fromBlock: number, toBlock: number) {
    try {
      const events = await this.client.getLogs({
        address: this.contractAddress,
        event: {
          type: 'event',
          name: 'ValueUpdated',
          inputs: [{ name: 'newValue', type: 'uint256', indexed: false }],
        },
        // Konversi ke BigInt (Wajib di Viem)
        fromBlock: BigInt(fromBlock),
        toBlock: BigInt(toBlock),
      });

      return events.map((event) => ({
        blockNumber: event.blockNumber?.toString(),
        transactionHash: event.transactionHash,
        newValue: event.args.newValue.toString(),
      }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  // === ERROR HANDLING (Kode Request Anda) ===
  private handleRpcError(error: any): never {
    const message = error?.message?.toLowerCase() || "";

    // Cek Timeout
    if (message.includes("timeout")) {
      throw new ServiceUnavailableException(
        "RPC timeout. Silakan coba beberapa saat lagi."
      );
    }

    // Cek Masalah Jaringan / Fetch
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("failed")
    ) {
      throw new ServiceUnavailableException(
        "Tidak dapat terhubung ke blockchain RPC."
      );
    }

    // Default Error (termasuk kalau rentang block > 2048)
    throw new InternalServerErrorException(
      "Terjadi kesalahan saat membaca data blockchain. Cek terminal untuk detail."
    );
  }
}