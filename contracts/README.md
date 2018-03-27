# Contracts

## ERC721

For our DApp, we are going to be creating individual characters to use in a future game. Since we want each of these characters to be unique we are goint to be useing the [ERC721](https://github.com/ethereum/EIPs/issues/721) standard.

We have borrowed some code for an ERC721 token and placed it in ```contracts``` but we want to be able to get tokens right awway to play with so we have extended it with [LimitedMintableNonFungibleToken](LimitedMintableNonFungibleToken.sol) which allow people to "mint" up to ```n``` tokens. This will allow users to play with the contract without involving a third party.