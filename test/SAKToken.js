const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("SAKToken", function () {

  async function deploySakTokenFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const SAKToken = await ethers.getContractFactory("SAKToken");
    const sakToken = await SAKToken.deploy();

    return { sakToken, owner, otherAccount };
  }

  describe("SAKToken", function () {
    it.only("Should have correct name - SAK Token", async function () {
      const { sakToken } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.name()).to.equal("SAK Token");
    });

    it.only("Should have correct symbol - SAK", async function () {
      const { sakToken } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.symbol()).to.equal("SAK");
    });

    it.only("Should have correct decimals - 8", async function () {
      const { sakToken } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.decimals()).to.equal(8);
    });

    it.only("Should have total supply - 430 000 000 000 000", async function () {
      const { sakToken, owner } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.totalSupply()).to.equal(4_300_000 * 10**8);
    });
    
    it.only("Owner address should have balance of all total supply", async function () {
      const { sakToken, owner } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.balanceOf(owner)).to.equal(4_300_000 * 10**8);
    });
  });
});
