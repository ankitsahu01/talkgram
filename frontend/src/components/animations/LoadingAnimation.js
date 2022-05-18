import { styled } from "@mui/system";

const LoadingComp = styled("div")({
  width: 8,
  height: 8,
  marginLeft: 12,
  borderRadius: "50%",
  backgroundColor: "#212121",
  animation: "dotLoading 1s infinite linear",

  "&::before, &::after": {
    content: '""',
    position: "absolute",
    borderRadius: "50%",
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: "#212121",
  },
  "&::before": {
    left: -10,
    animation: "dotLoadingBefore 1s infinite linear",
  },
  "&::after": {
    left: 10,
    animation: "dotLoadingAfter 1s infinite linear",
  },

  "@keyframes dotLoadingBefore": {
    "0%, 75%, 100%": {
      transform: "scale(1, 1)",
    },
    "25%": {
      transform: "scale(1, 1.5)",
    },
    "50%": {
      transform: "scale(1, 0.6)",
    },
  },
  "@keyframes dotLoading": {
    "0%, 25%, 75%, 100%": {
      transform: "scale(1, 1)",
    },
    "50%": {
      transform: "scale(1, 1.5)",
    },
  },
  "@keyframes dotLoadingAfter": {
    "0%, 25%, 100%": {
      transform: "scale(1, 1)",
    },
    "50%": {
      transform: "scale(1, 0.6)",
    },
    "75%": {
      transform: "scale(1, 1.5)",
    },
  },
});

const LoadingAnimation = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 42,
        height: 15,
        padding: 2,
        top: 5,
      }}
    >
      <LoadingComp></LoadingComp>
    </div>
  );
};

export default LoadingAnimation;
