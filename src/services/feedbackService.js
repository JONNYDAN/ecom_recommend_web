import { API_URL } from '@/config/constants';

export const feedbackService = {
  // Get all feedbacks
  async getAllFeedbacks() {
    try {
      const response = await fetch(`${API_URL}/api/feedbacks`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      return { success: false, message: error.message };
    }
  },

  // Submit a new feedback
  async submitFeedback(feedbackData) {
    try {
      const response = await fetch(`${API_URL}/api/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, message: error.message };
    }
  },

  // Get feedback by ID
  async getFeedbackById(id) {
    try {
      const response = await fetch(`${API_URL}/api/feedbacks/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching feedback with ID ${id}:`, error);
      return { success: false, message: error.message };
    }
  }
};
