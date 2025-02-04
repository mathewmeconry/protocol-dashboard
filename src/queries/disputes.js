import gql from 'graphql-tag'

export const AllDisputes = gql`
  query AllDisputes($limit: Int) {
    disputes(first: $limit, orderBy: createdAt, orderDirection: desc) {
      id
      finalRuling
      lastRoundId
      state
      metadata
      createdAt
      subject {
        id
      }
      rawMetadata
      rounds {
        id
        state
        number
        draftTermId
        delayedTerms
        guardians {
          guardian {
            id
          }
          commitment
          outcome
        }

        appeal {
          id
        }
      }
    }
  }
`

export const SingleDispute = gql`
  query SingleDispute($id: ID!) {
    dispute(id: $id) {
      id
      txHash
      createTermId
      possibleRulings
      finalRuling
      lastRoundId
      state
      metadata
      rawMetadata
      createdAt
      subject {
        id
      }
      evidences {
        id
        submitter
        data
        createdAt
      }
      subject {
        id
      }
      rounds {
        id
        state
        number
        draftTermId
        guardiansNumber
        settledPenalties
        guardianFees
        delayedTerms
        selectedGuardians
        coherentGuardians
        collectedTokens
        createdAt
        guardians {
          guardian {
            id
          }
          weight
          commitment
          commitmentDate
          outcome
          revealDate
        }
        vote {
          id
          winningOutcome
        }
        appeal {
          id
          maker
          appealedRuling
          taker
          opposedRuling
          settled
          createdAt
          confirmedAt
        }
      }
    }
  }
`
