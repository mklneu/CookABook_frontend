declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

// Service modules
declare module "../../services/BookServices" {
  export function getAllBooksPreview(
    page: number,
    size: number,
    setBooks: (books: any[]) => void,
    setTotalPages: (pages: number) => void,
    setTotalElements: (elements: number) => void,
    change: string,
    content: string
  ): Promise<void>;
}

declare module "../../services/axiosInstance" {
  const value: any;
  export default value;
}

// Component modules
declare module "../components/sideBar/SidebarArticles" {
  interface SidebarArticlesProps {
    newsArticles: any[];
    setArticle: (article: any) => void;
  }
  const SidebarArticles: React.FC<SidebarArticlesProps>;
  export default SidebarArticles;
}
