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
}
