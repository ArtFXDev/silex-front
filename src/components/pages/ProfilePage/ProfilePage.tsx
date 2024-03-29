import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import { PersonAvatar } from "~/components/common/avatar";
import { useAuth } from "~/context";

import PageWrapper from "../PageWrapper/PageWrapper";

const ProfilePage = (): JSX.Element => {
  const auth = useAuth();
  if (!auth.user) return <div>NO USER</div>;
  const user = auth.user;

  const userData = [
    ["First name", user.first_name],
    ["Last name", user.last_name],
    ["Role", user.role],
  ];

  return (
    <PageWrapper goBack>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Paper elevation={5} sx={{ width: "50%", p: 5, borderRadius: 3 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <PersonAvatar person={auth.user} size={100} fontSize={40} />
          </div>

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
