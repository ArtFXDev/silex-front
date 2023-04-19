import { Fade, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import NotFoundImage from "~/assets/images/404.png";

/**
 * 404 fallback page
 */
const NotFoundPage = (): JSX.Element => {
  return (
    <Fade in timeout={500}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <img src={NotFoundImage} alt="404" width="600" />

        <Typography color="text.disabled" variant="h6" sx={{ mt: 1 }}>
          Silex is rock solid but... the requested page does not exist!
        </Typography>

        <Link
          component={RouterLink}
          to="/"
          color="#62c673"
          sx={{ mt: 2, fontSize: 20 }}
        >
          Go home
        </Link>
      </div>
    </Fade>
  );
};

export default NotFoundPage;
