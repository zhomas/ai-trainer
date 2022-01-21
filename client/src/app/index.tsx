import { FC } from 'react'
import styles from './app.module.css'
import { AppDispatch, AppState } from './store'
import { real, remove, showModal, showReport } from './app.slice'
import { connect, ConnectedProps } from 'react-redux'
import Report from '../components/report'
import Modal from '../components/modal'
import { getImageURL } from '../utils'

type Props = ConnectedProps<typeof connector>

const App: FC<Props> = props => {
  if (props.screen === 'report') {
    return <Report />
  }

  const content = props.marked.length ? (
    <div className={styles.rowResults}>
      {props.marked.map(item => (
        <div className={styles.result}>
          <img src={item.imageURL} />
          <span className={styles['result__delete']} onClick={() => props.remove(item.id)} />
        </div>
      ))}
    </div>
  ) : (
    <div className={styles.rowEmpty}>No Results</div>
  )

  return (
    <>
      <div className={styles.container}>
        <div
          className={styles.rowImage}
          style={{ backgroundImage: `url(${props.imageURL})` }}
        />
        <div className={styles.rowPick}>
          <button onClick={props.markReal}>Real</button>
          <button onClick={props.showModal}>Not real</button>
        </div>
        <div className={styles.rowGenerate}>
          <button onClick={props.showReport}>Generate Report</button>
        </div>
        {content}
      </div>
      {props.screen === 'modal' && <Modal />}
    </>
  )
}

const mapStateToProps = (state: AppState) => ({
  imageURL: getImageURL(state.app.imageID),
  screen: state.app.screen,
  marked: state.app.marked.map(m => ({
    id: m.imageID,
    imageURL: getImageURL(m.imageID),
    reasons: m.reasonIDs,
  })),
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  markReal: () => dispatch(real()),
  showModal: () => dispatch(showModal()),
  showReport: () => dispatch(showReport()),
  remove: (id: number) => dispatch(remove({ id })),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connect(mapStateToProps, mapDispatchToProps)(App)
