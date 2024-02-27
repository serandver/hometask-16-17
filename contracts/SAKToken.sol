// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";


contract SAKToken is ERC20Burnable, Ownable, ERC20Capped {
    
    uint8 private DECIMALS = 8;
    uint256 private immutable CAP = 4_300_000;
    string private TOKEN_NAME = "SAK Token";
    string private TOKEN_SYMBOL = "SAK";
    mapping(address account => uint256) private _balances;
    uint256 private _totalSupply;

    constructor() ERC20(TOKEN_NAME, TOKEN_SYMBOL) ERC20Capped(CAP * 10**decimals()) Ownable(msg.sender){
        
    }

    function decimals() public view override returns (uint8) {
        return DECIMALS;
    }

    function mint(uint256 tokenNumber) public onlyOwner {
        _mint(owner(), tokenNumber);
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Capped)  {
        super._update(from, to, value);

        if (from == address(0)) {
            uint256 maxSupply = cap();
            uint256 supply = totalSupply();
            if (supply > maxSupply) {
                revert ERC20ExceededCap(supply, maxSupply);
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to] += value;
            }
        }

        emit Transfer(from, to, value);
    }
}