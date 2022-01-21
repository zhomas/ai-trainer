import React, { FC } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { reportSelector, showPicker } from '../app.slice'
import { AppDispatch, AppState } from '../store'
import styles from './report.module.css'

type Props = ConnectedProps<typeof connector>

const Report: FC<Props> = ({ groups, showPicker }) => {
  return (
    <div className={styles.container}>
      {groups.map(group => (
        <>
          <h2 className={styles.sectionHeading}>{group.label}</h2>
          <div className={styles.sectionGrid}>
            {group.photos.map(url => (
              <img src={url} />
            ))}
          </div>
        </>
      ))}
      <div className={styles.underbar}>
        <button onClick={showPicker}>Add more</button>
      </div>
    </div>
  )
}

const mapStateToProps = (state: AppState) => {
  return {
    groups: reportSelector(state),
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    showPicker: () => dispatch(showPicker()),
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Report)
