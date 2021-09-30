import {
  Paper,
  Table,
  TableRow,
  TableCell,
  Typography,
  TableBody,
} from "@mui/material";
import Box from "@mui/material/Box";

import { useAuth } from "context";
import PageWrapper from "../PageWrapper/PageWrapper";
import { PersonAvatar } from "components/avatar";

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  if (!auth.user) return null;
  const user = auth.user;

  const userData = [
    ["First name", user.first_name],
    ["Last name", user.last_name],
    ["Role", user.role],
  ];

  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Paper elevation={5} sx={{ width: "50%", m: 5, p: 5, borderRadius: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <PersonAvatar person={auth.user} size={100} fontSize={40} />
          </Box>

          <Table component="table">
            <TableBody>
              {userData.map((data, i) => (
                <TableRow key={i}>
                  <TableCell align="left">{data[0]}</TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">{data[1]}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </PageWrapper>
  );
};

export default ProfilePage;
