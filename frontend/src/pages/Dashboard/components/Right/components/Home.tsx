import { IoIosArrowForward } from "react-icons/io";
import { VscRootFolder, VscRootFolderOpened } from "react-icons/vsc";
const Home = () => {
  return (
    <div className="p-2 max-h-[80vh] bg-white min-h-[80vh] overflow-y-auto">
      <h1 className="font-bold text-[24px]">Selamat Datang</h1>
      <p>
        Jadi, ini merupakan sebuah web untuk file explorer seperti Google Drive
        yang sederhana
      </p>
      <br />
      <h2 className="font-bold">Fitur</h2>
      <ul>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">Login</p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">Register</p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">Logout</p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Menambah Folder dan File (.txt dan .docx)
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Melihat Folder dan File (.txt dan .docx) - Wajib klik dua kali
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Update nama folder dan File (.txt dan .docx)
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Mengahpus Folder dan File (.txt dan .docx)
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Sorting berdasarkana nama, createdAt, dan tipe baik secara ascending
            atau descending
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Fitur "Copy here" yaitu melakukan copy data di halaman yang sama
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">
            Fitur "Copy paste" yaitu melakukan copy data di halaman yang telah
            ditentukan
          </p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">Single upload file</p>
        </li>
        <li className="flex flex-row gap-2 items-center">
          <IoIosArrowForward fontSize={14} />
          <p className="text-[14px]">Bulk delete</p>
        </li>
      </ul>
      <p className="font-bold">Catatan</p>
      <p>
        - Saat ingin start program, wajib menambahkan folder{" "}
        <span className="font-bold">"uploads"</span>
      </p>
      <p className="flex flex-row gap-2 items-center">
        <span>
          - Apabila membukan folder di dalam folder dan ingin kembali ke halaman
          root, maka klik dua kali folder root
        </span>
        <div className="flex flex-row items-center gap-2">
          <VscRootFolderOpened />
          <span className="font-bold">(Terbuka)</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <VscRootFolder />
          <span className="font-bold">(Tertutup)</span>
        </div>
      </p>
    </div>
  );
};

export default Home;
