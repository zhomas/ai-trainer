import { FC } from "react";
import "./App.css";
import { AppDispatch, AppState } from "./store";
import { real, showReport, unreal } from "./app.slice";
import { connect, ConnectedProps } from "react-redux";
import Report from "./report/Report";
import Modal from "./modal/Modal";
import Picker from "./picker/Picker";

type Props = ConnectedProps<typeof connector>;

const App: FC<Props> = ({ screen }) => {
  if (screen === "report") {
    return <Report />;
  }

  return (
    <>
      <Picker />
      {screen === "modal" && <Modal />}
    </>
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
