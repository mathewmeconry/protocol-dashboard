import React from 'react'
import { Box, GU, Split, useLayout } from '@aragon/ui'
import AccountBanner from './AccountBanner'
import Balance from './Balance'
import Profile from './Profile'
import { useCourtConfig } from '../../providers/CourtConfig'
import { useWallet } from '../../providers/Wallet'

import { getAccountStatus } from '../../utils/account-utils'
import {
  getTotalUnlockedActiveBalance,
  getTotalLockedANTDistribution,
  getTotalEffectiveInactiveBalance,
} from '../../utils/balance-utils'

import walletIcon from '../../assets/IconWallet.svg'
import inactiveANTIcon from '../../assets/IconANTInactive.svg'
import activeANTIcon from '../../assets/IconANTActive.svg'

const BalanceModule = React.memo(
  ({
    balances,
    loading,
    unlockSettings,
    onRequestUnlockActivation,
    onRequestActivate,
    onRequestDeactivate,
    onRequestStakeActivate,
    onRequestWithdraw,
  }) => {
    const wallet = useWallet()
    const { name: layout } = useLayout()
    const { minActiveBalance } = useCourtConfig()

    const oneColumn = layout === 'small' || layout === 'medium'
    const status = balances && getAccountStatus(balances, minActiveBalance)

    const { walletBalance, activeBalance, inactiveBalance } = balances || {}

    const lockedBalanceDistribution =
      balances && getTotalLockedANTDistribution(balances)
    const unlockedActiveBalance =
      balances && getTotalUnlockedActiveBalance(balances)
    const effectiveInactiveBalance =
      balances && getTotalEffectiveInactiveBalance(balances)

    return (
      <Split
        primary={
          <div
            css={`
              display: flex;
              flex-direction: column;
              height: 100%;
            `}
          >
            <Box
              css={`
                border: 0;
              `}
              padding={3 * GU}
            >
              <AccountBanner
                status={status}
                loading={loading}
                minActiveBalance={minActiveBalance}
                activeBalance={activeBalance}
              />
            </Box>
            <div
              css={`
                display: ${oneColumn ? 'block' : 'flex'};
                flex-grow: 1;
              `}
            >
              <Box
                padding={3 * GU}
                css={`
                  flex-basis: 50%;
                  margin-top: ${2 * GU}px;
                  margin-right: ${oneColumn ? 0 : `${2 * GU}px`};
                  border: 0;
                `}
              >
                <Balance
                  amount={effectiveInactiveBalance}
                  label="Inactive"
                  mainIcon={inactiveANTIcon}
                  actions={[
                    { label: 'Withdraw', onClick: onRequestWithdraw },
                    {
                      label: 'Activate',
                      mode: 'strong',
                      onClick: onRequestActivate,
                    },
                  ]}
                  activity={inactiveBalance && inactiveBalance.latestMovement}
                  loading={loading}
                />
              </Box>
              <Box
                padding={3 * GU}
                css={`
                  flex-basis: 50%;
                  border: 0;
                `}
              >
                <Balance
                  amount={unlockedActiveBalance}
                  label="Active"
                  mainIcon={activeANTIcon}
                  actions={[
                    { label: 'Deactivate', onClick: onRequestDeactivate },
                  ]}
                  activity={activeBalance && activeBalance.latestMovement}
                  distribution={lockedBalanceDistribution}
                  loading={loading}
                />
              </Box>
              { unlockSettings.canUnlock &&
              <Box
                padding={3 * GU}
                css={`
                  flex-basis: 50%;
                  border: 0;
                `}
              >
                
                  <Balance
                    amount={unlockSettings.lockedAmount}
                    label="Locked"
                    mainIcon={activeANTIcon}
                    actions={[
                      { label: 'Unlock & Deactivate', onClick: onRequestUnlockActivation },
                    ]}
                    activity={null}
                    distribution={lockedBalanceDistribution}
                    loading={loading}
                />
                </Box>
              }
                
              
            </div>
          </div>
        }
        secondary={
          <Box
            padding={0}
            css={`
              overflow: hidden;
              border: 0;
              height: 100%;
            `}
          >
            <Profile status={status} account={wallet.account} />
            <div
              css={`
                padding: ${3 * GU}px;
                margin-top: ${2 * GU}px;
              `}
            >
              <Balance
                amount={walletBalance && walletBalance.amount}
                label="My wallet"
                mainIcon={walletIcon}
                actions={[
                  {
                    label: 'Approve, Stake and Activate',
                    mode: 'strong',
                    onClick: onRequestStakeActivate,
                  },
                ]}
                activity={walletBalance && walletBalance.latestMovement}
                loading={loading}
              />
            </div>
          </Box>
        }
        invert={oneColumn ? 'vertical' : 'horizontal'}
      />
    )
  }
)

export default BalanceModule
