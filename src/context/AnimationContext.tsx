import { Box, Fade } from "@mui/material";
import React, { useContext, useState } from "react";

import SilexCoinsAnimation from "~/components/common/animations/SilexCoinsAnimation";

export interface AnimationContext {
  triggerSilexCoinsAnimation: (nCoins: number) => void;
}

export const AnimationContext = React.createContext<AnimationContext>(
  {} as AnimationContext
);

interface ProvideAnimationProps {
  children: JSX.Element;
}

/**
 * The ProvideAnimation is used to display animations on top of the page
 */
export const ProvideAnimation = ({
  children,
}: ProvideAnimationProps): JSX.Element => {
  const [silexCoins, setSilexCoins] = useState<{ on: boolean; nCoins: number }>(
    { on: false, nCoins: 0 }
  );

  const triggerSilexCoinsAnimation = (nCoins: number) => {
    setSilexCoins({ on: true, nCoins });
    setTimeout(() => setSilexCoins((old) => ({ ...old, on: false })), 10000);
  };

  return (
    <AnimationContext.Provider value={{ triggerSilexCoinsAnimation }}>
      <>
        {children}

        <Fade in={silexCoins.on} unmountOnExit timeout={1000}>
          <Box>
            <SilexCoinsAnimation nCoins={silexCoins.nCoins} />
          </Box>
        </Fade>
      </>
    </AnimationContext.Provider>
  );
};

export const useAnimation = (): AnimationContext =>
  useContext(AnimationContext);
