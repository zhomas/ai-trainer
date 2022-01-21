import React, { FC, useState } from 'react'
import { AppDispatch, AppState } from '../store'
import styles from './modal.module.css'
import { connect, ConnectedProps } from 'react-redux'
import { toggleReason } from './modal.slice'
import { confirm, showPicker, SubmitPhotoPayload } from '../app.slice'
import { Dictionary } from '@reduxjs/toolkit'
type Props = ConnectedProps<typeof connector>

const Modal: FC<Props> = ({ reasons, confirm, showPicker }) => {
  const [otherReason, setOtherReason] = useState('')

  const [checked, setChecked] = useState<Dictionary<boolean>>({})

  const handleToggle = (id: number) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const reasonIDs = reasons.map(r => r.id).filter(id => checked[id])
    confirm({ reasonIDs, otherReason })
  }

  const checkedCount = Object.values(checked).filter(ch => !!ch).length
  const buttonEnabled = checkedCount > 0 || otherReason

  return (
    <form onSubmit={handleSubmit} className={styles.modal}>
      <h3 className={styles.heading}>Why</h3>
      <div className={styles.reasons}>
        <h4>Choose features</h4>
        <div className={styles.reasonsList}>
          {reasons.map((r, i) => (
            <label>
              <input
                value={r.id}
                checked={!!checked[r.id]}
                onChange={() => handleToggle(r.id)}
                type="checkbox"
              />
              {r.label}
            </label>
          ))}
        </div>
        <h4>Other</h4>
        <input
          type="text"
          className={styles.otherInput}
          value={otherReason}
          placeholder={'Enter your own feature'}
          onChange={e => setOtherReason(e.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={showPicker}>
          Cancel
        </button>
        <button type="submit" disabled={!buttonEnabled}>
          Confirm
        </button>
      </div>
    </form>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    reasons: state.app.reasons,
    selected: state.modal.selected,
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    select: (id: string) => {
      dispatch(toggleReason({ id }))
    },
    confirm: (arg: SubmitPhotoPayload) => {
      dispatch(confirm(arg))
    },
    showPicker: () => dispatch(showPicker()),
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Modal)
