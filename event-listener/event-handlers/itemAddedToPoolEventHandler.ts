import { ContractEvent, SmartContract, ThirdwebSDK } from '@thirdweb-dev/sdk';
import axios from 'axios';
import { Mumbai } from '@thirdweb-dev/chains';

class AddItemToPoolEventHandler {
  private contract: SmartContract = null as unknown as SmartContract;
  privateKey= '9bcdcecec956d01178a1320ff0cbe362eb59f8fe711642703b7419966320df52';
  provider = "https://frequent-blue-rain.matic-testnet.quiknode.pro/94409533db079166aa56645a5982e65b413ec6b3/";


  sdk = null as unknown as ThirdwebSDK;
  constructor(private contractAddress: string) {
    this.init();
  }

  private async init(): Promise<void> {
    this.sdk = await ThirdwebSDK.fromPrivateKey(this.privateKey, { ...Mumbai, rpc: [this.provider]});
    this.contract = await this.sdk.getContract(this.contractAddress);
    this.contract.events.addEventListener('ItemAddedToPool', this.onItemAddedToPool);
  }

  private onItemAddedToPool(event: ContractEvent): void {
    const { data } = event;

    const { itemId, poolId } = data;

    axios.post('http://localhost:3000/api/finish-add-item-to-pool-op', {
      itemId: Number(`${itemId._hex}`),
      poolId: Number(`${poolId._hex}`)
    }).catch(error => {
      console.error(`Error occurred when calling finish-add-item-to-pool-op API: ${error}`);
    });
  }
}

export { AddItemToPoolEventHandler };
