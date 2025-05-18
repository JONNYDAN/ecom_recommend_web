import DetailError from "@/utils/DetailError";
import api from "./api";
import { cleanObject } from "@/utils/objectUtils";

export const AUTH_ERROR = {
  UNVERIFIED_EMAIL: "UNVERIFIED_EMAIL",
};

const authService = {
  login: async ({ email, password }) => {
    try {
      return await api.post("/api/user/login", { email, password });
      
    } catch (error) {
      throw new DetailError(error.response?.data?.message, "LOGIN_FAILED");
    }
  },

  register: async ({name, email, level, password }) => {
    try {
      return await api.post("/api/user/register", {
        name,
        email,
        level,
        password,
      });
    } catch (error) {
      return new DetailError(error.response?.data?.message, "REGISTER_FAILED");
    }
  },

  getUserInfo: async (options) => {
    try {
      const response = await api.get(`/api/user/me`, options);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response?.error?.detail || "Some error occured!");
      }
    } catch (error) {
      console.log("Can not get user info:", error?.message);
      return null;
    }
  },
  
  getUserExamHistory: async (options, page, page_size) => {
    const params = { page, page_size };
    try {
      const response = await api.get("/api/exam/course-histories", {
        params,
        ...options,
      });
  
      if (response.success) {
        return response;
      } else {
        throw new Error(response?.error?.detail || "Some error occurred!");
      }
    } catch (error) {
      console.log("Can not get user orders:", error?.message);
      return null;
    }
  },

  updateUserInfo: async (formData) => {
    try {
      const response = await api.patch("/api/user/updateme", formData);

        if (response.success) {
            return response;
        } else {
            throw new Error(response.data.message || "Failed to update user info.");
        }

    } catch (error) {
        console.error("Can not update user info:", error?.response?.data?.message || error.message);
        return error?.response?.data?.message || "An error occurred while updating user info.";
    }
  },


  changePassword: async ({ currentPassword, newPassword }) => {
    let errorMessage = "";
    try {
        // Kiểm tra mật khẩu không được để trống
        if (!currentPassword || !newPassword) {
            errorMessage = "Password cannot be blank.";
            return errorMessage;
        }

        // Kiểm tra mật khẩu mới không được trùng với mật khẩu hiện tại
        if (currentPassword === newPassword) {
            errorMessage = "The new password cannot be the same as the current password.";
            return errorMessage;
        }

        // Kiểm tra độ dài mật khẩu mới (ít nhất 8 ký tự)
        if (newPassword.length < 8) {
            errorMessage = "New password must be at least 8 characters.";
            return errorMessage;
        }

        // Nếu kiểm tra hợp lệ, gửi yêu cầu API
        const response = await api.put(
            "/api/user/update-password",
            { current_password: currentPassword, new_password: newPassword }
        );

        console.log("Update Response:", response);
        if (response.success) {
            return response;
        }

    } catch (error) {
        errorMessage = error?.response?.data?.message || "An error occurred while updating user info.";
        console.error("Can not update user info:", error?.response?.data?.message || error.message);
        return errorMessage
    }
},


  activateCode: async ({ code }, options) => {
    try {
      const response = await api.post(
        "/api/code/activate",
        { code: code },
        options
      );

      if (response.success) {
        return response.success;
      } else {
        throw new Error(response?.error?.detail || "Some error occured!");
      }
    } catch (error) {
      console.log("Can not change password:", error?.message);
      return false;
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await api.post("/api/auth/forget-password", {
        email,
      });

      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response?.error?.detail || "Some error occured!");
      }
    } catch (error) {
      console.log("Can not reset password:", error?.message);
      return {
        error: error.message,
      };
    }
  },

  requestVerifyEmail: async ({ email }) => {
    try {
      const response = await api.post("/api/auth/request-verify-mail", {
        email,
      });

      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response?.error?.detail || "Some error occured!");
      }
    } catch (error) {
      console.log("Can not request to verify email:", error?.message);
      return {
        error: error.message,
      };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await api.post("/api/auth/request-verify-mail", {
        token,
      });

      if (response.success) {
        return { success: true };
      } else {
        throw new Error(response?.error?.detail || "Some error occured!");
      }
    } catch (error) {
      console.log("Can not verify email:", error?.message);
      return {
        error: error.message,
      };
    }
  },

  resetPassword: async ({ password, token }) => {
    try {
      const response = await api.post("/api/auth/reset-password", {
        password,
        token,
      });

      if (response.success) {
        return response.success;
      } else {
        throw new Error(response?.error?.detail || "Some error occured!");
      }
    } catch (error) {
      console.log("Can not reset password:", error?.message);
      return false;
    }
  },

  getGoogleLoginUrl: async () => {
    try {
      const response = await api.get("/api/auth/google/login-url");
      if (response.success) {
        return response.data.login_url;
      }
    } catch (error) {
      return null;
    }
  },

  // TODO: hasn't implemented yet - BE remove token
  logout: async () => {
    try {
      const response = await api.post("/api/auth/logout");
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
