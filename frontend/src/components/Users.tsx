import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { User } from "../types";
import { Tooltip } from "@mui/material";
import _ from "lodash";

type UsersProps = {
  users: User[];
  clientUserId?: string;
};

function Users({ users, clientUserId }: UsersProps) {
  return (
    <Stack direction="row" spacing={2}>
      {users.map((user) => (
        <Tooltip
          key={user.id}
          title={_.startCase(user.nickname.split("-").join(" "))}
        >
          <Avatar
            sx={{
              backgroundImage: `linear-gradient(to right, ${user.color},rgb(245, 245, 245))`,
              border: clientUserId == user.id ? "3px solid blue" : "0px",
            }}
          >
            {user.nickname
              .split("-")
              .map((w) => _.toUpper(_.first(w)))
              .join("")}
          </Avatar>
        </Tooltip>
      ))}
    </Stack>
  );
}

export default Users;
