import { SmartContract, ThirdwebSDK } from '@thirdweb-dev/sdk';
import { Mumbai } from '@thirdweb-dev/chains';

//todo Ajustar essa classe
export class BlockchainHelper {
  privateKey= '9bcdcecec956d01178a1320ff0cbe362eb59f8fe711642703b7419966320df52';
  provider = "https://frequent-blue-rain.matic-testnet.quiknode.pro/94409533db079166aa56645a5982e65b413ec6b3/";


  sdk = null as unknown as ThirdwebSDK;

  async connect(): Promise<void> {
    this.sdk = await ThirdwebSDK.fromPrivateKey(this.privateKey, { ...Mumbai, rpc: [this.provider]});
  }

  async getContract(address: string): Promise<SmartContract> {
    return await this.sdk.getContract(address);
  }
}
