// src/components/auth/SignupForm.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema } from "../../utils/validators";
import { register, reset } from "../../features/auth/authSlice";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

const SignupForm = () => {
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
    const { confirmPassword, ...userData } = values;
    dispatch(register(userData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Create Account
      </h2>

      {isError && <Alert type="error" message={message} duration={5000} />}

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={signupSchema}
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

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="********"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
            />

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Already have an account?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default SignupForm;
