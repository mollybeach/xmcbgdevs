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

    // Array to store player information
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

  function setRank(uint256 _playerId, uint256 _ranking) external {
      require(msg.sender == players[_playerId].player, "Sender must be players   address");

      players[_playerId].ranking = _ranking;
  }

  function setRewardPercentage(uint256 _playerId, uint256 _rewardPercentage) external {
    // require(msg.sender == players[_playerId].player, "Sender must be players   address");;

    players[_playerId].rewardPercentage = _rewardPercentage;
  }

    // Function to get the number of players
    function getNumberOfPlayers() public view returns (uint256) {
        return players.length;
    }

    // Function to get player information by index
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
