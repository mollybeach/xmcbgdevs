// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IAToken.sol";
import "@aave/core-v3/contracts/interfaces/IReserveInterestRateStrategy.sol";
import "@aave/safety-module/contracts/interfaces/IStakedAave.sol";
import {DataTypes} from '@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol';

contract GameContract is Ownable(msg.sender) {
    IERC20 public immutable aaveToken;  // Aave's interest-bearing token (aToken)
    IPool public immutable lendingPool;
    IERC20 public immutable ghoToken;  // GHO token address
    IStakedAave public immutable stakedAave;

    struct PlayerInfo {
        uint256 ranking;
        uint256 rewardPercentage;
        uint256 stakedAmount;  // Amount of aTokens staked
        uint256 items;
    }

    mapping(address => PlayerInfo) public players;

    uint256 public totalRewardAmount;

    event PlayerRegistered(address indexed player, uint256 ranking, uint256 rewardPercentage);
    event FundsWithdrawn(address indexed player, uint256 amount);
    event PlayerRankingSet(address indexed player, uint256 newRanking);
    event PlayerRewardPercentageSet(address indexed player, uint256 newRewardPercentage);
    event RewardAmountSet(uint256 totalRewardAmount);


    constructor(
        address _aaveToken,
        address _lendingPool,
        address _ghoToken,
        address _stakedAave
    ) {
        aaveToken = IERC20(_aaveToken);
        lendingPool = IPool(_lendingPool);
        ghoToken = IERC20(_ghoToken);
        stakedAave = IStakedAave(_stakedAave);
    }

    function registerPlayer(uint256 _ranking, uint256 _rewardPercentage) external {
        require(players[msg.sender].ranking == 0, "Player already registered");
        require(_ranking > 0 && _rewardPercentage > 0, "Invalid ranking or reward percentage");

        players[msg.sender] = PlayerInfo({
            ranking: _ranking,
            rewardPercentage: _rewardPercentage,
            stakedAmount: 0,
            items: 0
        });

        emit PlayerRegistered(msg.sender, _ranking, _rewardPercentage);
    }

    function setPlayerRanking(address player, uint256 newRanking) external onlyOwner {
        require(players[player].ranking != 0, "Player not registered");
        players[player].ranking = newRanking;

        emit PlayerRankingSet(player, newRanking);
    }

    function setPlayerRewardPercentage(address player, uint256 newRewardPercentage) external onlyOwner {
        require(players[player].ranking != 0, "Player not registered");
        players[player].rewardPercentage = newRewardPercentage;

        emit PlayerRewardPercentageSet(player, newRewardPercentage);
    }

    function setRewardAmount(uint256 _totalRewardAmount) external onlyOwner {
        require(_totalRewardAmount > 0, "Invalid reward amount");

        totalRewardAmount = _totalRewardAmount;

        emit RewardAmountSet(_totalRewardAmount);
    }

    function depositTokens(uint256 _amountOfDai, address _daiAddress) external {
        require(_amountOfDai > 0, "Amount must be greater than 0");
        require(players[msg.sender].ranking != 0, "Player not registered");

        IERC20 dai = IERC20(_daiAddress);
        dai.approve(address(lendingPool), _amountOfDai);
        lendingPool.supply(address(dai), _amountOfDai, address(msg.sender), 0);

        // Approve Aave to spend tokens on behalf of the contract
        // aaveToken.approve(address(stakedAave), _amount);

        // Stake AAVE tokens in Safety Module to receive stkAAVE
        // stakedAave.stake(address(msg.sender), _amount);


        // Mint GHO (2 for variable interest rate mode)
        lendingPool.borrow(address(ghoToken), _amountOfDai, 2, 0, address(msg.sender));


        // Update player's stakedAmount
        players[msg.sender].stakedAmount += _amountOfDai;
    }

    function withdrawFunds() external {
        address player = msg.sender;
        require(players[player].ranking != 0, "Player not registered");

        uint256 totalAmount = calculateWithdrawalAmount(player);

        require(totalAmount > 0, "No funds to withdraw");

        // Withdraw aTokens from Aave
        stakedAave.redeem(address(msg.sender), stakedAave.balanceOf(msg.sender));

        // Borrow GHO tokens from Aave
        // borrowGHO(totalAmount);

        // Reset player's stakedAmount
        players[player].stakedAmount = 0;

        emit FundsWithdrawn(player, totalAmount);
    }

    function borrowGHO(uint256 _amount) internal {
        // Ensure there's enough allowance to borrow
        ghoToken.approve(address(lendingPool), _amount);

        // Borrow GHO tokens from Aave
        lendingPool.borrow(address(ghoToken), _amount, 2, 0, address(this));
    }

    function calculateWithdrawalAmount(address player) internal view returns (uint256) {
        uint256 totalAmount = players[player].stakedAmount * players[player].rewardPercentage / 100;
        totalAmount += players[player].items; // Add additional logic for item rewards if needed
        return totalAmount;
    }

    // Additional functions for managing items, game logic, etc., can be added as needed

  function optimizeInterestRate(address aToken1, address aToken2) external view returns (address) {
      address[] memory markets = new address[](2); // Assuming two markets, adjust as needed
      markets[0] = address(aToken1);
      markets[1] = address(aToken2);

      uint256 maxInterestRate;
      address targetMarket;

      for (uint256 i = 0; i < markets.length; i++) {
          DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(markets[i]);
          uint256 interestRate = reserveData.currentVariableBorrowRate;

          if (interestRate > maxInterestRate) {
              maxInterestRate = interestRate;
              targetMarket = markets[i];
          }
      }

      return targetMarket;
  }
  
}
