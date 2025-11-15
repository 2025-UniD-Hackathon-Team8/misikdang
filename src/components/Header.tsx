import headerImg from "../assets/header.png";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 z-50 flex justify-center items-center w-full">
      <img
        src={headerImg}
        alt="美食堂"
        className="transition-opacity duration-700 ease-in-out"
      />
    </div>
  );
}
