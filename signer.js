// https://cryptonomic.github.io/ConseilJS/#/?id=use-with-nodejs
import fetch from 'node-fetch';
import loglevel from 'loglevel';

const {getLogger} = loglevel;

const logger = getLogger("conseiljs");
logger.setLevel('debug', false); // to see only errors, set to 'error'

import pkg from '@tacoinfra/conseil-kms';

const {KmsKeyStore, KmsSigner} = pkg;
import {registerFetch, registerLogger, TezosNodeWriter} from 'conseiljs';

import { KeyStoreUtils } from 'conseiljs-softsigner';

registerLogger(logger);
registerFetch(fetch);

const AWS_KEY_ID = process.env.AWS_KEY_ID || 'X';
const AWS_REGION = process.env.AWS_REGION || 'eu-west-1';
const NODE_ENDPOINT = process.env.NODE_ENDPOINT || 'https://granadanet.smartpy.io/'

const signer = new KmsSigner(AWS_KEY_ID, AWS_REGION)
const keystore = await KmsKeyStore.from(AWS_KEY_ID, AWS_REGION)

console.log({keystore})

export async function transaction() {
    const result = await TezosNodeWriter.sendTransactionOperation(
        NODE_ENDPOINT,
        signer,
        keystore,
        'tz1RVcUP9nUurgEJMDou8eW3bVDs6qmP5Lnc',     // Recipient
        500_000,                                    // Amount, in mutez
        1500                                        // Fee, in mutez
    )
}

export async function apply() {
    const result = await TezosNodeWriter.sendOperation(
        NODE_ENDPOINT,
        signer,
        keystore,
        'tz1RVcUP9nUurgEJMDou8eW3bVDs6qmP5Lnc',     // Recipient
        500_000,                                    // Amount, in mutez
        1500                                        // Fee, in mutez
    )
}

export default signer

export async function activateAccount() {
    //not necessary
    // https://tezos.stackexchange.com/questions/2151/what-activate-reveal-an-account-refer-to
    const result = await TezosNodeWriter.sendIdentityActivationOperation(
        NODE_ENDPOINT,
        signer,
        keystore,
    );
    console.log(`Injected operation group id ${result.operationGroupID}`)
}

export async function revealAccount() {
    // const res = await TezosNodeWriter.appendRevealOperation(NODE_ENDPOINT, signer);
    // console.log({res})
    const result = await TezosNodeWriter.sendKeyRevealOperation(NODE_ENDPOINT, signer, keystore);
    console.log({result})
    console.log(`Injected operation group id ${result.operationGroupID}`);
}

export async function createAccount() {
    const mnemonic = KeyStoreUtils.generateMnemonic();
    console.log(`mnemonic: ${mnemonic}`);
    const keystorebis = await KeyStoreUtils.restoreIdentityFromMnemonic(mnemonic, '');
    console.log(`account id: ${keystorebis.publicKeyHash}`);
    console.log(`public key: ${keystorebis.publicKey}`);
    console.log(`secret key: ${keystorebis.secretKey}`);
    console.log({keystorebis})
    const result = await TezosNodeWriter.sendIdentityActivationOperation(NODE_ENDPOINT, signer, keystore, '0a09075426ab2658814c1faf101f53e5209a62f5');
    console.log(`Injected operation group id ${result.operationGroupID}`)
}
