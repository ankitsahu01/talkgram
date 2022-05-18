import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useSelector, useDispatch } from "react-redux";
import { toggleColorMode } from "../../stateFeatures/colorModeSlice";

const Colormodeswitch = () => {
  const colorMode = useSelector((state) => state.colorMode);
  const dispatch = useDispatch();
  return (
    <>
      <IconButton onClick={() => dispatch(toggleColorMode())}>
        {colorMode === "light" ? (
          <Brightness4Icon color="primary" />
        ) : (
          <Brightness7Icon color="primary" />
        )}
      </IconButton>
    </>
  );
};

export default Colormodeswitch;
