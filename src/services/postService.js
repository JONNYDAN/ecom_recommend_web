import { capitalize } from "lodash-es";
import querystring from "querystring";

import api, { customReponseTypeApi } from "./api";

const TEST_DATA = [
  {
      "id": "4077f479-975d-42bd-8123-ab17d529e6a7",
      "slug": "word-press-la-gi",
      "title": "WORDPRESS LÀ GÌ? HƯỚNG DẪN THIẾT KẾ WEB WORDPRESS CHI TIẾT",
      "description": "<p><strong>Nature's Gift</strong> designed to streamline your online experience. With a user-friendly interface and robust functionality, our platform offers a range of features to enhance your productivity and convenience.<strong></strong>\r\n</p><ul>\r\n<li><strong><em>Real-time Monitoring</em></strong>: Keep track of vital data such as temperature, humidity, and CO2 levels with seamless real-time monitoring capabilities.</li>\r\n<li><strong><em>IoT Device Control</em></strong>: Remotely manage your IoT devices using the MQTT protocol, enabling convenient on/off control from anywhere.</li>\r\n<li><strong><em>Setting Updates</em></strong>: Easily update settings for your IoT devices through our intuitive interface, ensuring optimal performance and customization.</li>\r\n<li><strong><em>Data Visualization</em></strong>: Gain insights into your environment through interactive data visualization tools, allowing for better decision-making.</li>\r\n</ul>\r\n<p></p>",
      "created_by": "admin",
      "created_at": "2021-09-21T00:00:00.000Z",
      "content": `   <div>
      <h1>WordPress Là Gì?</h1>
      <p>WordPress là một hệ quản trị nội dung (Content Management System - CMS) mã nguồn mở, được viết bằng ngôn ngữ lập trình PHP và sử dụng cơ sở dữ liệu MySQL. Nó là một trong những nền tảng phổ biến nhất để xây dựng và quản lý các trang web, từ blog cá nhân đến các trang web doanh nghiệp lớn.</p>
      <p>WordPress ban đầu được ra mắt vào năm 2003 bởi Matt Mullenweg và Mike Little. Kể từ đó, nó đã phát triển thành một công cụ mạnh mẽ với hàng ngàn plugin và chủ đề (themes) có sẵn, cho phép người dùng dễ dàng tùy chỉnh và mở rộng chức năng của trang web mà không cần phải có kiến thức sâu về lập trình.</p>
      <p>Một số lý do khiến WordPress trở nên phổ biến bao gồm:</p>
      <ul>
          <li><strong>Miễn phí và mã nguồn mở:</strong> WordPress là một phần mềm miễn phí, và mã nguồn của nó được mở để mọi người có thể đóng góp và cải tiến.</li>
          <li><strong>Dễ sử dụng:</strong> Giao diện người dùng thân thiện và dễ hiểu, giúp người dùng nhanh chóng làm quen và quản lý nội dung trên trang web của mình.</li>
          <li><strong>Đa dạng plugin và chủ đề:</strong> WordPress có một thư viện khổng lồ các plugin và chủ đề, cho phép người dùng dễ dàng thêm tính năng và tùy chỉnh giao diện theo ý muốn.</li>
          <li><strong>SEO thân thiện:</strong> WordPress được thiết kế tối ưu hóa cho công cụ tìm kiếm, giúp cải thiện thứ hạng trang web trên các trang kết quả tìm kiếm.</li>
          <li><strong>Cộng đồng hỗ trợ lớn:</strong> WordPress có một cộng đồng người dùng và nhà phát triển rộng lớn, luôn sẵn sàng giúp đỡ và chia sẻ kiến thức.</li>
      </ul>
      <p>Với những ưu điểm nổi bật này, không có gì ngạc nhiên khi WordPress được lựa chọn bởi hàng triệu người dùng trên toàn thế giới.</p>
  </div>`,
      "thumbnail": "http://localhost:8080/public",
      "menu": [
        {
            "title": "Wordpress là gì",
            "id": "#overview"
        },
        {
            "title": "Lịch sử hình thành sơ lược về wordpress",
            "id": "#install"
        },
        {
            "title": "Ưu và nhược điểm của wordpress",
            "id": "#config"
        },
        {
            "title": "Sử dụng wordpress để thiết kế website",
            "id": "#use"
        }
      ]
  }]

const postService = {
  getListPost: async (queryParams = {}) => {
    try {
      const queryStr = querystring.stringify(queryParams);
      const url = `/api/post/posts-list${queryStr ? `?${queryStr}` : ''}`;
      const response = await api.get(url);

      if (response.success) {
        return {
          data: response.data,
          totalPage: response.total_page,
          page: response.page,
        };
      }
    } catch (error) {
      console.log("Can not get post", error.message);
    }

    return { data: [], totalPage: 0 };
  },

  getRelatedPost: async (slug) => {
    if (!slug) {
      return null;
    }
    try {
      const response = await api.get(`/api/post/slugs/${slug}/related`);

      if (response.success) {
        return {
          data: response.data,
        };
      }
    } catch (error) {
      console.log("Can not get related post", error.message);
    }

    return { data: [], totalPage: 0 };
  },


  getPostBySlug: async (slug) => {
    if (!slug) {
      return null;
    }

    try {
      const response = await api.get(`/api/post/slugs/${slug}`);

      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.log("Can not get post detail ", error.message);
    }

    return TEST_DATA[0];
  },

};

export default postService;
