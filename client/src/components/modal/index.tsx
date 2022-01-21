import React, { FC, useState } from 'react'
import styles from './modal.module.css'
import { connect, ConnectedProps } from 'react-redux'
import { AppDispatch, AppState } from '../../app/store'
import { submitResult, showPicker, SubmitPhotoPayload } from '../../app/app.slice'
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
                type="checkbox"
                value={r.id}
                checked={!!checked[r.id]}
                onChange={() => handleToggle(r.id)}
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

const mapStateToProps = (state: AppState) => ({
  reasons: state.app.reasons,
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  confirm: (arg: SubmitPhotoPayload) => dispatch(submitResult(arg)),
  showPicker: () => dispatch(showPicker()),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Modal)
