import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const cardStyle = {
  // mx: 0.6,
  mb: 1.5,
  bgcolor: "lightgray",
  color: "black",
  borderRadius: 2,
  "&:hover": {
    bgcolor: "lightblue",
  },
};

const preventTextOverflow = {
  maxWidth: 190,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const UserSearchItem = ({ user, handleFunc }) => {
  return (
    <>
      <Card sx={cardStyle} onClick={handleFunc}>
        <CardActionArea>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 0.5,
              pl: 1.5,
            }}
          >
            <Avatar
              sx={{ bgcolor: "black" }}
              src={user.pic || "no"}
              alt={user.fullname}
            />
            <div>
              <Typography component="h2" variant="h6" sx={preventTextOverflow}>
                {user.fullname}
              </Typography>
              <Typography
                component="h3"
                variant="caption"
                sx={preventTextOverflow}
              >
                <strong>username : </strong>
                {user.username}
              </Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default UserSearchItem;
