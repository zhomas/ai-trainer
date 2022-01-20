import { FC } from "react";
import "./App.css";
import { AppDispatch, AppState } from "./store";
import { real, showReport, unreal } from "./app.slice";
import { connect, ConnectedProps } from "react-redux";
import Report from "./report/Report";
import Modal from "./modal/Modal";

type Props = ConnectedProps<typeof connector>;

const App: FC<Props> = ({
  markReal,
  markUnreal,
  imageURL,
  screen,
  marked,
  showReport,
}) => {
  if (screen === "report") {
    return <Report />;
  }

  return (
    <div className="App">
      <div className={"active-image"}>
        <img src={imageURL} />
      </div>
      <div>
        <button onClick={markReal}>Real</button>
        <button onClick={markUnreal}>Not real</button>
      </div>
      <button onClick={showReport}>Show Report</button>
      <div>
        {marked.map((item) => (
          <div>
            <img src={item.imageURL} />
          </div>
        ))}
      </div>
      {screen === "modal" && <Modal />}
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  const getImageURL = (id: number) => {
    return `http://localhost:3000/api/v1/image?id=${id}`;
  };

  return {
    imageURL: getImageURL(state.app.imageID),
    screen: state.app.screen,
    marked: state.app.marked.map((m) => ({
      imageURL: getImageURL(m.imageID),
      reasons: m.reasonIDs,
    })),
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    markReal: () => dispatch(real()),
    markUnreal: () => dispatch(unreal()),
    showReport: () => dispatch(showReport()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(App);
