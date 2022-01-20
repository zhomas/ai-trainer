import React, { FC, useEffect, useState } from "react";
import logo from "./logo.svg";
import {
  AppDispatch,
  AppState,
  useAppDispatch,
  useAppSelector,
} from "../store";
import styles from "./modal.module.css";
import { connect, ConnectedProps } from "react-redux";
import { toggleReason } from "./modal.slice";
import { confirm, SubmitPhotoPayload } from "../app.slice";
import { Dictionary } from "@reduxjs/toolkit";
type Props = ConnectedProps<typeof connector>;

const Modal: FC<Props> = ({ reasons, confirm }) => {
  const [otherReason, setOtherReason] = useState("");

  const [checked, setChecked] = useState<Dictionary<boolean>>({});

  const handleToggle = (id: number) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
  };

  const handleSubmit = () => {
    const reasonIDs = reasons.map((r) => r.id).filter((id) => checked[id]);
    confirm({ reasonIDs, otherReason });
  };

  const checkedCount = Object.values(checked).filter((ch) => !!ch).length;
  const buttonEnabled = checkedCount > 0 || otherReason;

  return (
    <div className={styles.modal}>
      <h3>Why</h3>
      <div>
        {reasons.map((r, i) => (
          <label>
            {r.label}
            <input
              value={r.id}
              checked={!!checked[r.id]}
              onChange={() => handleToggle(r.id)}
              type="checkbox"
            />
          </label>
        ))}
      </div>
      <label>
        Other:
        <input
          type="text"
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value)}
        />
      </label>
      <div>
        <button>Cancel</button>
        <button onClick={handleSubmit} disabled={!buttonEnabled}>
          Confirm
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    reasons: state.app.reasons,
    selected: state.modal.selected,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    select: (id: string) => {
      dispatch(toggleReason({ id }));
    },
    confirm: (arg: SubmitPhotoPayload) => {
      dispatch(confirm(arg));
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Modal);
