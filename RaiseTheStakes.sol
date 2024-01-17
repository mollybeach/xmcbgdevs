// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RaiseTheStakes {

    struct PlayerInfo {
        address player;
        uint256 ranking;
        uint256 rewardPercentage;
        uint256 stake;
        uint256 items;
    }

    PlayerInfo[] public players;

    // Function to add a new player
    function addPlayer(
        address _player,
        uint256 _rewardPercentage,
        uint256 _stake,
        uint256 _items
    ) public {
        PlayerInfo memory newPlayer = PlayerInfo({
            player: _player,
            ranking: 0,
            rewardPercentage: _rewardPercentage,
            stake: _stake,
            items: _items
        });

        players.push(newPlayer);
    }

    // Function to set player ranking
    function setRank(uint256 _playerId, uint256 _ranking) external {
      //add access control to prevent players from changing ranking without game approval
        require(msg.sender == players[_playerId].player, "Sender must be player's address");
        players[_playerId].ranking = _ranking;
    }

    // Function to set player reward percentage
    function setRewardPercentage(uint256 _playerId, uint256 _rewardPercentage) external {
        //add access control to prevent players from changing reward percentage without game approval
      
        players[_playerId].rewardPercentage = _rewardPercentage;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return players.length;
    }

    function getPlayerInfo(uint256 index)
        public
        view
        returns (
            address player,
            uint256 ranking,
            uint256 rewardPercentage,
            uint256 stake,
            uint256 items
        )
    {
        require(index < players.length, "Index is out of bounds");
        PlayerInfo storage playerInfo = players[index];
        return (
            playerInfo.player,
            playerInfo.ranking,
            playerInfo.rewardPercentage,
            playerInfo.stake,
            playerInfo.items
        );
    }
}
