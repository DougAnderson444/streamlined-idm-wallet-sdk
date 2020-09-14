import createDidHyper, { getDid } from "js-did-hyper";
import {
  generateKeyPair,
  getKeyPairFromMnemonic,
  getKeyPairFromSeed,
} from "human-crypto-keys";
import { MissingDidParameters } from "../../../utils/errors";

class Hyperid {
  static info = {
    method: "hyper",
    description:
      "The Hyper-protocol DID method (IPID) supports DIDs on the hyper-protocol network.",
    homepageUrl: "https://github.com/DougAnderson444/js-did-hyper",
    icons: [],
  };

  #didHyperId;
  #Hyperdrive;

  constructor(Hyperdrive) {
    this.#Hyperdrive = Hyperdrive;
  }

  async getDid(params) {
    return getDid(params.drive);
  }

  async resolve(did) {
    await this.#assureDidHyper();

    return await this.#didHyperId.resolve(did);
  }

  async create(params, operations) {
    let backupData;

    if (
      params.backupData &&
      params.backupData.privateKey &&
      params.backupData.publicKey
    )
      backupData = { ...params.backupData };
    else backupData = await generateKeyPair("rsa");

    await this.#assureDidHyper();
        
    const didDocument = await this.#didHyperId.create(
      params.drive,
      (document) => {
        document.addPublicKey({
          id: "idm-master",
          type: "RsaVerificationKey2018",
          publicKeyPem: backupData.publicKey,
        });

        operations(document);
      }
    );

    return {
      did: didDocument.id,
      didDocument,
      backupData,
    }
}

  async update(did, params, operations) {
    
    await this.#assureDidHyper();

    const didDocument = await this.#didHyperId.update(params.drive, operations);

    return didDocument;
  }

  async isPublicKeyValid(did, publicKeyId) {
    const { publicKey = [] } = await this.resolve(did);

    return publicKey.some((key) => key.id === publicKeyId);
  }

  #assureDidHyper = async () => {
    if (!this.#didHyperId) {
      this.#didHyperId = await createDidHyper(this.#Hyperdrive);
    }
  };

  #getMasterPrivateKey = async (params) => {
    const { privateKey, mnemonic, seed, algorithm } = params || {};

    if (privateKey) {
      return privateKey;
    }

    if (seed) {
      const { privateKey } = await getKeyPairFromSeed(seed, algorithm || "rsa");

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

const createHyperid = (Hyperdrive) => new Hyperid(Hyperdrive);

export default createHyperid;
