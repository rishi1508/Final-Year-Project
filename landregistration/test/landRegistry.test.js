const LandRegistry = artifacts.require("LandRegistry");

contract("LandRegistry", accounts => {
  it("should register a land", async () => {
    const landRegistry = await LandRegistry.deployed();
    await landRegistry.registerLand("Location A", 100, { from: accounts[0] });
    const land = await landRegistry.lands(1);
    assert.equal(land.id, 1);
    assert.equal(land.location, "Location A");
    assert.equal(land.size, 100);
    assert.equal(land.owner, accounts[0]);
  });

  it("should transfer a land", async () => {
    const landRegistry = await LandRegistry.deployed();
    await landRegistry.registerLand("Location B", 200, { from: accounts[1] });
    await landRegistry.transferLand(2, accounts[2], { from: accounts[1] });
    const land = await landRegistry.lands(2);
    assert.equal(land.owner, accounts[2]);
  });
});