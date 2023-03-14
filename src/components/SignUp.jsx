

import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { config } from "../config.js";
import axios from "axios";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [shows, setShows] = useState(false);
  const navigate = useNavigate();

  let handleClick = () => {
    setShow(!show);
  };

  let handleClick1 = () => {
    setShows(!shows);
  };

  let formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      pic: "",
    },

    validate: (values) => {
      let errors = {};
      if (values.name === "") {
        errors.name = "Please enter your name  ";
      }
      if (values.email === "") {
        errors.email = "Please enter your email  ";
      }
      if (values.password === "") {
        errors.password = "Password should not be empty";
      }
      return errors;
    },

    onSubmit: async (values, { resetForm }) => {
      if (values.email && values.password) {
        try {
          if (values.email && values.password) {
            let loginData = await axios.post(
              `${config.api}/users/register`,
              values
            );
            let stringy = JSON.stringify(loginData.data.result);
            if (loginData.status) {
              alert("User Created");
              window.localStorage.setItem("app-token", loginData.data.token);
              window.localStorage.setItem("User", stringy);
              navigate("/chats");
            }
          }
          resetForm();
        } catch (err) {
          alert(err.response.data.message);
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <VStack spacing="5px">
        <FormControl>
          <FormLabel color="black">
            Name
            <Input
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              placeholder="Enter your name"
            ></Input>
            <span style={{ color: "red" }}>{formik.errors.name}</span>
          </FormLabel>
        </FormControl>
        <FormControl>
          <FormLabel color="black">
            Email
            <Input
              value={formik.values.email}
              onChange={formik.handleChange}
              name="email"
              placeholder="Enter your Email"
            ></Input>
            <span style={{ color: "red" }}>{formik.errors.email}</span>
          </FormLabel>
        </FormControl>
        <FormControl>
          <FormLabel color="black">
            Password
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                color="black"
                placeholder="Enter your password"
              />
              <InputRightElement>
                <Button
                  color="black"
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormLabel>
        </FormControl>
        <FormControl>
          <FormLabel color="black">
            Confirm Password
            <InputGroup>
              <Input
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
                type={shows ? "text" : "password"}
                color="black"
                placeholder="Enter your Confirm password"
              />
              <InputRightElement>
                <Button
                  color="black"
                  h="1.75rem"
                  size="sm"
                  onClick={handleClick1}
                >
                  {shows ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <span style={{ color: "red" }}>{formik.errors.password}</span>
          </FormLabel>
        </FormControl>
        <FormControl>
          <FormLabel color="black">
            Upload your Picture
            <Input
              value={formik.values.pic}
              onChange={formik.handleChange}
              name="pic"
              placeholder="Add Image"
            ></Input>
          </FormLabel>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default SignUp;
