import { styled } from "@mui/system";

const Indicator = styled("div")({
  width: 7,
  height: 7,
  backgroundColor: "blue",
  borderRadius: "50%",
  boxShadow: "0 0 1px 1px blue",
});

const DotIndicator = () => {
  return <Indicator></Indicator>;
};

export default DotIndicator;
