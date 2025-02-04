import React, {useCallback} from 'react'
import {
  Button,
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'
import IdentityBadge from '../IdentityBadge'
import { getProviderFromUseWalletId } from '../../ethereum-providers'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { trackEvent, events } from '../../services/analytics';

function AccountScreenConnected({ wallet }) {
  const theme = useTheme()
  const copy = useCopyToClipboard()

  const walletNetworkName = wallet.networkName

  const providerInfo = getProviderFromUseWalletId(wallet.connector)

  const disconnect = useCallback(() => {
    // analytics
    trackEvent(events.WALLET_DISCONNECTED, {
      wallet_address: wallet.account,
      wallet_provider: wallet.connector, // provider name would make more sense
      network: walletNetworkName,
    });

    wallet.reset();
  }, [wallet, walletNetworkName]);

  return (
    <div
      css={`
        padding: ${2 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          width: 100%;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            margin-right: ${3 * GU}px;
          `}
        >
          <img
            src={providerInfo.image}
            alt=""
            css={`
              width: ${2.5 * GU}px;
              height: ${2.5 * GU}px;
              margin-right: ${0.5 * GU}px;
              transform: translateY(-2px);
            `}
          />
          <span>
            {providerInfo.id === 'unknown' ? 'Wallet' : providerInfo.name}
          </span>
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
          `}
        >
          <ButtonBase
            onClick={() => copy(wallet.account)}
            focusRingRadius={RADIUS}
            css={`
              display: flex;
              align-items: center;
              justify-self: flex-end;
              padding: ${0.5 * GU}px;
              &:active {
                background: ${theme.surfacePressed};
              }
            `}
          >
            <IdentityBadge
              entity={wallet.account || ''}
              compact
              badgeOnly
              css="cursor: pointer"
            />
            <IconCopy
              css={`
                color: ${theme.hint};
              `}
            />
          </ButtonBase>
        </div>
      </div>
      <div
        css={`
          display: flex;
          align-items: center;
          margin-top: ${1 * GU}px;
          color: ${theme.positive};
          ${textStyle('label2')};
        `}
      >
        <IconCheck size="small" />
        <span
          css={`
            margin-left: ${0.5 * GU}px;
          `}
        >
          {`Connected to Ethereum ${walletNetworkName} Network`}
        </span>
      </div>

      <Button
        onClick={disconnect}
        wide
        css={`
          margin-top: ${1 * GU}px;
        `}
      >
        Disconnect wallet
      </Button>
    </div>
  )
}

export default AccountScreenConnected
