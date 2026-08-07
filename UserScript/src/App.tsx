import { FC } from "react";
import { useEventListener, useUpdate } from "ahooks";
import AntLayout from "./layouts/AntLayout";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import ExternalLayout from "./layouts/ExternalLayout";
import Login from "./pages/Login";
import DesktopList from "./pages/DesktopList";

const App: FC<{}> = () => {
  const update = useUpdate();
  useEventListener("pushstate", () => update());
  useEventListener("replacestate", () => update());
  useEventListener("hashchange", () => update());

  return (
    <AntLayout>
      <AuthLayout>
        <ExternalLayout>
          <AppLayout>
            {location.hash.startsWith("#/login") ? (
              <Login />
            ) : location.hash.startsWith("#/desktop-list") ? (
              <DesktopList />
            ) : null}
          </AppLayout>
        </ExternalLayout>
      </AuthLayout>
    </AntLayout>
  );
};

export default App;
