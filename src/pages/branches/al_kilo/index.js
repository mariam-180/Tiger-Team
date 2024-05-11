// @mui material components
import Grid from "@mui/material/Grid";

// Components
import CUBox from "../../components/CUBox";

// Reservations page sections
import Reservation from "./sections/Reservation";
import DefaultNavbar from "../../examples/Navbars/DefaultNavbar";

// Routes
import routes from "../../routes";
// import footerRoutes from "footer.routes";

// Images
import bgImage from "../../assets/images/bg-coworking.jpeg";

function Reservations() {
  return (
    <>
      <Grid>
        <CUBox position="fixed" top="0.5rem" width="100%" zIndex="1">
          <DefaultNavbar routes={routes} />
        </CUBox>
        <Grid
          minHeight="45vh"
          width="100%"
          sx={{
            backgroundImage: ({
              functions: { linearGradient, rgba },
              palette: { gradients },
            }) =>
              `${linearGradient(
                rgba(gradients.dark.main, 0.6),
                rgba(gradients.dark.state, 0.6)
              )}, url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "grid",
            placeItems: "center",
          }}
        ></Grid>
        <Reservation />
      </Grid>
    </>
  );
}

export default Reservations;
