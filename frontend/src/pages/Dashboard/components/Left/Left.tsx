import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaFolder, FaFile } from "react-icons/fa";
import { VscRootFolder, VscRootFolderOpened } from "react-icons/vsc";
import { getAllRoot, openFile } from "../../Service";
import { GetAllRootResponse, SubItem } from "../../interface";
import ModalCreate from "../../../../components/Modal/ModalCreate";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../../../../hooks/useModal";
import { generateNewToken } from "../../../../utils/generateNewToken";

interface SidebarProps {
  width: number;
}

const Left: React.FC<SidebarProps> = ({ width }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subItems, setSubItems] = useState<SubItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null); // State untuk menyimpan folder yang sedang dibuka
  const navigate = useNavigate();
  const { triggerLeft, setTriggerLeft } = useModal();
  const location = useLocation(); // Mendapatkan URL saat ini

  const openModal = () => {
    // Jika user sudah di /explorer atau /explorer/{id}, tidak perlu navigasi lagi
    if (!location.pathname.startsWith("/explorer")) {
      navigate("/explorer");
    }

    setIsModalOpen(true);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchSubItems = async () => {
      setLoading(true); // Mulai loading
      try {
        const data: GetAllRootResponse = await getAllRoot(
          currentFolderId as string
        ); // Ambil subItems berdasarkan currentFolderId
        console.log(data.token);
        generateNewToken(data.token as string);
        if ((data.result?.length as number) > 0) {
          setSubItems(data.result as SubItem[]);
        } else {
          setSubItems([]);
          setCurrentFolderId(null);
        }
        setTriggerLeft(false);
      } catch (error) {
        console.error("Error fetching sub items:", error);
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchSubItems(); // Panggil fungsi fetch
  }, [currentFolderId, triggerLeft, setTriggerLeft]);

  const handleDoubleClick = (item: SubItem) => {
    if (item.type === "file") {
      // Jika item adalah file, buka file tersebut
      openFile(item.id as string)
        .then((response: GetAllRootResponse) => {
          console.log(response.token);
          generateNewToken(response.token as string);
        })
        .catch((error) => console.error("Error opening file:", error));
    } else {
      // Jika item adalah folder, set currentFolderId dan buka sub-folder
      setCurrentFolderId(item.id as string);
      setIsDropdownOpen(true); // Pastikan dropdown terbuka
    }
  };

  return (
    <div
      className="w-[250px] bg-[#f4f4f4] p-[20px] border-r-[1px] border border-solid border-[#ccc]"
      style={{ width: `${width}px` }}
    >
      <div
        onClick={openModal}
        className="cursor-pointer flex my-2 flex-row items-center gap-4 bg-white w-[130px] p-[16px] rounded-md shadow-md"
      >
        <FaPlus />
        <h3 className="font-bold">Tambah {loading}</h3>
      </div>
      {isModalOpen && (
        <ModalCreate setIsModalOpen={setIsModalOpen} value={isModalOpen} />
      )}
      <ul className="w-[150px]">
        <li
          className="flex flex-row items-center gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <FaHome />
          <div>Home</div>
        </li>
        <li
          className="flex flex-row items-center gap-4 cursor-pointer"
          onClick={() => {
            navigate("/explorer");
            toggleDropdown();
          }}
          onDoubleClick={() => {
            setCurrentFolderId(null);
          }}
        >
          {isDropdownOpen ? <VscRootFolderOpened /> : <VscRootFolder />}
          <div>Root</div>
        </li>
        {isDropdownOpen && (
          <ul className={`text-[12px] rounded-md max-h-60 overflow-y-auto`}>
            {loading ? (
              <li className="p-2">Loading...</li>
            ) : (
              subItems.length != 0 &&
              subItems.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-row items-center gap-4 p-1 hover:bg-gray-200 cursor-pointer"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  {item.type === "folder" ? <FaFolder /> : <FaFile />}
                  <div>{item.name}</div>
                </li>
              ))
            )}
          </ul>
        )}
      </ul>
    </div>
  );
};

export default Left;
