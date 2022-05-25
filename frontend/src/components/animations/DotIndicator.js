import { styled } from "@mui/system";

const Indicator = styled("div")({
  width: 8,
  height: 8,
  backgroundColor: "blue",
  borderRadius: "50%",
});

const DotIndicator = () => {
  return <Indicator></Indicator>;
};

export default DotIndicator;
