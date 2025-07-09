import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance";

const getBooksById = async (id: number) => {
  try {
    // const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`/books/${id}/detail`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    // toast.success("🎉 Lấy thông tin bài báo thành công!");
    return response.data.data;
  } catch (error) {
    console.error("❌ Error in getBook:", error);
    return null;
  }
};

const getAllBooksWithSizeAndPage = async (
  page: number,
  size: number,
  setBooks: (books: any[]) => void,
  setTotalPages: (pages: number) => void,
  setTotalElements: (elements: number) => void,
  change: string,
  content: string | undefined = "" // Thêm giá trị mặc định
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ Không tìm thấy token!");
      return;
    }

    const res = await axiosInstance.get(
      `/books/all?page=${page}&size=${size}&sort=discountPrice,${change}&filter=title ~ '${content}' OR author.name ~ '${content}'`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // console.log("✅ API trả về:", res.data);
    setBooks(res.data?.data?.data || []);
    console.log("Danh sách sách:", res.data?.data?.data);
    setTotalPages(res.data?.data?.meta?.totalPages);
    // setPage(res.data?.data?.meta?.page);
    // console.log("trang hien tai:", res.data?.data?.meta?.page);
    setTotalElements(res.data?.data?.meta?.totalElements);
    console.log("Tổng số trang:", res.data?.data?.meta?.totalPages);
    console.log("Tổng số sách:", res.data?.data?.meta?.totalElements);
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi lấy danh sách:",
      error.response?.data || error.message
    );
  }
};

const getAllBooksPreview = async (
  page: number,
  size: number,
  setBooks: (books: any[]) => void,
  setTotalPages: (pages: number) => void,
  setTotalElements: (elements: number) => void,
  change: string,
  content: string | undefined = "" // Thêm giá trị mặc định cho content
) => {
  try {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   console.error("❌ Không tìm thấy token!");
    //   return;
    // }

    const res = await axiosInstance.get(
      `/books/preview?page=${page}&size=${size}&sort=finalPrice,${change}&filter=title ~ '${content}' OR author.name ~ '${content}'`
      // {
      //   headers: { Authorization: `Bearer ${token}` },
      // }
    );

    // console.log("✅ API trả về:", res.data);
    setBooks(res.data?.data?.data || []);
    // console.log("Danh sách sách:", res.data?.data?.data);
    setTotalPages(res.data?.data?.meta?.totalPages);
    // setPage(res.data?.data?.meta?.page);
    // console.log("trang hien tai:", res.data?.data?.meta?.page);
    setTotalElements(res.data?.data?.meta?.totalElements);
    // console.log("Tổng số trang:", res.data?.data?.meta?.totalPages);
    // console.log("Tổng số sách:", res.data?.data?.meta?.totalElements);
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi lấy danh sách:",
      error.response?.data || error.message
    );
  }
};

const handleDeleteBook = async (
  id: number,
  setBooks: (books: any) => void,
  setTotalElements: (
    elements: number | ((prevElements: number) => number)
  ) => void
) => {
  toast(
    (t) => (
      <div className="flex flex-col">
        <span>Bạn có chắc muốn xóa quyển sách này không?</span>
        <div className="mt-2 flex justify-end space-x-2 mr-auto">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const token = localStorage.getItem("token");
                if (!token) {
                  console.error("❌ Không tìm thấy token!");
                  toast.error("Bạn chưa đăng nhập!");
                  return;
                }

                await axiosInstance.delete(`/books/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                setBooks((prevBooks: any[]) =>
                  prevBooks.filter((book) => book.id !== id)
                );
                if (setTotalElements) {
                  setTotalElements((prevTotal) => Math.max(prevTotal - 1, 0));
                }
                toast.success("🗑 Xóa sách thành công!");
              } catch (error: any) {
                console.error("❌ Lỗi khi xóa sách:", error);
                toast.error(
                  error.response?.data?.error || "Xóa sách thất bại!"
                );
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Xóa
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Hủy
          </button>
        </div>
      </div>
    ),
    { duration: Infinity }
  );
};

const getAllBooksWithCategoryId = async (
  page: number,
  size: number,
  setBooks: (books: any[]) => void,
  setTotalPages: (pages: number) => void,
  setTotalElements: (elements: number) => void,
  change: string,
  // content,
  id: number
) => {
  try {
    const res = await axiosInstance.get(
      `/books/all-by-category-id/${id}?page=${page}&size=${size}&sort=finalPrice,${change}`
    );

    setBooks(res.data?.data?.data || []);
    // console.log(
    //   "Danh sách sách theo thể loại sách-777777:",
    //   res.data?.data?.data
    // );
    setTotalPages(res.data?.data?.meta?.totalPages);
    setTotalElements(res.data?.data?.meta?.totalElements);
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi lấy danh sách sách theo thể loại sách:",
      error.response?.data || error.message
    );
  }
};

const getAllBooksWithAuthorId = async (
  page: number,
  size: number,
  setBooks: (books: any[]) => void,
  setTotalPages: (pages: number) => void,
  setTotalElements: (elements: number) => void,
  change: string,
  // content,
  id: number
) => {
  try {
    const res = await axiosInstance.get(
      `/books/all-by-author-id/${id}?page=${page}&size=${size}&sort=finalPrice,${change}`
    );

    setBooks(res.data?.data?.data || []);
    console.log(
      "Danh sách sách theo thể loại sách-777777:",
      res.data?.data?.data
    );
    setTotalPages(res.data?.data?.meta?.totalPages);
    setTotalElements(res.data?.data?.meta?.totalElements);
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi lấy danh sách sách theo thể loại sách:",
      error.response?.data || error.message
    );
  }
};

const getTotalBookQuantity = async (setTotalBooks: (total: number) => void) => {
  try {
    const res = await axiosInstance.get(`/books/preview`);

    setTotalBooks(res.data?.data?.meta?.totalElements);
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi lấy số lượng sách:",
      error.response?.data || error.message
    );
  }
};

const getTopBooks = async (
  page: number,
  size: number,
  setBooks: (books: any[]) => void
) => {
  try {
    const res = await axiosInstance.get(
      `/books/preview?page=${page}&size=${size}`
    );
    setBooks(res.data?.data?.data || []);
  } catch (error: any) {
    console.error(
      "❌ Lỗi khi lấy danh sách:",
      error.response?.data || error.message
    );
  }
};

export {
  getBooksById,
  getAllBooksWithSizeAndPage,
  handleDeleteBook,
  getAllBooksWithCategoryId,
  getAllBooksPreview,
  getAllBooksWithAuthorId,
  getTotalBookQuantity,
  getTopBooks,
};
