"use client";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
} from "@mui/material";
import TextField from "@mui/material/TextField";

import HttpsIcon from "@mui/icons-material/Https";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation"; /// route components server
import { useRouter } from "next/navigation"; ///route components client
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
// import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  paddingBlock: 20,
}));

const AuthSignIn = () => {
  const router = useRouter();
  // Handle Show Password
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUserName] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const [isUserName, setIsUserName] = useState<boolean>(false);
  const [isPassWord, setIsPassWord] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<string>("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleLoginUser = async (e: any) => {
    // e.preventDefault();
    setUserName("");
    setPassWord("");
    if (username === "") {
      setIsUserName(true);
    }
    if (password === "") {
      setIsPassWord(true);
    }
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    if (!res?.error) {
      router.push("/");
    } else {
      setIsError(true);
      setMessageError(res?.error);
    }
    // console.log("check res", res);
  };
  ///--------------------------------------------///

  const handleChangeUserName = (e: any) => {
    setUserName(e.target.value);
    setIsUserName(false);
  };
  const handleChangePassWord = (e: any) => {
    setPassWord(e.target.value);
    setIsPassWord(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        direction="row"
        sx={{ height: "100vh" }}
      >
        <Grid
          item
          xs={12}
          lg={4}
          sm={12}
          sx={{ boxShadow: "3px 4px 8px 3px rgba(0, 0, 0, 0.2)" }}
        >
          <Item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <HttpsIcon />
              <span>Sign in</span>
            </div>
            <TextField
              error={isUserName}
              helperText={isUserName === true ? "Vui lòng nhập userName" : " "}
              fullWidth
              label="UserName"
              type="UserName"
              sx={{ marginBottom: "20px" }}
              value={username}
              onChange={(e) => handleChangeUserName(e)}
            />
            <FormControl
              sx={{ marginBottom: "35px" }}
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                error={isPassWord}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                value={password}
                onChange={(e) => handleChangePassWord(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    //@ts-ignore
                    handleLoginUser();
                  }
                }}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {isPassWord === true ? "Vui lòng nhập Password" : ""}
              </FormHelperText>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              sx={{ marginBottom: "35px" }}
              onClick={(e) => handleLoginUser(e)}
            >
              SIGN IN
            </Button>
            <Divider sx={{ marginBottom: "25px" }}>
              <strong>Or Using</strong>
            </Divider>
            <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
              <GitHubIcon
                sx={{ fontSize: 40, color: "orange", cursor: "pointer" }}
                onClick={() => signIn("github")}
              />
              <GoogleIcon
                sx={{ fontSize: 40, color: "orange", cursor: "pointer" }}
                onClick={() => signIn("google")}
              />
            </div>
          </Item>
        </Grid>
      </Grid>
      <Snackbar
        open={isError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <>
            <IconButton aria-label="close" color="inherit" sx={{ p: 0.5 }}>
              <CloseIcon />
            </IconButton>
          </>
        }
      >
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setIsError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          severity="error"
        >
          {messageError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthSignIn;
