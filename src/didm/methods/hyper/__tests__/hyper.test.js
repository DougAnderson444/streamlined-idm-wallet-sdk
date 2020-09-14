import {
  mockDid,
  mockDocument,
  mockKeyPair,
  mockDidHyper,
  mockHumanCryptoKeys,
  mockBackupData,
  mockHyperdrive,
} from "./mocks";
import createDidHyper from "js-did-hyper";
import createHyperid from "../hyper";

jest.mock("js-did-hyper", () => {
  const { getDid, ...rest } = mockDidHyper;

  return {
    __esModule: true,
    getDid,
    default: jest.fn(() => rest),
  };
});

jest.mock("human-crypto-keys", () => mockHumanCryptoKeys);

beforeEach(() => {
  jest.clearAllMocks();
});

it("should have all supported methods", async () => {
  const hyperId = createHyperid();

  expect(typeof hyperId.getDid).toBe("function");
  expect(typeof hyperId.resolve).toBe("function");
  expect(typeof hyperId.create).toBe("function");
  expect(typeof hyperId.update).toBe("function");
  expect(typeof hyperId.isPublicKeyValid).toBe("function");
  expect(hyperId.constructor.info).toEqual({
    method: "hyper",
    description:
      "The Hyper-protocol DID method (IPID) supports DIDs on the hyper-protocol network.",
    homepageUrl: "https://github.com/DougAnderson444/js-did-hyper",
    icons: [],
  });
});

describe("getDid", () => {
  it("should get did of a given drive successfully", async () => {
    const hyperId = createHyperid();

    const did = await hyperId.getDid(mockHyperdrive);

    expect(did).toBe(mockDid);
    expect(mockDidHyper.getDid).toHaveBeenCalledWith(mockHyperdrive);
  });

  it("should support backups", async () => {
    //TODO
  });

  it("should support seeds", async () => {
    //TODO
  });

  it("should fail if params are missing", async () => {
    //TODO
  });
});

describe("resolve", () => {
  it("should resolve successfully", async () => {
    const hyperId = createHyperid(mockHyperdrive);

    const document = await hyperId.resolve(mockDid);

    expect(document).toEqual(mockDocument);
    expect(createDidHyper).toHaveBeenCalledWith(mockHyperdrive);
    expect(mockDidHyper.resolve).toHaveBeenCalledWith(mockDid);
  });

  it("should fail if did hyperId resolve is unsuccessful", async () => {
    const hyperId = createHyperid();

    mockDidHyper.resolve.mockImplementationOnce(() => {
      throw new Error("bar");
    });

    await expect(hyperId.resolve(mockDid)).rejects.toThrow("bar");
  });
});

describe("create", () => {
  it("should create successfully", async () => {
    const mockOperations = jest.fn();

    const hyperId = createHyperid();
    const { did, didDocument, backupData } = await hyperId.create(
      {},
      mockOperations
    );

    expect(mockDidHyper.create).toHaveBeenCalledTimes(1);
    expect(mockOperations).toHaveBeenCalledTimes(1);
    expect(did).toBe(mockDid);
    expect(didDocument).toEqual(mockDocument);
    expect(backupData).toEqual(backupData);
  });

  it("should fail if did-hyperId create is unsuccessful", async () => {
    expect.assertions(4);

    mockDidHyper.create.mockImplementationOnce(() => {
      throw new Error("bar");
    });

    const mockOperations = jest.fn();

    const hyperId = createHyperid();

    try {
      await hyperId.create({}, mockOperations);
    } catch (err) {
      expect(mockDidHyper.create).toHaveBeenCalledTimes(1);
      expect(mockOperations).toHaveBeenCalledTimes(0);
      expect(err.message).toBe("bar");
    }
  });
});

describe("update", () => {
  it("should update successfully", async () => {
    const mockOperations = jest.fn();
    const mockParams = { privateKey: mockKeyPair.privateKey };

    const hyperId = createHyperid();
    const didDocument = await hyperId.update(
      mockDid,
      mockParams,
      mockOperations
    );

    expect(mockDidHyper.update).toHaveBeenCalledWith(mockOperations);
    expect(mockOperations).toHaveBeenCalledTimes(1);
    expect(didDocument).toEqual(mockDocument);
  });

  it("should support mnemonics", async () => {
    // N/A to hyperdrive
  });

  it("should support seeds", async () => {
    // N/A to hyperdrive
  });

  it("should fail if did-hyperId update is unsuccessful", async () => {
    expect.assertions(3);

    mockDidHyper.update.mockImplementationOnce(() => {
      throw new Error("bar");
    });

    const mockOperations = jest.fn();
    const mockParams = { privateKey: mockKeyPair.privateKey };

    const hyperId = createHyperid();

    try {
      await hyperId.update(mockDid, mockParams, mockOperations);
    } catch (err) {
      expect(mockDidHyper.update).toHaveBeenCalledWith(
        mockOperations
      );
      expect(mockOperations).toHaveBeenCalledTimes(0);
      expect(err.message).toBe("bar");
    }
  });
});

describe("isPublicKeyValid", () => {
  it("should be successful if public key available in the document", async () => {
    mockDidHyper.resolve.mockImplementationOnce(() => ({
      ...mockDocument,
      publicKey: [{ id: "bar" }],
    }));

    const hyperId = createHyperid();
    const isValid = await hyperId.isPublicKeyValid(mockDid, "bar");

    expect(isValid).toBe(true);
    expect(mockDidHyper.resolve).toHaveBeenCalledWith(mockDid);
  });

  it("should fail if public key no available in the document", async () => {
    mockDidHyper.resolve.mockImplementationOnce(() => ({ ...mockDocument }));

    const hyperId = createHyperid();
    const isValid = await hyperId.isPublicKeyValid(mockDid, "bar");

    expect(isValid).toBe(false);
    expect(mockDidHyper.resolve).toHaveBeenCalledWith(mockDid);
  });

  it("should fail if resolve is unsuccessful", async () => {
    mockDidHyper.resolve.mockImplementationOnce(() => {
      throw new Error("bar");
    });

    const hyperId = createHyperid();

    await expect(hyperId.isPublicKeyValid(mockDid, "bar")).rejects.toThrow(
      "bar"
    );
  });
});

it("should use the same did-hyperId instance for multiple purposes", async () => {
  const hyperId = createHyperid({});

  await hyperId.resolve(mockDid);
  await hyperId.create({}, () => {});
  await hyperId.update(
    mockDid,
    { privateKey: mockKeyPair.privateKey },
    () => {}
  );

  expect(mockDidHyper.resolve).toHaveBeenCalledTimes(1);
  expect(mockDidHyper.create).toHaveBeenCalledTimes(1);
  expect(mockDidHyper.update).toHaveBeenCalledTimes(1);
});
