// src/components/auth/LoginForm.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../utils/validators";
import { login, reset } from "../../features/auth/authSlice";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  React.useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard");
    }

    return () => {
      dispatch(reset());
    };
  }, [isSuccess, navigate, dispatch]);

  const handleSubmit = (values) => {
    dispatch(login(values));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Sign In
      </h2>

      {isError && <Alert type="error" message={message} duration={5000} />}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="********"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Don't have an account?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Sign In
            </Button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default LoginForm;
