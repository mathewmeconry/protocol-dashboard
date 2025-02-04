import React from 'react'
import { EthIdenticon, GU, useTheme, textStyle } from '@aragon/ui'
import { shortenAddress } from '../../lib/web3-utils'
import {
  ACCOUNT_STATUS_GUARDIAN_ACTIVE,
  ACCOUNT_STATUS_GUARDIAN_INACTIVE,
} from '../../types/account-status-types'

import shieldIcon from '../../assets/IconShield.svg'

const getProfileAttributes = (status, theme) => {
  if (status === ACCOUNT_STATUS_GUARDIAN_ACTIVE)
    return {
      background: `linear-gradient(35deg, ${theme.accentStart}  -75%, ${theme.accentEnd} 105%)`,
      primaryColor: theme.accentContent,
      secondaryColor: theme.accentContent,
      statusLabel: 'ACTIVE GUARDIAN',
      icon: shieldIcon,
    }

  if (status === ACCOUNT_STATUS_GUARDIAN_INACTIVE)
    return {
      background: 'linear-gradient(208deg, #FFFAF1 -3%, #FFEBEB 216%)',
      primaryColor: theme.content,
      secondaryColor: theme.contentSecondary,
      statusLabel: 'INACTIVE GUARDIAN',
      icon: shieldIcon,
    }

  return {
    background: '#F0F2F7',
    primaryColor: theme.content,
    secondaryColor: theme.contentSecondary,
    statusLabel: 'ACCOUNT',
  }
}

function Profile({ account, status }) {
  const theme = useTheme()
  const {
    background,
    primaryColor,
    secondaryColor,
    statusLabel,
    icon,
  } = getProfileAttributes(status, theme)

  return (
    <div
      css={`
        background: ${background};
        padding: ${3 * GU}px;
      `}
    >
      <div
        css={`
          height: ${7 * GU}px;
          display: flex;
          align-items: center;
        `}
      >
        <div
          css={`
            display: flex;
            align-items: stretch;
          `}
        >
          <EthIdenticon
            address={account}
            radius={100}
            scale={2}
            css={`
              margin-right: ${1.5 * GU}px;
            `}
          />
          <div
            css={`
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: ${6 * GU}px;
            `}
          >
            <span
              css={`
                ${textStyle('title4')};
                color: ${primaryColor};
                line-height: 1.2;
              `}
            >
              {shortenAddress(account)}
            </span>
            <span
              css={`
                ${textStyle('label2')};
                color: ${secondaryColor};
                line-height: 1.2;
                display: flex;
                align-items: center;
              `}
            >
              {icon && (
                <img
                  css={`
                    margin-right: ${0.5 * GU}px;
                  `}
                  src={icon}
                  alt="guardian-icon"
                />
              )}
              {statusLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
