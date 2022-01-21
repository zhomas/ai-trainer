import { FC } from 'react'
import styles from './picker.module.css'
import { AppDispatch, AppState } from '../store'
import { real, remove, showModal, showReport, unreal } from '../app.slice'
import { connect, ConnectedProps } from 'react-redux'

type Props = ConnectedProps<typeof connector>

const Picker: FC<Props> = ({
  showModal,
  markReal,
  imageURL,
  marked,
  remove,
  showReport,
}) => {
  const renderResults = () => {
    if (!marked.length) {
      return <div className={styles.rowEmpty}>No Results</div>
    }

    return (
      <div className={styles.rowResults}>
        {marked.map(item => (
          <div className={styles.result}>
            <img src={item.imageURL} />
            <span className={styles['result__delete']} onClick={() => remove(item.id)} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.rowImage} style={{ backgroundImage: `url(${imageURL})` }} />
      <div className={styles.rowPick}>
        <button onClick={markReal}>Real</button>
        <button onClick={showModal}>Not real</button>
      </div>
      <div className={styles.rowGenerate}>
        <button>Generate Report</button>
      </div>
      {renderResults()}
    </div>
  )
}

const mapStateToProps = (state: AppState) => {
  const getImageURL = (id: number) => {
    return `http://localhost:3000/api/v1/image?id=${id}`
  }

  return {
    imageURL: getImageURL(state.app.imageID),
    screen: state.app.screen,
    marked: state.app.marked.map(m => ({
      id: m.imageID,
      imageURL: getImageURL(m.imageID),
      reasons: m.reasonIDs,
    })),
  }
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    markReal: () => dispatch(real()),
    showModal: () => dispatch(showModal()),
    showReport: () => dispatch(showReport()),
    remove: (id: number) => dispatch(remove({ id })),
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connect(mapStateToProps, mapDispatchToProps)(Picker)
