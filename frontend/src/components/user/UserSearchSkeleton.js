import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const UserSearchSkeleton = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1.5 }}>
      <Skeleton variant="circular" animation="wave" width={50} height={40} />
      <Box sx={{ width: "100%" }}>
        <Skeleton animation="wave" height={35} />
        <Skeleton animation="wave" height={20} />
      </Box>
    </Box>
  );
};

export default UserSearchSkeleton;
