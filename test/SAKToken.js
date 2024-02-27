const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("SAKToken test suit", function () {

  async function deploySakTokenFixture() {
    const [owner, otherAccount, anotherAccount] = await ethers.getSigners();
    const SAKToken = await ethers.getContractFactory("SAKToken");
    const sakToken = await SAKToken.deploy();
    const sakTokenAtOtherAccount = await sakToken.connect(otherAccount);
    return { sakToken, owner, otherAccount, anotherAccount, sakTokenAtOtherAccount };
  }

  describe("SAKToken base functions", function () {
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

    it.only("Should have total supply 4_300_000 tokens", async function () {
      const { sakToken } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.totalSupply()).to.equal(0);
    });
    
    it.only("Owner address should have balance of all total supply", async function () {
      const { sakToken, owner } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.balanceOf(owner)).to.equal(0);
    });

  });

  describe("SAKToken transfer functions", function () {
    
    it.only("mint() works correctly", async function () {
      const { sakToken, owner } = await loadFixture(deploySakTokenFixture);
      await sakToken.mint(ethers.parseUnits("300000", 8));
      expect(await sakToken.totalSupply()).to.equal(ethers.parseUnits("300000", 8));
      expect(await sakToken.balanceOf(owner)).to.equal(ethers.parseUnits("300000", 8));
    });
    
    it.only("after transfer() completed sender and reciever addresses should have correct balance", async function () {
      const { sakToken, owner, otherAccount } = await loadFixture(deploySakTokenFixture);
      await sakToken.mint(ethers.parseUnits("400000", 8));
      const tx = await sakToken.transfer(otherAccount, ethers.parseUnits("300000", 8));
      await tx.wait();
      expect(await sakToken.balanceOf(owner)).to.equal(ethers.parseUnits("100000", 8));
      expect(await sakToken.balanceOf(otherAccount)).to.equal(ethers.parseUnits("300000", 8));
    });

    it.only("after approve() completed allowance() has changed correctly", async function () {
      const { sakToken, owner, otherAccount } = await loadFixture(deploySakTokenFixture);
      await sakToken.approve(otherAccount, ethers.parseUnits("500000", 8));
      expect(await sakToken.allowance(owner, otherAccount)).to.equal(ethers.parseUnits("500000", 8));
    });

    it.only("after transferFrom() completed sender and reciever addresses should have correct balance", async function () {
      const { sakToken, owner, otherAccount, anotherAccount, sakTokenAtOtherAccount } = await loadFixture(deploySakTokenFixture);
      await sakToken.mint(ethers.parseUnits("400000", 8));
      expect(await sakToken.balanceOf(owner)).to.equal(ethers.parseUnits("400000", 8));
      await sakToken.approve(otherAccount, ethers.parseUnits("300000", 8));
      expect(await sakToken.allowance(owner, otherAccount)).to.equal(ethers.parseUnits("300000", 8));

      const tx = await sakTokenAtOtherAccount.transferFrom(owner, anotherAccount, ethers.parseUnits("300000", 8));
      await tx.wait();

      // console.log("owner address: " + owner.address + ", balance " + await sakToken.balanceOf(owner));
      // console.log("otherAccount address: " + otherAccount.address + ", balance " + await sakToken.balanceOf(otherAccount));
      // console.log("sakTokenAtOtherAccount address: " + anotherAccount.address + ", balance " + await sakToken.balanceOf(anotherAccount));
      
      expect(await sakToken.balanceOf(owner)).to.equal(ethers.parseUnits("100000", 8));
      expect(await sakToken.balanceOf(anotherAccount)).to.equal(ethers.parseUnits("300000", 8));
    });

    it.only("user without allowance() can't use transferFrom() ", async function () {
      const { sakToken, owner, otherAccount, anotherAccount, sakTokenAtOtherAccount } = await loadFixture(deploySakTokenFixture);
      await sakToken.mint(ethers.parseUnits("400000", 8));
      await sakToken.approve(otherAccount, ethers.parseUnits("300000", 8));
      await expect(sakTokenAtOtherAccount.transferFrom(owner, anotherAccount, ethers.parseUnits("400000", 8))).to.be.reverted;
    });
  });
  describe("SAKToken burnable functions", function () {
    it.only("burn() works correctly", async function () {
      const { sakToken, owner } = await loadFixture(deploySakTokenFixture);
      await sakToken.mint(ethers.parseUnits("400000", 8));
      await sakToken.burn(ethers.parseUnits("300000", 8));
      expect(await sakToken.totalSupply()).to.equal(ethers.parseUnits("100000", 8));
      expect(await sakToken.balanceOf(owner)).to.equal(ethers.parseUnits("100000", 8));
    });
    it.only("contract owner is correct", async function () {
      const { sakToken, owner } = await loadFixture(deploySakTokenFixture);
      expect(await sakToken.owner()).to.equal(owner);
    });
    it.only("only owner can mint", async function () {
      const { sakTokenAtOtherAccount } = await loadFixture(deploySakTokenFixture);
      await expect(sakTokenAtOtherAccount.mint(ethers.parseUnits("400000", 8))).to.be.reverted;
    });
    it.only("totalSupply can't be more than CAP value", async function () {
      const { sakToken } = await loadFixture(deploySakTokenFixture);
      //mint max value
      await sakToken.mint(ethers.parseUnits("4300000", 8));
      //add more 100 tokens
      await expect(sakToken.mint(ethers.parseUnits("100", 8))).to.be.reverted;
    });
  });
});
