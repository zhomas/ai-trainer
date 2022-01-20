import React, { FC } from "react";
import { connect, ConnectedProps } from "react-redux";
import { reportSelector } from "../app.slice";
import { AppState } from "../store";

type Props = ConnectedProps<typeof connector>;

const Report: FC<Props> = ({ groups }) => {
  return (
    <div>
      {groups.map((group) => (
        <>
          <h2>{group.label}</h2>
          <div>
            {group.photos.map((url) => (
              <img src={url} />
            ))}
          </div>
        </>
      ))}
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    groups: reportSelector(state),
  };
};

const connector = connect(mapStateToProps);

export default connector(Report);
