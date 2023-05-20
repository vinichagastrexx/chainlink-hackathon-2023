import { AddItemToPoolEventHandler } from './event-handlers/itemAddedToPoolEventHandler';

const eventListener = async () => {
   new AddItemToPoolEventHandler('0x36C051246B4004AdA8fFFE857afd42921e943e0A');
};

eventListener().then(() =>  console.log("Listener Up"));