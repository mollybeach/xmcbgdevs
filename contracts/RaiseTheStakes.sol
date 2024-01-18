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

    // Event triggered when a new player is created
    event CreatePlayer(address indexed player, uint256 ranking, uint256 rewardPercentage, uint256 stake, uint256 items);

    // Event triggered when a player's data is updated
    event PlayerUpdateData(address indexed player, uint256 ranking, uint256 rewardPercentage, uint256 stake, uint256 items);
    event PlayerUpdateRanking(address indexed player, uint256 ranking);
    event PlayerUpdateRewardPercentage(address indexed player, uint256 rewardPercentage);
    event PlayerUpdateStake(address indexed player, uint256 stake);
    event PlayerUpdateItems(address indexed player, uint256 items);

  // Event triggered when a player's address is called 
    event GetPlayerInfo(address indexed player);

    constructor() {}

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

        // Emit an event indicating the player's data has been created
        emit CreatePlayer(_player, newPlayer.ranking, newPlayer.rewardPercentage, newPlayer.stake, newPlayer.items);
    }

    // Function to update a player's ranking
    function updatePlayerRanking(address _player, uint256 _ranking) public {
        // Check if the player exists
        require(players[_player].stake > 0, "Player does not exist");

        // Update the player's ranking
        players[_player].ranking = _ranking;

        // Emit an event indicating the player's data has been updated
        emit PlayerUpdateData(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake,     
        players[_player].items);
        emit PlayerUpdateRanking(_player, _ranking);
    }

    // Function to update a player's reward percentage
    function updatePlayerRewardPercentage(address _player, uint256 _rewardPercentage) public {
        // Check if the player exists
        require(players[_player].stake > 0, "Player does not exist");

        // Update the player's reward percentage
        players[_player].rewardPercentage = _rewardPercentage;

        // Emit an event indicating the player's data has been updated
        emit PlayerUpdateData(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake, 
        players[_player].items);
        emit PlayerUpdateRewardPercentage(_player, _rewardPercentage);
    }

    // Function to update a player's stake
    function updatePlayerStake(address _player, uint256 _stake) public {
        // Check if the player exists
        require(players[_player].stake > 0, "Player does not exist");

        // Update the player's stake
        players[_player].stake = _stake;

        // Emit an event indicating the player's data has been updated
        emit PlayerUpdateData(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake,   
        players[_player].items);
        emit PlayerUpdateStake(_player, _stake);
    }

    // Function to update a player's items
    function updatePlayerItems(address _player, uint256 _items) public {
        // Check if the player exists
        require(players[_player].stake > 0, "Player does not exist");

        // Update the player's items
        players[_player].items = _items;

        // Emit an event indicating the player's data has been updated
        emit PlayerUpdateData(_player, players[_player].ranking, players[_player].rewardPercentage, players[_player].stake, 
        players[_player].items);
        emit PlayerUpdateItems(_player, _items);
    }

    // Function to get player information
    function getPlayerInfo(address _player) public view returns (
        uint256 ranking,
        uint256 rewardPercentage,
        uint256 stake,
        uint256 items
    ) {
        require(players[_player].stake > 0, "Player does not exist");

        PlayerInfo storage player = players[_player];

        return (
            player.ranking,
            player.rewardPercentage,
            player.stake,
            player.items
        );
    }
}
