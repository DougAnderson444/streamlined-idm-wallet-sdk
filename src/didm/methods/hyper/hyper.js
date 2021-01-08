import { createHyperDid, getDid } from "js-did-hyper";
import {
  getKeyPairFromMnemonic,
  getKeyPairFromSeed,
} from "human-crypto-keys";
import { MissingDidParameters } from "../../../utils/errors";

class Hyperid {
  static info = {
    method: 'hyper',
    description:
      'The Hyper-protocol DID method (Hypns) supports DIDs on the hyper-protocol multifeed network.',
    homepageUrl: 'https://github.com/DougAnderson444/js-did-hyper',
    icons: []
  }

  #didHyperId;
  #hyperNode;

  constructor (hyperNode) {
    this.#hyperNode = hyperNode
  }

  async getDid (params) {
    return getDid(params.hypnsInstance)
  }

  async resolve (did) {
    await this.#assureHyperId()

    return await this.#didHyperId.resolve(did)
  }

  async create (params, operations) {
    let backupData

    if (
      params.backupData &&
      params.backupData.privateKey &&
      params.backupData.publicKey
    ) {
      backupData = { ...params.backupData }
    } else {
      backupData.privateKey = this.#hyperNode.hcrypto.keyPair().publicKey
      backupData.publicKey = this.#hyperNode.hcrypto.keyPair().secretKey
    }

    await this.#assureHyperId()

    const didDocument = await this.#didHyperId.create(
      params.drive,
      (document) => {
        document.addPublicKey({
          id: 'idm-master',
          type: 'Ed25519VerificationKey2018',
          publicKeyHex: backupData.publicKey
        })

        operations(document)
      }
    )

    return {
      did: didDocument.id,
      didDocument,
      backupData
    }
  }

  async update(did, params, operations) {
    
    await this.#assureHyperId();

    const didDocument = await this.#didHyperId.update(params.hypnsInstance, operations);

    return didDocument;
  }

  async isPublicKeyValid(did, publicKeyId) {
    const { publicKey = [] } = await this.resolve(did);

    return publicKey.some((key) => key.id === publicKeyId);
  }

  #assureHyperId = async () => {
    if (!this.#didHyperId) {
      this.#didHyperId = await createHyperDid(this.#hyperNode);
    }
  };

  #getMasterPrivateKey = async (params) => {
    const { privateKey, mnemonic, seed, algorithm } = params || {};

    if (privateKey) {
      return privateKey;
    }

    if (seed) {
      // const { privateKey } = await getKeyPairFromSeed(seed, algorithm || "rsa");
      const publicKey = Buffer.allocUnsafe(sodium.crypto_sign_PUBLICKEYBYTES)
      const secretKey = Buffer.allocUnsafe(sodium.crypto_sign_SECRETKEYBYTES)
      this.#hyperNode.sodium.crypto_sign_seed_keypair(publicKey, secretKey, Buffer.from(seed, 'hex')) 

      return privateKey;
    }

    if (mnemonic) {
      const { privateKey } = await getKeyPairFromMnemonic(
        mnemonic,
        algorithm || "rsa"
      );

      return privateKey;
    }

    throw new MissingDidParameters(
      "Please specify the privateKey, seed or mnemonic"
    );
  };
}

const createHyperId = (node) => new HyperId(node)

export default createHyperId;
