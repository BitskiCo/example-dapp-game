pragma solidity ^0.4.19;

import "./MintableNonFungibleToken.sol";

/**
 * @title LimitedMintableNonFungibleToken
 *
 * Superset of the ERC721 standard that allows for the minting
 * of non-fungible tokens, but limited to n tokens.
 */
contract LimitedMintableNonFungibleToken is MintableNonFungibleToken {
    uint public mintLimit;

    function LimitedMintableNonFungibleToken(uint _mintLimit) public {
        mintLimit = _mintLimit;
    }

    function mint(uint256 _tokenId) public onlyNonexistentToken(_tokenId) {
        require(ownerToTokensOwned[msg.sender].length < mintLimit);

        _setTokenOwner(_tokenId, msg.sender);
        _addTokenToOwnersList(msg.sender, _tokenId);

        numTokensTotal = numTokensTotal.add(1);

        Mint(msg.sender, _tokenId);
    }
}
