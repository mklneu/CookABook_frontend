import { FaSearch } from "react-icons/fa";
import { NavLink, useParams } from "react-router";
import { useEffect, useState } from "react";
import BookItem from "../components/common/BookItem";
import SidebarBooks from "../components/sideBar/sideBarBooks";
import {
  getAllBooksPreview,
  getAllBooksWithAuthorId,
  getAllBooksWithCategoryId,
} from "../services/BookServices";
import { getAllCategoriesWithSizeAndPage } from "../services/CategoryServices";
import toast from "react-hot-toast";

const Books = () => {
  const { idAuthor } = useParams(); // Lấy id từ URL
  const authorId = idAuthor ? parseInt(idAuthor) : undefined;
  // const navigate = useNavigate(); // Dùng để điều hướng

  interface Book {
    id: string;
    title: string;
    author: string;
    imageURL: string;
    originalPrice: number;
    discountPercentage: number;
    finalPrice: number;
    available: boolean;
    official: boolean;
  }

  interface Categogy {
    id: string;
    title: string;
    author: string;
    imageURL: string;
    originalPrice: number;
    discountPercentage: number;
    finalPrice: number;
    available: boolean;
    official: boolean;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Categogy[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const size = 16; // Số sách mỗi trang
  const sizeCategories = 20; // Số danh mục mỗi trang
  const [content, setContent] = useState<string>("");
  const [change, setChange] = useState<string>("");
  const [idCate, setIdCate] = useState<number>();

  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getAllCategoriesWithSizeAndPage(
          1, // Luôn lấy danh mục trang 1
          sizeCategories,
          setCategories,
          setTotalPages,
          setTotalElements
        );
      } catch (error) {
        toast.error("Lỗi khi tải danh sách thể loại sách!");
        console.error("Lỗi khi tải danh sách thể loại sách:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch sách (phân biệt khi có danh mục và khi không có danh mục)
  useEffect(() => {
    setPage(1); // Reset về trang 1 khi đổi danh mục hoặc tìm kiếm
  }, [idCate, content]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (idCate) {
          // Nếu có danh mục -> Lấy sách theo danh mục
          await getAllBooksWithCategoryId(
            page,
            size,
            setBooks,
            setTotalPages,
            setTotalElements,
            change,
            idCate
          );
        } else if (authorId) {
          await getAllBooksWithAuthorId(
            page,
            size,
            setBooks,
            setTotalPages,
            setTotalElements,
            change,
            authorId
          );
        } else {
          // Nếu không có danh mục hoặc id === null -> Lấy tất cả sách preview
          await getAllBooksPreview(
            page,
            size,
            setBooks,
            setTotalPages,
            setTotalElements,
            change,
            content
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
        toast.error("Lỗi khi tải danh sách sách!");
      }
    };
    fetchData();
  }, [page, idCate, content, change, idAuthor]); // Gọi lại API khi page, id, content, hoặc sắp xếp thay đổi

  // Khi click vào danh mục
  const handleCategoryClick = (categoryId: number) => {
    console.log("Danh mục được chọn có ID:", categoryId);
    setIdCate(categoryId);
  };

  return (
    <div className="py-5 px-[5%] flex gap-4 bg-gray-100">
      <div className="w-fit">
        <SidebarBooks categories={categories} onClick={handleCategoryClick} />
      </div>
      <div className="w-full">
        <header className="news-header shadow-xl sticky top-4 z-10 backdrop-blur-lg rounded-2xl bg-white">
          <div className="mx-auto flex items-center justify-between p-4">
            <NavLink
              to="/"
              onClick={() => {
                // setId(null);
                scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-2xl font-medium text-gray-800 cursor-pointer"
            >
              Nhà sách CaB
            </NavLink>
            <div className="flex md:flex-row flex-col items-center">
              <select
                onChange={(e) => setChange(e.target.value)}
                className="transition-all border-gray-300 appearance-none focus:outline-none
              duration-300 ease-in-out border text-gray-500
              rounded-full px-5 py-2 shadow-sm outline-none  ml-auto mr-2"
              >
                <option value="" className="hidden bg-gray-400">
                  Sắp xếp theo giá
                </option>
                <option value="desc">Cao đến thấp</option>
                <option value="asc">Thấp đến cao</option>
              </select>
              {!idAuthor && !idCate && (
                <div className="relative">
                  <input
                    // ref={inputRef} // Ref cho input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    type="text"
                    placeholder="Tìm sách, tác giả..."
                    className={`transition-all duration-300 ease-in-out border rounded-full px-4 py-2 shadow-sm outline-none
                ${isFocused ? "w-80 border-gray-400" : "w-48 border-gray-300"}`}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <FaSearch className="absolute right-3 top-2.5 text-gray-700 translate-y-0.5" />
                </div>
              )}
            </div>
          </div>
        </header>

        {books.length === 0 ? (
          <div className="text-center text-2xl font-semibold mt-5">
            Không tìm thấy quyển sách nào!
          </div>
        ) : (
          <BookItem
            books={books}
            setBooks={setBooks}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default Books;
