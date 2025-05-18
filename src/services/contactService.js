import api from "./api";

const contactService = {
  sendContact: async (contact) => {
    try {
      const response = await api.post(`/api/contacts`, contact);

      if (response.success && response.data?.id) {
        return response.data.id;
      }
    } catch (error) {
      console.log("Can not send contact ", error.message);
    }

    return false;
  },
};

export default contactService;
