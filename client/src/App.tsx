import React, { FC, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AppDispatch, AppState, useAppDispatch, useAppSelector } from "./store";
import { initialise, real, unreal } from "./app.slice";
import { connect, ConnectedProps } from "react-redux";
import Modal from "./modal/Modal";

type Props = ConnectedProps<typeof connector>;

const App: FC<Props> = ({ markReal, markUnreal, imageURL, showModal }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initialise());
  }, []);

  return (
    <div className="App">
      <div className={"active-image"}>
        <img src={imageURL} />
      </div>
      <div>
        <button onClick={markReal}>Real</button>
        <button onClick={markUnreal}>Not real</button>
      </div>
      <div>{}</div>
      {showModal && <Modal />}
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  const getImageURL = (id: number) => {
    return `http://localhost:3000/api/v1/image?id=${id}`;
  };

  return {
    imageURL: getImageURL(state.app.imageID),
    showModal: state.app.screen === "modal",
    marked: state.app.marked.map((m) => ({
      imageURL: getImageURL(m.imageID),
      labels: [""],
    })),
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    markReal: () => dispatch(real()),
    markUnreal: () => dispatch(unreal()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connect(mapStateToProps, mapDispatchToProps)(App);
