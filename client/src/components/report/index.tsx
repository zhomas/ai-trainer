import React, { FC } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { showPicker } from '../../app/app.slice'
import { AppDispatch, AppState } from '../../app/store'
import { getImageURL } from '../../utils'
import styles from './report.module.css'

type Props = ConnectedProps<typeof connector>

const Report: FC<Props> = props => (
  <div className={styles.container}>
    {props.groups.map(group => (
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
      <button onClick={props.showPicker}>Add more</button>
    </div>
  </div>
)

const mapStateToProps = (state: AppState) => {
  const groups = state.app.reasons
    .map(reason => ({
      label: reason.label,
      photos: state.app.results
        .filter(ph => ph.reasonIDs.includes(reason.id))
        .map(r => getImageURL(r.id)),
    }))
    .filter(group => group.photos.length > 0)

  return { groups }
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  showPicker: () => dispatch(showPicker()),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Report)
