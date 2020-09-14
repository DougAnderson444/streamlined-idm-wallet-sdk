export const mockKey =
  "BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD";
  
  export const mockDocument = {
    '@context': 'https://w3id.org/did/v1',
    id: 'did:hyper:BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD',
    created: '2019-03-19T16:52:44.948Z',
    updated: '2019-03-19T16:53:56.463Z',
};

export const mockDid = 'did:hyper:BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD';

export const mockDidHyper = {
    getDid: jest.fn(async () => mockDid),
    resolve: jest.fn(async () => mockDocument),
    create: jest.fn(async (privateKey, operations) => {
        operations({
            addPublicKey: () => {},
            revokePublicKey: () => {},
        });

        return mockDocument;
    }),
    update: jest.fn(async (privateKey, operations) => {
        operations();

        return mockDocument;
    }),
};

export const mockBackupData = {
    mnemonic: 'mockMnemonic',
    seed: new Uint8Array(Buffer.from('mockSeed')),
    privateKey: 'mockPrivateKey',
    publicKey: 'mockPublicKey',
};

export const mockKeyPair = {
    privateKey: mockBackupData.privateKey,
    publicKey: mockBackupData.publicKey,
};

export const mockHumanCryptoKeys = {
    generateKeyPair: jest.fn(async () => mockBackupData),
    getKeyPairFromMnemonic: jest.fn(async () => mockKeyPair),
    getKeyPairFromSeed: jest.fn(async () => mockKeyPair),
};

export const mockHyperdrive = (identifier)=>{

    return {
        ready: jest.fn(async () => {
          return { call: new Promise((resolve, reject) => resolve()) };
        }),
        writable: true,
        peers: ["mockPeer1", "mockPeer2"],
        key: mockKey,
        readFile: jest.fn(async () => mockDocument),
        writeFile: jest.fn(async (fileName, content) => {
          mockFileName = fileName;
          mockFileWriteContent = content;
        }),
      };
}

