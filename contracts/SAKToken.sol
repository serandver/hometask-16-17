// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SAKToken is ERC20 {

    constructor() ERC20("SAK Token", "SAK") {
        _mint(msg.sender, 4_300_000 * 10**8);
    }

    function decimals() public view override returns (uint8) {
        return 8;
    }
}