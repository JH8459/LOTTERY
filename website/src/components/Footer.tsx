export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-20">
      <div className="max-w-[1200px] w-4/5 mx-auto flex flex-col items-center text-center space-y-4">
        {/* 소셜 아이콘 */}
        <div className="flex gap-6 items-center">
          <a href="https://blog.jh8459.com/" target="_blank" rel="noopener noreferrer">
            <img
              src="https://jh8459.s3.ap-northeast-2.amazonaws.com/logo/blog-logo.png"
              alt="blog"
              className="w-6 h-6 hover:opacity-80 transition-opacity"
            />
          </a>
          <a href="https://github.com/JH8459/LOTTERY" target="_blank" rel="noopener noreferrer">
            <img
              src="https://jh8459.s3.ap-northeast-2.amazonaws.com/logo/github-logo.png"
              alt="github"
              className="w-6 h-6 hover:opacity-80 transition-opacity"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/%EC%A0%95%ED%98%84-%EA%B9%80-8b7a80237/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://jh8459.s3.ap-northeast-2.amazonaws.com/logo/linkedin-logo.png"
              alt="linkedin"
              className="w-6 h-6 hover:opacity-80 transition-opacity"
            />
          </a>
        </div>

        {/* 저작권 문구 */}
        <p className="text-sm text-gray-600">
          <strong>&copy; {currentYear} Lottery Subscription Services</strong>
        </p>
      </div>
    </footer>
  );
}
