import isElectron from "is-electron";
import React, { useCallback, useContext, useEffect, useState } from "react";

import { BladeStatus } from "~/types/tractor/blade";

export interface BladeContext {
  bladeStatus: BladeStatus | undefined;
}

export const BladeContext = React.createContext<BladeContext>(
  {} as BladeContext
);

interface ProvideBladeProps {
  children: JSX.Element;
}

/**
 * The ProvideAction provides the current action context and handle action updates
 */
export const ProvideBlade = ({ children }: ProvideBladeProps): JSX.Element => {
  const [bladeStatus, setBladeStatus] = useState<BladeStatus>();

  const onBladeStatus = useCallback(
    (data: BladeStatus) => setBladeStatus(data),
    []
  );

  useEffect(() => {
    if (isElectron()) {
      window.electron.receive<BladeStatus>("bladeStatusUpdate", onBladeStatus);
    }

    return () => {
      if (isElectron())
        window.electron.removeListener("bladeStatusUpdate", onBladeStatus);
    };
  }, [onBladeStatus]);

  return (
    <BladeContext.Provider
      value={{
        bladeStatus,
      }}
    >
      {children}
    </BladeContext.Provider>
  );
};

export const useBlade = (): BladeContext => useContext(BladeContext);
