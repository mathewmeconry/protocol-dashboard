import React, { useCallback, useState } from 'react'
import {
  Button,
  ButtonBase,
  Field,
  GU,
  Info,
  TextInput,
  useSidePanelFocusOnReady,
  useTheme,
} from '@aragon/ui'
import { useWallet } from 'use-wallet'
import { useCourtConfig } from '../../../providers/CourtConfig'

import { parseUnits, formatUnits, bigNum } from '../../../lib/math-utils'

const ANTForm = React.memo(function ANTForm({
  actionLabel,
  maxAmount,
  onDone,
  onSubmit,
  runParentValidation,
}) {

  const wallet = useWallet()

  const [amount, setAmount] = useState({
    value: '0',
    valueBN: bigNum(0),
    error: null,
  })
  const theme = useTheme()
  const { token: antToken } = useCourtConfig()
  const inputRef = useSidePanelFocusOnReady()

  const handleEditMode = useCallback(
    editMode => {
      setAmount(amount => ({
        ...amount,
        value: formatUnits(amount.valueBN, {
          digits: antToken.decimals,
          commas: !editMode,
          replaceZeroBy: editMode ? '' : '0',
          precision: antToken.decimals,
        }),
      }))
    },
    [antToken.decimals]
  )

  // Change amount handler
  const handleAmountChange = useCallback(
    event => {
      const newAmount = event.target.value
      let newAmountBN

      try {
        newAmountBN = parseUnits(newAmount, antToken.decimals)
      } catch (err) {
        newAmountBN = bigNum(-1)
      }

      setAmount(amount => ({
        ...amount,
        value: newAmount,
        valueBN: newAmountBN,
      }))
    },
    [antToken.decimals]
  )

  // Max value selection handler
  const handleOnSelectMaxValue = useCallback(() => {
    setAmount(amount => ({
      ...amount,
      value: formatUnits(maxAmount, {
        digits: antToken.decimals,
        precision: antToken.decimals,
      }),
      valueBN: maxAmount,
    }))
  }, [antToken.decimals, maxAmount])

  // Form validation
  const validateForm = useCallback(() => {
    if (amount.valueBN.eq(0)) {
      return 'Amount must not be zero'
    }

    if (amount.valueBN.eq(-1)) {
      return 'Wrong amount format'
    }

    return runParentValidation(amount.valueBN)
  }, [amount.valueBN, runParentValidation])

  // Form submit
  const handleSubmit = event => {
    event.preventDefault()

    const error = validateForm(amount.valueBN)
    if (error) {
      setAmount(amount => ({ ...amount, error }))
      return
    }

    setAmount(amount => ({ ...amount, error: null }))

    onDone()
    onSubmit(wallet.account, amount.valueBN)
  }

  const errorMessage = amount.error

  return (
    <form onSubmit={handleSubmit}>
      <Field
        css={`
          margin-bottom: ${2 * GU}px;
        `}
        label="Amount"
      >
        <TextInput
          name="amount"
          wide
          onChange={handleAmountChange}
          onFocus={() => handleEditMode(true)}
          onBlur={() => handleEditMode(false)}
          value={amount.value}
          ref={inputRef}
          required
          adornment={
            <ButtonBase
              css={`
                margin-right: ${1 * GU}px;
                color: ${theme.accent};
              `}
              onClick={handleOnSelectMaxValue}
            >
              MAX
            </ButtonBase>
          }
          adornmentPosition="end"
        />
      </Field>
      {errorMessage && (
        <Info
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          mode="error"
        >
          {errorMessage}
        </Info>
      )}
      <Button
        css={`
          margin-bottom: ${1 * GU}px;
        `}
        label={actionLabel}
        mode="strong"
        type="submit"
        wide
      />
    </form>
  )
})

export default ANTForm
