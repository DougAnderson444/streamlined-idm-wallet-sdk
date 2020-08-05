import createSecret from "./secret";
import createDidm from "./didm";
import createStorage from "./storage";
import createIdentities from "./identities";
import createSessions from "./sessions";
import createLocker from "./locker";
import { UnavailableIpfsError } from "./utils/errors";

const createIpfs = async (ipfs) => {
  if (ipfs) {
    if (typeof ipfs.isOnline === "function" && !ipfs.isOnline()) {
      throw new UnavailableIpfsError();
    }

    return ipfs;
  }
};

const createWallet = async (options) => {

  options = {
    ipfs: undefined,
    ...options,
  };

  const ipfs = await createIpfs(options.ipfs);
  const secret = createSecret(); // Secret Object
  const didm = createDidm(ipfs, options.apiMultiAddr, options.wsMultiAddr); // creates IPID methods
  const storage = await createStorage(secret); // LevelDB with encrypt wrapper
  const identities = createIdentities(storage, didm, ipfs); // OrbitDB
  const sessions = await createSessions(storage, identities);
  const locker = await createLocker(storage, secret);
  
  const idmWallet = {
    ipfs,
    didm,
    storage,
    locker,
    identities,
    sessions,
  };

  return idmWallet;
};

export default createWallet;
