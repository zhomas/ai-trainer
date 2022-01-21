import { FC } from 'react'
import styles from './app.module.css'
import { AppDispatch, AppState } from './store'
import { loadNextPhoto, removeResult, showModal, showReport } from './app.slice'
import { connect, ConnectedProps } from 'react-redux'
import Report from '../components/report'
import Modal from '../components/modal'
import { getImageURL } from '../utils'

type Props = ConnectedProps<typeof connector>

const App: FC<Props> = props => {
  const renderModal = () => {
    if (props.screen === 'modal') return <Modal />
    return null
  }

  const renderContent = () => {
    if (!props.hasResults) {
      return <div className={styles.rowEmpty}>No Results</div>
    }

    return (
      <div className={styles.rowResults}>
        {props.marked.map(item => (
          <div className={styles.result}>
            <img src={item.imageURL} />
            <span
              className={styles['result__delete']}
              onClick={() => props.removeResult(item.id)}
            />
          </div>
        ))}
      </div>
    )
  }

  if (props.screen === 'report') {
    return <Report />
  }

  return (
    <div className={styles.container}>
      <div className={styles.rowImage} style={{ backgroundImage: `url(${props.imageURL})` }} />
      <div className={styles.rowPick}>
        <button onClick={props.markReal}>Real</button>
        <button onClick={props.showModal}>Not real</button>
      </div>
      <div className={styles.rowGenerate}>
        <button onClick={props.showReport}>Generate Report</button>
      </div>
      {renderContent()}
      {renderModal()}
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  hasResults: state.app.results.length > 0,
  imageURL: getImageURL(state.app.imageID),
  screen: state.app.screen,
  marked: state.app.results.map(m => ({
    id: m.id,
    imageURL: getImageURL(m.id),
    reasons: m.reasonIDs,
  })),
})

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  markReal: () => dispatch(loadNextPhoto()),
  showModal: () => dispatch(showModal()),
  showReport: () => dispatch(showReport()),
  removeResult: (id: number) => dispatch(removeResult({ id })),
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connect(mapStateToProps, mapDispatchToProps)(App)
