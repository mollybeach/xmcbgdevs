// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@aave/protocol-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GhoMinter {
    IPool private aavePool;
    IERC20 private collateralToken;
    address private ghoAddress;

    constructor(address _aavePoolAddress, address _collateralTokenAddress, address _ghoAddress) {
        aavePool = IPool(_aavePoolAddress);
        collateralToken = IERC20(_collateralTokenAddress);
        ghoAddress = _ghoAddress;
    }

    function supplyAndBorrowGho(uint256 _collateralAmount, uint256 _ghoAmount) external {
        // Transfer collateral to this contract
        require(collateralToken.transferFrom(msg.sender, address(this), _collateralAmount), "Transfer failed");

        // Approve the Aave pool to use your collateral
        collateralToken.approve(address(aavePool), _collateralAmount);

        // Deposit collateral into Aave
        aavePool.supply(address(collateralToken), _collateralAmount, address(this), 0);

        // Borrow GHO
        aavePool.borrow(ghoAddress, _ghoAmount, 2, 0, address(this));
    }

    function repayGho(uint256 _ghoAmount) external {
        // Transfer GHO from the user to this contract
        IERC20(ghoAddress).transferFrom(msg.sender, address(this), _ghoAmount);

        // Approve the Aave pool to use GHO for repayment
        IERC20(ghoAddress).approve(address(aavePool), _ghoAmount);

        // Repay the borrowed GHO
        aavePool.repay(ghoAddress, _ghoAmount, 2, address(this));
    }

  function withdrawCollateral(uint256 _amount) external {
      // Withdraw collateral from Aave
      aavePool.withdraw(address(collateralToken), _amount, msg.sender);
  }

  function liquidate(address _user, uint256 _debtToCover, bool _receiveAToken) external {
      address collateral = address(collateralToken); // or other collateral if multiple types are supported
      address debtAsset = ghoAddress;

      // Perform the liquidation call
      aavePool.liquidationCall(collateral, debtAsset, _user, _debtToCover, _receiveAToken);
  }


}


import "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import "@aave/protocol-v2/contracts/interfaces/IAaveIncentivesController.sol";

contract AaveHackathonPOC {
    ILendingPool public lendingPool;
    IAaveIncentivesController public incentivesController;

    constructor(address _lendingPoolAddress, address _incentivesControllerAddress) {
        lendingPool = ILendingPool(_lendingPoolAddress);
        incentivesController = IAaveIncentivesController(_incentivesControllerAddress);
    }

    function borrowWithStakedAave(uint256 _amountToBorrow) external {
        // Approve staked Aave tokens to be used as collateral
        // Use Aave's lending pool to borrow using staked Aave as collateral
        // Handle any additional logic or actions based on your hackathon requirements
    }
}
