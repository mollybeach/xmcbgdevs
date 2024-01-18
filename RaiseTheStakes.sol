// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RaiseTheStakes {
    struct PlayerInfo {
        uint256 ranking;
        uint256 rewardPercentage;
        uint256 stake;
        uint256 items;
    }

    // Mapping of player addresses to their PlayerInfo struct
    mapping(address => PlayerInfo) public players;

    // Merkle root of the players data
    bytes32 public merkleRoot;

    // Mapping of player addresses to their Merkle leaf hash
    mapping(address => bytes32) public playerLeafHashes;

    // Event triggered when a player's data is updated
    event PlayerUpdate(
        address indexed player,
        uint256 ranking,
        uint256 rewardPercentage,
        uint256 stake,
        uint256 items
    );
    event PlayerUpdateRanking(address indexed player, uint256 ranking);
    event PlayerUpdateRewardPercentage(address indexed player, uint256 rewardPercentage);
    event PlayerUpdateStake(address indexed player, uint256 stake);
    event PlayerUpdateItems(address indexed player, uint256 items);

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    // Function to add new player
    function addPlayer(
        address _player,
        uint256 _rewardPercentage,
        uint256 _stake,
        uint256 _items
    ) public {
        PlayerInfo memory newPlayer = PlayerInfo({
            ranking: 0,
            rewardPercentage: _rewardPercentage,
            stake: _stake,
            items: _items
        });

        players[_player] = newPlayer;

        // Calculate the Merkle leaf hash for the new player and store it
        bytes32 leafHash = calculateLeafHash(newPlayer);
        playerLeafHashes[_player] = leafHash;

        // Emit an event indicating the player's data has been updated
        emit PlayerUpdate(_player, newPlayer.ranking, newPlayer.rewardPercentage, newPlayer.stake, newPlayer.items);
    }

    // Function to update a player's ranking
    function updatePlayerRanking(address _player, uint256 _ranking) public {
        // Check if the player exists
        require(playerLeafHashes[_player] != bytes32(0), "Player does not exist");

        // Update the player's ranking
        players[_player].ranking = _ranking;

        // Recalculate the Merkle leaf hash for the updated player
        bytes32 leafHash = calculateLeafHash(players[_player]);
        playerLeafHashes[_player] = leafHash;

        // Emit an event indicating the player's ranking has been updated
        emit PlayerUpdateRanking(_player, _ranking);
        emit PlayerUpdate(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake,     
        players[_player].items);
    }

    // Function to update a player's reward percentage
    function updatePlayerRewardPercentage(address _player, uint256 _rewardPercentage) public {
        // Check if the player exists
        require(playerLeafHashes[_player] != bytes32(0), "Player does not exist");

        // Update the player's reward percentage
        players[_player].rewardPercentage = _rewardPercentage;

        // Recalculate the Merkle leaf hash for the updated player
        bytes32 leafHash = calculateLeafHash(players[_player]);
        playerLeafHashes[_player] = leafHash;

        // Emit an event indicating the player's reward percentage has been updated
        emit PlayerUpdateRewardPercentage(_player, _rewardPercentage);
        emit PlayerUpdate(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake, 
        players[_player].items);
    }

    // Function to update a player's stake
    function updatePlayerStake(address _player, uint256 _stake) public {
        // Check if the player exists
        require(playerLeafHashes[_player] != bytes32(0), "Player does not exist");

        // Update the player's stake
        players[_player].stake = _stake;

        // Recalculate the Merkle leaf hash for the updated player
        bytes32 leafHash = calculateLeafHash(players[_player]);
        playerLeafHashes[_player] = leafHash;

        // Emit an event indicating the player's stake has been updated
        emit PlayerUpdateStake(_player, _stake);
        emit PlayerUpdate(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake,   
        players[_player].items);
    }

    // Function to update a player's items
    function updatePlayerItems(address _player, uint256 _items) public {
        // Check if the player exists
        require(playerLeafHashes[_player] != bytes32(0), "Player does not exist");

        // Update the player's items
        players[_player].items = _items;

        // Recalculate the Merkle leaf hash for the updated player
        bytes32 leafHash = calculateLeafHash(players[_player]);
        playerLeafHashes[_player] = leafHash;

        // Emit an event indicating the player's items have been updated
        emit PlayerUpdateItems(_player, _items);
        emit PlayerUpdate(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake, 
        players[_player].items);
    }

    // Function to verify a player's data using a Merkle proof
    function verifyPlayerData(
        address _player,
        uint256 _ranking,
        uint256 _rewardPercentage,
        bytes32[] memory proof
    ) public view returns (bool) {
        // Calculate the Merkle root based on the provided data
        bytes32 computedRoot = _calculateMerkleRoot(_player, _ranking, _rewardPercentage);

        // Verify that the computed root matches the stored Merkle root
        return computedRoot == merkleRoot;
    }

    // Internal function to calculate the Merkle leaf hash for a player
    function calculateLeafHash(PlayerInfo memory _playerInfo) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_playerInfo.ranking, _playerInfo.rewardPercentage, _playerInfo.stake, _playerInfo.items));
    }

    // Internal function to calculate the Merkle root based on a player's data
    function _calculateMerkleRoot(
        address _player,
        uint256 _ranking,
        uint256 _rewardPercentage
    ) internal pure returns (bytes32) {
        bytes32 leafHash = keccak256(abi.encodePacked(_ranking, _rewardPercentage));

        // Placeholder for more complex Merkle tree calculation logic
        return leafHash;
    }
}
