pragma solidity ^0.4.19;

import "./NonFungibleToken.sol";
import "./SafeMath.sol";


/**
 * @title MintableNonFungibleToken
 *
 * Superset of the ERC721 standard that allows for the minting
 * of non-fungible tokens.
 */
contract MintableNonFungibleToken is NonFungibleToken {
    using SafeMath for uint;

    event Mint(address indexed _to, uint256 indexed _tokenId);

    modifier onlyNonexistentToken(uint _tokenId) {
        require(tokenIdToOwner[_tokenId] == address(0));
        _;
    }

    function mint(address _owner, uint256 _tokenId)
        internal
        onlyNonexistentToken(_tokenId)
    {
        _setTokenOwner(_tokenId, _owner);
        _addTokenToOwnersList(_owner, _tokenId);

        numTokensTotal = numTokensTotal.add(1);

        Mint(_owner, _tokenId);
    }
}
