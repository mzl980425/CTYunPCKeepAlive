import { FC, Fragment, ReactNode } from "react";
import BottomBar from "../../components/BottomBar";
import "./index.less";

const AppLayout: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <Fragment>
      {children}

      <BottomBar />
    </Fragment>
  );
};

export default AppLayout;
