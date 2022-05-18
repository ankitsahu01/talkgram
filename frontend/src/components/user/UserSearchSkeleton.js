import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

const UserSearchSkeleton = () => {
  return (
    <Grid container alignItems="center" sx={{ mt: 2 }}>
      <Grid item xs={3}>
        <Skeleton variant="circular" animation="wave" width={40} height={40} />
      </Grid>
      <Grid item xs={9}>
        <Skeleton animation="wave" height={35} />
        <Skeleton animation="wave" height={20} />
      </Grid>
    </Grid>
  );
};

export default UserSearchSkeleton;
