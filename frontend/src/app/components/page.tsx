"use client";
import React, { useState, useEffect } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axios";
import axiosInstancee from "@/app/utils/axioss";
import { RcFile } from "antd/lib/upload/interface";
import {
  Table,
  DatePicker,
  Select,
  Input,
  Button,
  Space,
  message,
  Upload,
  Modal,
  List,
  Image as AntdImage,
  Checkbox,
  Spin,
  Tooltip,
  notification,
  Tag,
  Tabs,
} from "antd";
import {
  FileImageOutlined,
  CommentOutlined,
  SearchOutlined,
  SaveOutlined,
  DownloadOutlined,
  FilterOutlined,
  CalendarOutlined,
  ProjectOutlined,
  BarsOutlined,
  AppstoreOutlined,
  EditOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  CodepenOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import "antd/dist/reset.css";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface DataWi {
  key: string;
  item_id: string;
  Name: string;
  pt_ohn: string;
  prd_name: string;
  date_of_book: string;
  item_qty: string;
  lc_no: string;
  doctor_name: number;
  brc_sname: string;
  status_data?: string;
  date_of_inserts?: string;
  author_status?: string;
  finish_date?: string;
  date_of_insertsss?: string;
  previous_status_data?: string;
  previous_finish_date?: string;
  author_finishdate?: string;
  file_path?: string;
  date_of_insertss?: string;
  author_image?: string;
  status_mass?: string;
  date_of_inmass?: string;
  author_mass?: string;
  qty_data?: string;
  date_of_qty?: string;
  author_qty?: string;
  status_file?: string;
  date_of_insertfile?: string;
  author_status_file?: string;
  author_insert?: string;
  author_number?: string;
  author?: string;
  date_of_rcp?: string;
  link_data?: string;
  author_file?: string;
}

const status_data = [
  "รอช่างมารับงาน",
  "ช่างรับงานแล้ว",
  "งานเสร็จแล้วรอส่ง",
  "จัดส่งงานแล้ว",
  "ลูกค้ารับงานแล้ว",
  "แก้งาน",
];

const status_data2 = ["เช็คไฟล์สแกนแล้ว", "พิมพ์ไฟล์สแกนแล้ว"];

const quantity_options = ["ฟันบน", "ฟันล่าง"];

const statusTabs = [
  { key: "all", label: "📋 ทั้งหมด", value: "All" },
  // { key: "empty", label: "🆓 ยังไม่ระบุสถานะ", value: "" }, // ✨ เพิ่มตรงนี้
  { key: "wait", label: "🕒 รอช่างมารับงาน", value: "รอช่างมารับงาน" },
  { key: "tech", label: "👨‍🔧 ช่างรับงานแล้ว", value: "ช่างรับงานแล้ว" },
  { key: "wait-send", label: "📦 รอส่ง", value: "งานเสร็จแล้วรอส่ง" },
  { key: "shipped", label: "🚚 จัดส่งงานแล้ว", value: "จัดส่งงานแล้ว" },
  { key: "received", label: "✅ ลูกค้ารับงานแล้ว", value: "ลูกค้ารับงานแล้ว" },
  { key: "redo", label: "🔁 แก้งาน", value: "แก้งาน" },
];

const getStatusTextColor = (status: any) => {
  switch (status) {
    case "รอช่างมารับงาน":
      return "brown";
    case "ช่างรับงานแล้ว":
      return "orange";
    case "งานเสร็จแล้วรอส่ง":
      return "green";
    case "จัดส่งงานแล้ว":
      return "purple";
    case "ลูกค้ารับงานแล้ว":
      return "blue";
    case "แก้งาน":
      return "red";
    default:
      return "black";
  }
};

const DataTable: React.FC = () => {
  const [data, setData] = useState<DataWi[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [branchName, setBranchName] = useState<string[]>(["All"]);
  // const [branchName, setBranchName] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQuerystatus, setSearchQuerystatus] = useState<string[]>(["All"]);
  const [searchQueryproduct, setSearchQueryproduct] = useState<string[]>([
    "All",
  ]);
  const [searchQuerybrcsname, setSearchQuerybrcsname] = useState<string[]>([
    "All",
  ]);
  const [searchQueryDate, setSearchQueryDate] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);
  const [dataSource, setDataSource] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [username, setUsername] = useState<string | null>("");
  const [currentAuthor, setCurrentAuthor] = useState<string | null>("");
  const [comments, setComments] = useState<
    {
      author: string;
      comment: string;
      item_id: string;
      created_at?: string;
      comment_image?: string | null;
    }[]
  >([]);
  const [statusMassMap, setStatusMassMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [qrData, setQrData] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null); // ✅
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [isModalFile, setIsModalFile] = useState(false);
  const [comments1, setComments1] = useState<
    {
      author_file: string;
      comment_file: string;
      item_id?: string;
      created_file?: string;
      upload_commentfile?: string | null;
    }[]
  >([]);
  const [uploadedFile1, setUploadedFile1] = useState<any>(null);
  const [fileList1, setFileList1] = useState<any[]>([]);
  const [currentItemId1, setCurrentItemId1] = useState("");
  const [currentComment1, setCurrentComment1] = useState("");
  const [editingIndex1, setEditingIndex1] = useState(null);
  const [editingKey1, setEditingKey1] = useState<string | null>(null); // ✅

  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      router.push("/");
    }
  }, [router]);

  const exportCSV = () => {
    const filteredData = data.filter((item) => {
      const itemDate = item.date_of_book
        ? dayjs(item.date_of_book, "YYYY-MM-DD")
        : null;
      const startDate = searchQueryDate ? searchQueryDate[0] : null;
      const endDate = searchQueryDate ? searchQueryDate[1] : null;

      return (
        (searchQuery
          ? item.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.pt_ohn?.toLowerCase().includes(searchQuery.toLowerCase())
          : true) &&
        (searchQuerystatus.includes("All") ||
          !item.status_data ||
          (item.status_data &&
            searchQuerystatus.includes(item.status_data.toLowerCase()))) &&
        (searchQueryproduct.includes("All") ||
          searchQueryproduct.includes(item.prd_name?.toLowerCase() ?? "")) &&
        (searchQuerybrcsname.includes("All") ||
          searchQuerybrcsname.some((brc) =>
            item.brc_sname
              ?.split(",")
              .map((s) => s.trim().toLowerCase())
              .some((brcName) =>
                brc
                  .split(",")
                  .some((branch) =>
                    branch.toLowerCase().includes(brcName.toLowerCase())
                  )
              )
          )) &&
        (!searchQueryDate ||
          (itemDate &&
            (itemDate.isSame(startDate, "day") ||
              itemDate.isAfter(startDate, "day")) &&
            (itemDate.isSame(endDate, "day") ||
              itemDate.isBefore(endDate, "day"))))
      );
    });

    const header = [
      "Name",
      "เลข HN",
      "ชนิด",
      "Due Date",
      "วันนัดลูกค้าใหม่", // ✅ เพิ่มคอลัมน์ใหม่
      "จำนวน",
      "เลขที่",
      "ชื่อแพทย์",
      "สาขา2",
      "สถานะการผลิต",
      "เวลาสถานะ",
    ];

    const csvData = filteredData.map((item) => {
      const finishDisplayDate = item.finish_date || item.date_of_book;

      return [
        `"${item.Name || ""}"`,
        `"${item.pt_ohn || ""}"`,
        `"${item.prd_name || ""}"`,
        `"${
          item.date_of_book
            ? format(new Date(item.date_of_book), "dd/MM/yyyy")
            : ""
        }"`,
        `"${
          finishDisplayDate
            ? format(new Date(finishDisplayDate), "dd/MM/yyyy")
            : ""
        }"`, // ✅ ใส่วันที่งานเสร็จตาม logic
        `"${item.item_qty || ""}"`,
        `"${item.lc_no || ""}"`,
        `"${item.doctor_name || ""}"`,
        `"${item.brc_sname || ""}"`,
        `"${item.status_data || "รอช่างมารับงาน"}"`,
        `"${
          item.date_of_inserts ? item.date_of_inserts : item.date_of_rcp || ""
        }"`,
      ];
    });

    const csvContent = [header, ...csvData].map((e) => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "filtered_retainer_data.csv";
    link.click();
  };

  const fetchData = async () => {
    if (!dates[0] || !dates[1]) {
      message.error("Please select both Start Date and End Date");
      return;
    }
    setLoading(true);
    try {
      const formattedStartDate = format(dates[0], "yyyy-MM-dd");
      const formattedEndDate = format(dates[1], "yyyy-MM-dd");
      const params: any = {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        branch_name: Array.isArray(branchName) ? branchName : [branchName],
      };
      const response: any = await axiosInstance.get("/commons/get_all_data", {
        params: params,
      });
      setData(
        response.data.map((item: any, index: number) => ({
          ...item,
          key: index.toString(),
          finish_date: item.finish_date
            ? format(new Date(item.finish_date), "yyyy-MM-dd")
            : "",
        }))
      );
      setError(null);
    } catch (err) {
      setError("Failed to Search data. Please try again.");
      message.error("Failed to Search data.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (key: string, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, status_data: newStatus } : item
      )
    );
    const item = data.find((item) => item.key === key);
    const storedUsername = localStorage.getItem("username");
    if (item) {
      try {
        const payload: any = {
          item_id: item.item_id,
          status_data: newStatus,
          author_status: storedUsername,
        };
        if (item.finish_date) {
          payload.finish_date = item.finish_date;
        }
        await axiosInstance.post("/commons/post_status_data", payload);
      } catch (err) {
        message.error("Failed to update status");
      }
    }
  };

  const handleStatusChange2 = async (key: string, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, status_file: newStatus } : item
      )
    );
    const item = data.find((item) => item.key === key);
    const storedUsername = localStorage.getItem("username");
    if (item) {
      try {
        const payload: any = {
          item_id: item.item_id,
          status_file: newStatus,
          author_status_file: storedUsername,
        };
        if (item.finish_date) {
          payload.finish_date = item.finish_date;
        }
        await axiosInstance.post("/commons/post_status_file", payload);
      } catch (err) {
        message.error("Failed to update status");
      }
    }
  };

  const restrictedStatusForRA = [
    "ช่างรับงานแล้ว",
    "งานเสร็จแล้วรอส่ง",
    "จัดส่งงานแล้ว",
  ];

  const restrictedStatusForRAA = [
    "รอช่างมารับงาน",
    "ช่างรับงานแล้ว",
    "งานเสร็จแล้วรอส่ง",
    "ลูกค้ารับงานแล้ว",
    "แก้งาน",
  ];

  // รายการสถานะที่ Messenger ไม่สามารถเลือก
  const restrictedStatusForMessenger = [
    "รอช่างมารับงาน",
    "งานเสร็จแล้วรอส่ง",
    "ลูกค้ารับงานแล้ว",
    "แก้งาน",
  ];

  const restrictedStatusForMessengerr = [
    "",
    "ช่างรับงานแล้ว",
    "จัดส่งงานแล้ว",
    "ลูกค้ารับงานแล้ว",
    "แก้งาน",
  ];

  const restrictedStatusForAdminlab = [
    "รอช่างมารับงาน",
    "ช่างรับงานแล้ว",
    "จัดส่งงานแล้ว",
    "ลูกค้ารับงานแล้ว",
    "แก้งาน",
  ];

  const restrictedStatusForAdminlabb = [
    "",
    "รอช่างมารับงาน",
    "งานเสร็จแล้วรอส่ง",
    "จัดส่งงานแล้ว",
    "ลูกค้ารับงานแล้ว",
    "แก้งาน",
  ];

  const restrictedUsers = [
    "RA",
    "AR",
    "SA",
    "AS",
    "ON",
    "UD",
    "NW",
    "CW",
    "R2",
    "LB",
    "BK",
    "SQ",
    "BN",
    "PK",
    "RS",
    "FS",
    "T3",
    "BP",
    "NT",
    "PP",
  ];

  const storedUsername = localStorage.getItem("username");

  const handleQuantityChange = async (key: string, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, qty_data: newStatus } : item
      )
    );
    const item = data.find((item) => item.key === key);
    const storedUsername = localStorage.getItem("username");
    if (item) {
      try {
        const payload: any = {
          item_id: item.item_id,
          qty_data: newStatus,
          author_qty: storedUsername,
        };
        await axiosInstance.post("/commons/post_qty_data", payload);
        // message.success("Status updated successfully");
        // await fetchData();
      } catch (err) {
        message.error("Failed to update status");
      }
    }
  };

  const handleFinishDateChange = async (key: string, date: any) => {
    const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : "";
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, finish_date: formattedDate } : item
      )
    );
    const item = data.find((item) => item.key === key);
    const storedUsername = localStorage.getItem("username");
    if (item) {
      try {
        await axiosInstance.post("/commons/post_finish_date", {
          item_id: item.item_id,
          finish_date: formattedDate,
          author_finishdate: storedUsername,
        });
        // message.success("Finish date updated successfully");
        // await fetchData();
      } catch (err) {
        message.error("Failed to update finish date");
      }
    }
  };

  const handleSummit = async () => {
    setLoading(true);
    try {
      await fetchData();
      message.success("Save Data successfully.");
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = async (itemId: any) => {
    try {
      setCurrentItemId(itemId);
      const response: any = await axiosInstance.get(
        `/commons/get_comment_data`,
        {
          params: { item_id: itemId },
        }
      );
      if (response.status === 200) {
        setComments(response.data);
        setIsModalVisible(true);
      } else {
        message.error("Failed to fetch comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("An error occurred while fetching comments.");
    }
  };

  const handleOk = () => {
    console.log(
      "Updated comment for index:",
      editingIndex,
      "Name",
      currentAuthor,
      "Value:",
      currentComment
    );
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setCurrentAuthor(storedUsername);
    }
  }, []);

  const fetchDataImage = async (): Promise<
    { item_id: string; file_path: string }[]
  > => {
    if (!dates[0] || !dates[1]) {
      message.error("Please select both Start Date and End Date");
      return [];
    }
    setLoading(true);
    try {
      const formattedStartDate = format(dates[0], "yyyy-MM-dd");
      const formattedEndDate = format(dates[1], "yyyy-MM-dd");
      const params: any = {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        branch_name: Array.isArray(branchName) ? branchName : [branchName],
      };
      const response: any = await axiosInstance.get(
        "/commons/get_all_image_path",
        {
          params: params,
        }
      );

      const filePaths = response.data
        .map((item: any) => ({
          item_id: item.item_id,
          file_path: item.file_path,
        }))
        .filter(
          (item: { file_path: string | null }) => item.file_path !== null
        );

      setError(null);
      return filePaths;
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      message.error("Failed to fetch data.");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (data: string) => {
    try {
      // ใช้ qrcode npm เพื่อสร้าง QR Code เป็น Base64 image
      const qrCodeImageUrl = await QRCode.toDataURL(data); // ใช้ toDataURL เพื่อสร้าง QR code
      return qrCodeImageUrl;
    } catch (error) {
      console.error("Error generating QR Code:", error);
      return "";
    }
  };

  const DownloadImageAll = async () => {
    const filePaths = await fetchDataImage();
    if (filePaths.length === 0) {
      message.error("No valid images to generate PDF.");
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = 130;
      const imgHeight = 190;
      const x1 = 8;
      const x2 = x1 + imgWidth + 20;
      const y = 10;

      for (let i = 0; i < filePaths.length; i += 2) {
        const { item_id, file_path } = filePaths[i]; // Destructure item_id and file_path
        const imageUrl1 = `${axiosInstancee.defaults.baseURL}${file_path}`;
        console.log("Image URL 1:", imageUrl1);

        try {
          const response1 = await fetch(imageUrl1, {
            headers: {
              "ngrok-skip-browser-warning": "69420",
              "Access-Control-Allow-Origin": "*",
            },
          });

          if (response1.ok) {
            const blob1 = await response1.blob();
            if (blob1.type.includes("image/")) {
              const imageUrlFromBlob1 = URL.createObjectURL(blob1);
              pdf.addImage(
                imageUrlFromBlob1,
                "JPEG",
                x1,
                y,
                imgWidth,
                imgHeight
              );
              URL.revokeObjectURL(imageUrlFromBlob1);

              // Use item_id for QR Code generation
              const qrCodeUrl = await generateQRCode(String(item_id));
              const qrCodeX = x1 + imgWidth - 30;
              const qrCodeY = y + imgHeight - 30;
              pdf.addImage(qrCodeUrl, "PNG", qrCodeX, qrCodeY, 30, 30);
            } else {
              console.error("Received file is not a valid image (1).", blob1);
            }
          } else {
            console.error("Failed to fetch image 1. Status:", response1.status);
          }
        } catch (error) {
          console.error("Error fetching image 1:", error);
        }

        if (i + 1 < filePaths.length) {
          const { item_id: item_id2, file_path: filePath2 } = filePaths[i + 1];
          const imageUrl2 = `${axiosInstancee.defaults.baseURL}${filePath2}`;
          console.log("Image URL 2:", imageUrl2);

          try {
            const response2 = await fetch(imageUrl2, {
              headers: {
                "ngrok-skip-browser-warning": "69420",
                "Access-Control-Allow-Origin": "*",
              },
            });

            if (response2.ok) {
              const blob2 = await response2.blob();
              if (blob2.type.includes("image/")) {
                const imageUrlFromBlob2 = URL.createObjectURL(blob2);
                pdf.addImage(
                  imageUrlFromBlob2,
                  "JPEG",
                  x2,
                  y,
                  imgWidth,
                  imgHeight
                );
                URL.revokeObjectURL(imageUrlFromBlob2);

                // Use item_id for QR Code generation for the second image
                const qrCodeUrl2 = await generateQRCode(String(item_id2));
                const qrCodeX2 = x2 + imgWidth - 30;
                const qrCodeY2 = y + imgHeight - 30;
                pdf.addImage(qrCodeUrl2, "PNG", qrCodeX2, qrCodeY2, 30, 30);
              } else {
                console.error("Received file is not a valid image (2).", blob2);
              }
            } else {
              console.error(
                "Failed to fetch image 2. Status:",
                response2.status
              );
            }
          } catch (error) {
            console.error("Error fetching image 2:", error);
          }
        }

        if (i + 2 < filePaths.length) {
          pdf.addPage();
        }
      }

      pdf.save("Download_ImageAll.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const CommentItem = ({ item }: any) => {
    const [imageBlobUrl, setImageBlobUrl] = useState("");
    const comment_image = item.comment_image
      ? `${axiosInstancee.defaults.baseURL}${item.comment_image}`
      : "";
    useEffect(() => {
      if (!comment_image) return;
      console.log("Fetching image from:", comment_image);
      const fetchImage = async () => {
        try {
          const response = await fetch(comment_image, {
            headers: {
              "ngrok-skip-browser-warning": "69420",
              "Access-Control-Allow-Origin": "*",
            },
          });
          if (!response.ok) {
            console.error("Failed to fetch image. Status:", response.status);
            return;
          }
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setImageBlobUrl(blobUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      };
      fetchImage();
    }, [comment_image]);
    return (
      <List.Item>
        <strong>{item.author} :</strong> {item.comment}
        {imageBlobUrl && (
          <div style={{ marginTop: "8px" }}>
            <img
              src={imageBlobUrl}
              alt="Comment attachment"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </div>
        )}
        <br />
        <small>
          Created at:{" "}
          {moment(item.created_at)
            .add(7, "hours")
            .format("DD/MM/YYYY HH:mm:ss น.")}
        </small>
      </List.Item>
    );
  };

  // const handleCheckboxChange = async (item_id: string, isChecked: boolean) => {
  //   const status_mass = isChecked ? "approved" : "not approved";
  //   const storedUsername = localStorage.getItem("username");
  //   setStatusMassMap((prevState) => ({
  //     ...prevState,
  //     [item_id]: isChecked,
  //   }));
  //   try {
  //     console.log("Sending data:", {
  //       item_id,
  //       status_mass,
  //       author_mass: storedUsername,
  //     });
  //     const response = await axiosInstance.post(`/commons/post_status_mass`, {
  //       item_id,
  //       status_mass,
  //       author_mass: storedUsername,
  //     });
  //     console.log("Response received:", response);
  //     if (response.status === 200) {
  //       console.log("Data saved successfully:", response.data);
  //     } else {
  //       console.error("Failed to save data:", response);
  //       setStatusMassMap((prevState) => ({
  //         ...prevState,
  //         [item_id]: !isChecked,
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error saving data:", error);
  //     setStatusMassMap((prevState) => ({
  //       ...prevState,
  //       [item_id]: !isChecked,
  //     }));
  //   }
  // };

  const handleCheckboxChange = (item_id: string, isChecked: boolean) => {
    Modal.confirm({
      title: "ยืนยันการเปลี่ยนแปลงเป็นงานด่วน",
      content: `โปรดกรอกข้อมูลที่จำเป็น และ แนบใบเสร็จการชำระเงินค่าเร่งงานในช่อง comment❗`,
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const status_mass = isChecked ? "approved" : "not approved";
        const storedUsername = localStorage.getItem("username");
        setStatusMassMap((prevState) => ({
          ...prevState,
          [item_id]: isChecked,
        }));
        try {
          console.log("Sending data:", {
            item_id,
            status_mass,
            author_mass: storedUsername,
          });
          const response = await axiosInstance.post(
            `/commons/post_status_mass`,
            {
              item_id,
              status_mass,
              author_mass: storedUsername,
            }
          );
          console.log("Response received:", response);
          if (response.status === 200) {
            console.log("Data saved successfully:", response.data);
          } else {
            console.error("Failed to save data:", response);
            setStatusMassMap((prevState) => ({
              ...prevState,
              [item_id]: !isChecked,
            }));
          }
        } catch (error) {
          console.error("Error saving data:", error);
          setStatusMassMap((prevState) => ({
            ...prevState,
            [item_id]: !isChecked,
          }));
        }
      },
      onCancel: () => {
        console.log("User cancelled");
      },
    });
  };

  useEffect(() => {
    if (!isModalOpen) {
      setQrData(null);
    }
  }, [isModalOpen]);
  useEffect(() => {
    console.log("QR Code Value:", qrData);
  }, [qrData]);
  useEffect(() => {
    if (qrData) {
      QRCode.toDataURL(String(qrData))
        .then((url) => setQrCodeImageUrl(url))
        .catch((error) => console.error("Error generating QR Code:", error));
    }
  }, [qrData]);

  const showQRCode = (itemId: string) => {
    console.log("Scanning Item ID:", itemId); // ตรวจสอบค่า item_id
    setQrData(null);
    setTimeout(() => {
      setQrData(itemId);
      setIsModalOpen(true);
    }, 100);
  };

  const handleSaveAuthorInsert = async (
    item_id: string,
    key: any,
    value: any
  ) => {
    const storedUsername = localStorage.getItem("username");

    if (!value || !storedUsername) {
      console.error("ข้อมูลไม่ครบ");
      return;
    }

    console.log("asd", item_id, value, storedUsername);
    try {
      const response = await axiosInstance.post(`/commons/post_author_info`, {
        item_id,
        author_number: value,
        author_insert: storedUsername,
      });

      console.log("บันทึกสำเร็จ", response.data);

      // ปิดโหมดแก้ไขและเคลียร์ค่า input
      setEditingKey(null);
      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });

      // อัปเดตค่าในตาราง (เช่นให้แสดงค่าใหม่ทันที)
      const newData = dataSource.map((item) => {
        if (item.key === key) {
          return { ...item, author_insert: storedUsername };
        }
        return item;
      });
      setDataSource(newData);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างบันทึก", error);
    }
    setLoading(true);
    try {
      await fetchData();
      message.success("Save Data successfully.");
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLinkInsert = async (
    item_id: string,
    key: any,
    value: any
  ) => {
    const storedUsername = localStorage.getItem("username");

    if (!value || !storedUsername) {
      console.error("ข้อมูลไม่ครบ");
      return;
    }

    console.log("asd", item_id, value, storedUsername);
    try {
      const response = await axiosInstance.post(`/commons/post_link_info`, {
        item_id,
        link_data: value,
        author_link: storedUsername,
      });

      console.log("บันทึกสำเร็จ", response.data);

      // ปิดโหมดแก้ไขและเคลียร์ค่า input
      setEditingKey1(null);
      setInputValues((prev) => {
        const newValues = { ...prev };
        delete newValues[key];
        return newValues;
      });

      // อัปเดตค่าในตาราง (เช่นให้แสดงค่าใหม่ทันที)
      const newData = dataSource.map((item) => {
        if (item.key === key) {
          return { ...item, author_insert: storedUsername };
        }
        return item;
      });
      setDataSource(newData);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดระหว่างบันทึก", error);
    }
    setLoading(true);
    try {
      await fetchData();
      message.success("Save Data successfully.");
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      message.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const showModal1 = async (itemId: any) => {
    try {
      setCurrentItemId1(itemId);
      const response: any = await axiosInstance.get(`/commons/get_file_data`, {
        params: { item_id: itemId },
      });
      if (response.status === 200) {
        setComments1(response.data);
        setIsModalFile(true);
        console.log("setComments1: ", response.data);
      } else {
        message.error("Failed to fetch comments.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("An error occurred while fetching comments.");
    }
  };

  const handleOk1 = () => {
    console.log(
      "Updated comment for index:",
      editingIndex1,
      "Name",
      currentAuthor,
      "Value:",
      currentComment1
    );
    setIsModalFile(false);
  };

  const handleCancel1 = () => {
    setIsModalFile(false);
  };

  const CommentItem1 = ({ item }: any) => {
    const [fileBlobUrl, setFileBlobUrl] = useState("");
    const fileUrl = item.upload_commentfile
      ? `${axiosInstancee.defaults.baseURL}${item.upload_commentfile}`
      : "";

    useEffect(() => {
      if (!fileUrl) return;
      console.log("Fetching file from:", fileUrl);
      const fetchFile = async () => {
        try {
          const response = await fetch(fileUrl, {
            headers: {
              "ngrok-skip-browser-warning": "69420",
              "Access-Control-Allow-Origin": "*",
            },
          });
          if (!response.ok) {
            console.error("Failed to fetch file. Status:", response.status);
            return;
          }
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          setFileBlobUrl(blobUrl);
        } catch (error) {
          console.error("Error fetching file:", error);
        }
      };
      fetchFile();
    }, [fileUrl]);

    // ดึงชื่อไฟล์ออกมา เช่น "aaa.stl"
    const fileName = item.upload_commentfile
      ? item.upload_commentfile.split("/").pop()
      : "ไฟล์ไม่พบ";

    return (
      <List.Item>
        <strong>{item.author_file} :</strong> {item.comment_file}
        {fileBlobUrl && (
          <div style={{ marginTop: "8px" }}>
            <strong>ไฟล์แนบ:</strong>{" "}
            <a
              href={fileBlobUrl}
              download={fileName}
              style={{ color: "#1890ff" }}
            >
              📄 {fileName}
            </a>
          </div>
        )}
        <br />
        <small>
          Created at:{" "}
          {moment(item.created_file)
            .add(7, "hours")
            .format("DD/MM/YYYY HH:mm:ss น.")}
        </small>
      </List.Item>
    );
  };
  const handleStatusIconClick = async (key: string) => {
    const item = data.find((item) => item.key === key);
    const storedUsername = localStorage.getItem("username");

    if (item) {
      // ✅ สลับสถานะ
      const newStatus =
        item.status_file === "เช็คไฟล์สแกนแล้ว"
          ? "พิมพ์ไฟล์สแกนแล้ว"
          : "เช็คไฟล์สแกนแล้ว";

      setData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, status_file: newStatus } : item
        )
      );

      try {
        const payload: any = {
          item_id: item.item_id,
          status_file: newStatus,
          author_status_file: storedUsername,
        };
        if (item.finish_date) {
          payload.finish_date = item.finish_date;
        }
        await axiosInstance.post("/commons/post_status_file", payload);
      } catch (err) {
        message.error("Failed to update status");
      }
    }
  };

  const columns: ColumnsType<DataWi> = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      align: "center",
      fixed: "left",
      width: 21,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (text) => parseInt(text) + 1,
    },
    {
      title: "รายชื่อลูกค้า",
      dataIndex: "Name",
      key: "Name",
      fixed: "left",
      width: 100,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (text: string) => {
        const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
        const formattedDate = dateMatch
          ? `${dateMatch[2]}/${dateMatch[1]}`
          : "";
        return (
          <>
            {text}{" "}
            {formattedDate && (
              <span style={{ fontSize: "12px", color: "gray" }}>
                ({formattedDate})
              </span>
            )}
          </>
        );
      },
      sorter: (a: DataWi, b: DataWi) => {
        const dateA = a.Name.match(/(\d{1,2})\/(\d{1,2})/);
        const dateB = b.Name.match(/(\d{1,2})\/(\d{1,2})/);
        if (!dateA || !dateB) return 0;
        const dateAObj = new Date(`${dateA[2]}/${dateA[1]}`);
        const dateBObj = new Date(`${dateB[2]}/${dateB[1]}`);
        return dateAObj.getTime() - dateBObj.getTime();
      },
    },
    // {
    //   title: "รายชื่อลูกค้า",
    //   dataIndex: "Name",
    //   key: "Name",
    //   fixed: "left",
    //   width: 100,
    //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
    //   render: (text: string, record: DataWi) => {
    //     const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
    //     const formattedDate = dateMatch
    //       ? `${dateMatch[2]}/${dateMatch[1]}`
    //       : "";

    //     return (
    //       <div>
    //         {text}{" "}
    //         {formattedDate && (
    //           <span style={{ fontSize: "12px", color: "gray" }}>
    //             ({formattedDate})
    //           </span>
    //         )}
    //         <div style={{ textAlign: "center", marginTop: "10px" }}>
    //           <Button onClick={() => showQRCode(record.item_id)}>
    //             📌 สร้าง QR Code
    //           </Button>
    //         </div>
    //       </div>
    //     );
    //   },
    //   sorter: (a: DataWi, b: DataWi) => {
    //     const dateA = a.Name.match(/(\d{1,2})\/(\d{1,2})/);
    //     const dateB = b.Name.match(/(\d{1,2})\/(\d{1,2})/);
    //     if (!dateA || !dateB) return 0;
    //     const dateAObj = new Date(`${dateA[2]}/${dateA[1]}`);
    //     const dateBObj = new Date(`${dateB[2]}/${dateB[1]}`);
    //     return dateAObj.getTime() - dateBObj.getTime();
    //   },
    // },
    {
      title: "HN",
      dataIndex: "pt_ohn",
      key: "pt_ohn",
      align: "center",
      width: 28,
    },
    {
      title: "หัตถการ",
      dataIndex: "prd_name",
      key: "prd_name",
      width: 45,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
    },
    {
      title: "วันที่นัดลูกค้า",
      dataIndex: "date_of_book",
      key: "date_of_book",
      align: "center",
      width: 40,
      render: (date: string) =>
        date ? format(new Date(date), "dd/MM/yyyy") : "",
      sorter: (a: DataWi, b: DataWi) => {
        const dateA = new Date(
          a.date_of_book || "1970-01-01T00:00:00"
        ).getTime();
        const dateB = new Date(
          b.date_of_book || "1970-01-01T00:00:00"
        ).getTime();

        return dateA - dateB;
      },
    },
    {
      title: "จำนวนชิ้นงาน",
      dataIndex: "item_qty",
      key: "item_qty",
      align: "center",
      width: 45,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (_, record) => {
        const formatDate = (text: any) => {
          if (!text) return "";
          const date = new Date(text);
          date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
          return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
          )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
        };
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "16px", marginBottom: 8 }}>
              {record.item_qty} ชิ้น
            </div>
            {parseInt(record.item_qty, 10) === 1 && (
              <>
                <Tooltip
                  title={
                    record.date_of_qty
                      ? `Update At : ${formatDate(record.date_of_qty)} By : ${
                          record.author_qty
                        }`
                      : "ไม่มีข้อมูล"
                  }
                >
                  <Select
                    value={record.qty_data}
                    onChange={(value) =>
                      handleQuantityChange(record.key, value)
                    }
                    style={{ width: 90, marginBottom: 8 }}
                    dropdownStyle={{ textAlign: "center" }}
                    disabled={["Messenger", ""].includes(
                      localStorage.getItem("username") ?? ""
                    )}
                  >
                    {quantity_options.map((qty) => (
                      <Option key={qty} value={qty}>
                        {qty}
                      </Option>
                    ))}
                  </Select>
                </Tooltip>
                {/* {record.date_of_qty && (
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    <h4>อัพเดตเมื่อ :</h4>
                    <div>{formatDate(record.date_of_qty)}</div>
                  </div>
                )} */}
              </>
            )}
          </div>
        );
      },
    },
    {
      title: "เลขที่ใขอนุญาต",
      dataIndex: "lc_no",
      key: "lc_no",
      align: "center",
      width: 30,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
    },
    {
      title: "ชื่อแพทย์",
      dataIndex: "doctor_name",
      key: "doctor_name",
      width: 60,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
    },
    {
      title: "สาขา",
      dataIndex: "brc_sname",
      key: "brc_sname",
      align: "center",
      width: 25,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (text: string) => {
        const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
        const formattedDate = dateMatch
          ? `${dateMatch[2]}/${dateMatch[1]}`
          : "";
        const branchName = text.replace(/\d{1,2}\/\d{1,2}/, "").trim();
        return (
          <>
            <span>{branchName}</span>{" "}
            {formattedDate && (
              <span style={{ fontSize: "12px", color: "gray" }}>
                ({formattedDate})
              </span>
            )}
          </>
        );
      },
      sorter: (a: DataWi, b: DataWi) => {
        const nameA = a.brc_sname.replace(/\d{1,2}\/\d{1,2}/, "").trim();
        const nameB = b.brc_sname.replace(/\d{1,2}\/\d{1,2}/, "").trim();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        const dateA = a.brc_sname.match(/(\d{1,2})\/(\d{1,2})/);
        const dateB = b.brc_sname.match(/(\d{1,2})\/(\d{1,2})/);
        if (!dateA || !dateB) return 0;
        const dateAObj = new Date(`${dateA[2]}/${dateA[1]}`);
        const dateBObj = new Date(`${dateB[2]}/${dateB[1]}`);
        return dateAObj.getTime() - dateBObj.getTime();
      },
    },
    // {
    //   title: "สถานะการผลิต",
    //   dataIndex: "status_data",
    //   key: "status_data",
    //   align: "center",
    //   width: 65,
    //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
    //   render: (_, record) => {
    //     const formatDate = (text: any) => {
    //       if (!text) return "";
    //       const date = new Date(text);
    //       date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
    //       return `${String(date.getDate()).padStart(2, "0")}/${String(
    //         date.getMonth() + 1
    //       ).padStart(2, "0")}/${date.getFullYear()} ${String(
    //         date.getHours()
    //       ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    //         2,
    //         "0"
    //       )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
    //     };
    //     return (
    //       <div style={{ textAlign: "center" }}>
    //         <Tooltip
    //           title={
    //             record.date_of_inserts
    //               ? `Update At : ${formatDate(record.date_of_inserts)} By : ${
    //                   record.author_status
    //                 }`
    //               : "ไม่มีข้อมูล"
    //           }
    //         >
    //           <Select
    //             value={record.status_data}
    //             onChange={(value) => handleStatusChange(record.key, value)}
    //             style={{ width: 150, marginBottom: 8 }}
    //             dropdownStyle={{ textAlign: "center" }}
    //             /*</Tooltip>disabled={
    //               (storedUsername !== "Chanatip" &&
    //                 storedUsername === "Adminlab" &&
    //                 restrictedStatusForAdminlabb.includes(
    //                   record.status_data ?? ""
    //                 )) ||
    //               (storedUsername === "Messenger" &&
    //                 restrictedStatusForMessengerr.includes(
    //                   record.status_data ?? ""
    //                 )) ||
    //               (restrictedUsers.includes(storedUsername ?? "") &&
    //                 restrictedStatusForRAA.includes(record.status_data ?? ""))
    //             }*/
    //           >
    //             {status_data
    //               .filter((status) => {
    //                 if (storedUsername === "Chanatip") {
    //                   return true;
    //                 }
    //                 /*if (
    //                   (restrictedUsers.includes(storedUsername ?? "") &&
    //                     restrictedStatusForRA.includes(status)) ||
    //                   ((status === "ลูกค้ารับงานแล้ว" || status === "แก้งาน") &&
    //                     record.status_data !== "จัดส่งงานแล้ว")
    //                 ) {
    //                   return false;
    //                 }*/

    //                 if (
    //                   (restrictedUsers.includes(storedUsername ?? "") &&
    //                     restrictedStatusForRA.includes(status)) ||
    //                   (status === "รอช่างมารับงาน" &&
    //                     [
    //                       "ช่างรับงานแล้ว",
    //                       "งานเสร็จแล้วรอส่ง",
    //                       "จัดส่งงานแล้ว",
    //                       "ลูกค้ารับงานแล้ว",
    //                       "แก้งาน",
    //                     ].includes(record.status_data ?? ""))
    //                 ) {
    //                   return false;
    //                 }

    //                 if (
    //                   storedUsername === "Messenger" &&
    //                   (restrictedStatusForMessenger.includes(status) ||
    //                     (status === "ช่างรับงานแล้ว" &&
    //                       record.status_data !== "รอช่างมารับงาน") ||
    //                     (status === "จัดส่งงานแล้ว" &&
    //                       record.status_data !== "งานเสร็จแล้วรอส่ง"))
    //                 ) {
    //                   return false;
    //                 }

    //                 if (
    //                   storedUsername === "Adminlab" &&
    //                   (restrictedStatusForAdminlab.includes(status) ||
    //                     (status === "งานเสร็จแล้วรอส่ง" &&
    //                       record.status_data !== "ช่างรับงานแล้ว"))
    //                 ) {
    //                   return false;
    //                 }

    //                 return true;
    //               })
    //               .map((status) => (
    //                 <Option
    //                   key={status}
    //                   value={status}
    //                   style={{ color: getStatusTextColor(status) }}
    //                 >
    //                   {status}
    //                 </Option>
    //               ))}
    //           </Select>
    //         </Tooltip>
    //         {/* {record.date_of_inserts && (
    //           <Tooltip title={formatDate(record.date_of_inserts)}>
    //             <div style={{ fontSize: "12px", color: "#888", cursor: "pointer" }}>
    //               <h4>อัพเดตเมื่อ :</h4>
    //               {formatDate(record.date_of_inserts)}
    //             </div>
    //           </Tooltip>
    //         )} */}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "สถานะการผลิต",
      dataIndex: "status_data",
      key: "status_data",
      align: "center",
      width: 65,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (_, record) => {
        const formatDate = (text: any) => {
          if (!text) return "";
          const date = new Date(text);
          date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
          return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
          )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
        };
        return (
          <div style={{ textAlign: "center" }}>
            <Tooltip
              title={
                record.date_of_inserts
                  ? `Update At : ${formatDate(record.date_of_inserts)} By : ${
                      record.author_status
                    }`
                  : "ไม่มีข้อมูล"
              }
            >
              <Select
                value={record.status_data || "รอช่างมารับงาน"}
                onChange={(value) => handleStatusChange(record.key, value)}
                style={{ width: 150, marginBottom: 8 }}
                dropdownStyle={{ textAlign: "center" }}
              >
                {status_data
                  .filter((status) => {
                    if (storedUsername === "Chanatip") {
                      return true;
                    }
                    if (
                      (restrictedUsers.includes(storedUsername ?? "") &&
                        restrictedStatusForRA.includes(status)) ||
                      (status === "รอช่างมารับงาน" &&
                        [
                          "ช่างรับงานแล้ว",
                          "งานเสร็จแล้วรอส่ง",
                          "จัดส่งงานแล้ว",
                          "ลูกค้ารับงานแล้ว",
                          "แก้งาน",
                        ].includes(record.status_data ?? ""))
                    ) {
                      return false;
                    }
                    if (
                      storedUsername === "Messenger" &&
                      (restrictedStatusForMessenger.includes(status) ||
                        (status === "ช่างรับงานแล้ว" &&
                          record.status_data !== "รอช่างมารับงาน") ||
                        (status === "จัดส่งงานแล้ว" &&
                          record.status_data !== "งานเสร็จแล้วรอส่ง"))
                    ) {
                      return false;
                    }
                    if (
                      storedUsername === "Adminlab" &&
                      (restrictedStatusForAdminlab.includes(status) ||
                        (status === "งานเสร็จแล้วรอส่ง" &&
                          record.status_data !== "ช่างรับงานแล้ว"))
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((status) => (
                    <Option
                      key={status}
                      value={status}
                      style={{ color: getStatusTextColor(status) }}
                    >
                      {status}
                    </Option>
                  ))}
              </Select>
            </Tooltip>
            {/* {record.date_of_inserts && (
              <Tooltip title={formatDate(record.date_of_inserts)}>
                <div style={{ fontSize: "12px", color: "#888", cursor: "pointer" }}>
                  <h4>อัพเดตเมื่อ :</h4>
                  {formatDate(record.date_of_inserts)}
                </div>
              </Tooltip>
            )} */}
          </div>
        );
      },
    },
    {
      title: "รหัสพนักงานที่บันทึกไฟล์สแกน",
      dataIndex: "author_number",
      key: "author_number",
      width: 50,
      className: "red-border",
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (_, record) => {
        const isEditing = editingKey === record.key;

        return (
          <div style={{ textAlign: "center" }}>
            {isEditing ? (
              <>
                <Input
                  type="number" // ✅ รับเฉพาะตัวเลข
                  value={inputValues[record.key] || ""}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      [record.key]: e.target.value,
                    })
                  }
                  size="small"
                  style={{ width: 100, marginBottom: 4 }}
                />
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick={() =>
                      handleSaveAuthorInsert(
                        record.item_id,
                        record.key,
                        inputValues[record.key]
                      )
                    }
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      setEditingKey(null);
                      setInputValues((prev) => {
                        const newValues = { ...prev };
                        delete newValues[record.key];
                        return newValues;
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>{record.author_number || "-"}</div>
                {!record.author_number && ( // ✅ ซ่อนปุ่มถ้ามีค่าแล้ว
                  <Button
                    size="small"
                    type="link"
                    onClick={() => {
                      setEditingKey(record.key);
                      setInputValues((prev) => ({
                        ...prev,
                        [record.key]: record.author_number || "",
                      }));
                    }}
                    style={{ marginTop: 4 }}
                  >
                    แก้ไข
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
    },

    {
      title: "บันทึกลิ้งไฟล์สแกน",
      dataIndex: "link_data",
      key: "link_data",
      width: 50,
      className: "red-border",
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (_, record) => {
        const isEditing = editingKey1 === record.key;

        return (
          <div style={{ textAlign: "center" }}>
            {isEditing ? (
              <>
                <Input
                  type="text"
                  value={inputValues[record.key] || ""}
                  onChange={(e) =>
                    setInputValues({
                      ...inputValues,
                      [record.key]: e.target.value,
                    })
                  }
                  size="small"
                  style={{ width: 100, marginBottom: 4 }}
                />
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Button
                    type="primary"
                    size="small"
                    onClick={() =>
                      handleSaveLinkInsert(
                        record.item_id,
                        record.key,
                        inputValues[record.key]
                      )
                    }
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={() => {
                      setEditingKey1(null);
                      setInputValues((prev) => {
                        const newValues = { ...prev };
                        delete newValues[record.key];
                        return newValues;
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  {record.link_data ? (
                    <a
                      href={record.link_data}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {record.link_data}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
                {!record.link_data && (
                  <Button
                    size="small"
                    type="link"
                    onClick={() => {
                      setEditingKey1(record.key);
                      setInputValues((prev) => ({
                        ...prev,
                        [record.key]: record.link_data || "",
                      }));
                    }}
                    style={{ marginTop: 4 }}
                  >
                    แก้ไข
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
    },

    // {
    //   title: "วันที่งานเสร็จ",
    //   dataIndex: "finish_date",
    //   key: "finish_date",
    //   align: "center",
    //   width: 55,
    //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
    //   render: (_, record) => {
    //     const formatDate = (text: any) => {
    //       if (!text) return "";
    //       const date = new Date(text);
    //       date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
    //       return `${String(date.getDate()).padStart(2, "0")}/${String(
    //         date.getMonth() + 1
    //       ).padStart(2, "0")}/${date.getFullYear()} ${String(
    //         date.getHours()
    //       ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    //         2,
    //         "0"
    //       )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
    //     };
    //     return (
    //       <div style={{ textAlign: "center" }}>
    //         <Tooltip
    //           title={
    //             record.date_of_insertsss
    //               ? `Update At : ${formatDate(record.date_of_insertsss)} By : ${
    //                   record.author_finishdate
    //                 }`
    //               : "ไม่มีข้อมูล"
    //           }
    //         >
    //           <DatePicker
    //             value={
    //               record.finish_date
    //                 ? dayjs(record.finish_date, "YYYY-MM-DD")
    //                 : null
    //             }
    //             style={{ marginBottom: 8 }}
    //             onChange={(date) => handleFinishDateChange(record.key, date)}
    //             format="DD/MM/YYYY"
    //             disabled={
    //               !(
    //                 localStorage.getItem("username") === "Adminlab1" ||
    //                 localStorage.getItem("username") === "Adminlab2" ||
    //                 localStorage.getItem("username") === "Adminlab3" ||
    //                 localStorage.getItem("username") === "Chanatip"
    //               )
    //             }
    //           />
    //         </Tooltip>
    //         {/* {record.date_of_insertsss && (
    //           <div style={{ fontSize: "12px", color: "#888" }}>
    //             <h4>อัพเดตเมื่อ :</h4>
    //           </div>
    //         )}
    //         {record.date_of_insertsss && (
    //           <div style={{ fontSize: "12px", color: "#888" }}>
    //             {formatDate(record.date_of_insertsss)}
    //           </div>
    //         )} */}
    //       </div>
    //     );
    //   },
    // },

    // {
    //   title: "สถานะการเช็คไฟล์สแกน",
    //   dataIndex: "status_file",
    //   key: "status_file",
    //   align: "center",
    //   width: 70,
    //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
    //   render: (_, record) => {
    //     const formatDate = (text: any) => {
    //       if (!text) return "";
    //       const date = new Date(text);
    //       date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
    //       return `${String(date.getDate()).padStart(2, "0")}/${String(
    //         date.getMonth() + 1
    //       ).padStart(2, "0")}/${date.getFullYear()} ${String(
    //         date.getHours()
    //       ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    //         2,
    //         "0"
    //       )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
    //     };
    //     return (
    //       <div style={{ textAlign: "center" }}>
    //         <Tooltip
    //           title={
    //             record.date_of_insertfile
    //               ? `Update At : ${formatDate(
    //                   record.date_of_insertfile
    //                 )} By : ${record.author_status_file}`
    //               : "ไม่มีข้อมูล"
    //           }
    //         >
    //           <Select
    //             value={record.status_file}
    //             onChange={(value) => handleStatusChange2(record.key, value)}
    //             style={{ width: 155, marginBottom: 8 }}
    //             dropdownStyle={{ textAlign: "center" }}
    //           >
    //             {status_data2.map((status) => (
    //               <Option
    //                 key={status}
    //                 value={status}
    //                 style={{ color: getStatusTextColor(status) }}
    //               >
    //                 {status}
    //               </Option>
    //             ))}
    //           </Select>
    //         </Tooltip>
    //       </div>
    //     );
    //   },
    // },
    {
      title: "ไฟล์ใบงาน",
      dataIndex: "file_path",
      key: "file_path",
      align: "center",
      width: 60,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (file_path: string | null, record: DataWi) => {
        const RenderFileWithHeaders: React.FC<{
          file_path: string | null;
          item_id: string;
        }> = ({ file_path, item_id }) => {
          const [fileBlobUrl, setFileBlobUrl] = useState<string | null>(null);
          const fileUrl = `${axiosInstancee.defaults.baseURL}${file_path}`;
          useEffect(() => {
            const fetchFile = async () => {
              try {
                const response = await fetch(fileUrl, {
                  headers: {
                    "ngrok-skip-browser-warning": "69420",
                    "Access-Control-Allow-Origin": "*",
                  },
                });
                if (!response.ok) {
                  console.error(
                    "Failed to fetch file. Status:",
                    response.status
                  );
                  return;
                }
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                setFileBlobUrl(blobUrl);
                return () => {
                  URL.revokeObjectURL(blobUrl);
                };
              } catch (error) {
                console.error("Error fetching file:", error);
              }
            };
            if (file_path) {
              fetchFile();
            }
          }, [file_path, fileUrl]);

          const DownloadAsPDF = async () => {
            try {
              const response = await fetch(fileUrl, {
                headers: {
                  "ngrok-skip-browser-warning": "69420",
                  "Access-Control-Allow-Origin": "*",
                },
              });
              if (!response.ok) {
                console.error("Failed to fetch file. Status:", response.status);
                return;
              }
              const blob = await response.blob();
              const fileExtension = file_path?.split(".").pop()?.toLowerCase();

              if (fileExtension === "pdf") {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file_path
                  ? file_path.split("/").pop() || "file.pdf"
                  : "file.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                const img = new Image();
                img.src = URL.createObjectURL(blob);
                img.onload = async () => {
                  const pdf = new jsPDF();
                  pdf.addImage(img, "JPEG", 10, 10, 180, 160);

                  // สร้าง QR Code
                  const qrData = `${item_id}`; // Updated qrData to use item_id
                  const qrCodeDataUrl = await QRCode.toDataURL(qrData);

                  // เพิ่ม QR Code ลงในมุมขวาล่างของ PDF
                  const qrWidth = 30; // ขนาดของ QR Code
                  const qrHeight = 30;
                  const xPosition = pdf.internal.pageSize.width - qrWidth - 20; // ขอบด้านขวา
                  const yPosition =
                    pdf.internal.pageSize.height - qrHeight - 120; // ขอบด้านล่าง

                  pdf.addImage(
                    qrCodeDataUrl,
                    "PNG",
                    xPosition,
                    yPosition,
                    qrWidth,
                    qrHeight
                  );

                  pdf.save("download.pdf");
                };
              }
            } catch (error) {
              console.error("Error downloading file:", error);
            }
          };

          const formatDate = (text: string | null) => {
            if (!text) return "";
            const date = new Date(text);
            date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
            return `${String(date.getDate()).padStart(2, "0")}/${String(
              date.getMonth() + 1
            ).padStart(2, "0")}/${date.getFullYear()} ${String(
              date.getHours()
            ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
              2,
              "0"
            )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
          };

          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {file_path && fileBlobUrl && (
                <>
                  {file_path.endsWith(".pdf") ? (
                    <Tooltip
                      title={
                        record.date_of_insertss
                          ? `Update At : ${formatDate(
                              record.date_of_insertss
                            )} By : ${record.author_image}`
                          : "ไม่มีข้อมูล"
                      }
                    >
                      <iframe
                        src={fileBlobUrl}
                        title="PDF Viewer"
                        width="100px"
                        height="130px"
                        style={{
                          border: "1px solid #ccc",
                          marginBottom: "10px",
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        record.date_of_insertss
                          ? `Update At : ${formatDate(
                              record.date_of_insertss
                            )} By : ${record.author_image}`
                          : "ไม่มีข้อมูล"
                      }
                    >
                      <AntdImage
                        src={fileBlobUrl}
                        alt="Uploaded Image"
                        style={{
                          width: "30px",
                          height: "auto",
                          marginBottom: "10px",
                        }}
                        preview={{
                          src: fileBlobUrl,
                        }}
                      />
                    </Tooltip>
                  )}
                </>
              )}

              {storedUsername !== "Adminlab1" &&
                storedUsername !== "Adminlab2" &&
                storedUsername !== "Adminlab3" &&
                storedUsername !== "Messenger" && (
                  <Upload
                    name="file"
                    accept=".jpg,.png,.jpeg,.pdf"
                    showUploadList={false}
                    customRequest={async ({
                      file,
                      onSuccess = () => {},
                      onError = () => {},
                    }) => {
                      const typedFile = file as RcFile;
                      setLoading(true);
                      const storedUsername = localStorage.getItem("username");
                      try {
                        const formData = new FormData();
                        formData.append("file", typedFile);
                        formData.append("item_id", record.item_id);
                        formData.append(
                          "author_image",
                          storedUsername || "Unknown"
                        );
                        const response = await axiosInstance.post(
                          "/commons/upload_file",
                          formData,
                          {
                            headers: { "Content-Type": "multipart/form-data" },
                          }
                        );
                        await fetchData();
                        onSuccess(response.data);
                      } catch (error: any) {
                        onError(error);
                        message.error(`${typedFile.name} upload failed.`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {file_path ? (
                      <Button type="link" icon={<EditOutlined />}>
                        แก้ไขไฟล์
                      </Button>
                    ) : (
                      <Button type="link" icon={<FileImageOutlined />}>
                        อัปโหลดไฟล์
                      </Button>
                    )}
                  </Upload>
                )}

              {file_path &&
                !restrictedUsers.includes(storedUsername ?? "") &&
                storedUsername !== "Messenger" &&
                storedUsername !== "Adminlab1" &&
                storedUsername !== "Adminlab2" &&
                storedUsername !== "Adminlab3" && (
                  <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={DownloadAsPDF}
                  >
                    ดาวน์โหลดเป็น PDF
                  </Button>
                )}
            </div>
          );
        };
        return (
          <RenderFileWithHeaders
            file_path={file_path}
            item_id={record.item_id}
          />
        );
      },
    },
    // {
    //   title: "งานด่วน",
    //   dataIndex: "Mass",
    //   key: "Mass",
    //   align: "center",
    //   width: 35,
    //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
    //   render: (text, record) => {
    //     const formatDate = (text: any) => {
    //       if (!text) return "";
    //       const date = new Date(text);
    //       date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
    //       return `${String(date.getDate()).padStart(2, "0")}/${String(
    //         date.getMonth() + 1
    //       ).padStart(2, "0")}/${date.getFullYear()} ${String(
    //         date.getHours()
    //       ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
    //         2,
    //         "0"
    //       )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
    //     };
    //     return (
    //       <div style={{ textAlign: "center" }}>
    //         <Tooltip
    //           title={
    //             record.date_of_inmass
    //               ? `Update At : ${formatDate(record.date_of_inmass)} By : ${
    //                   record.author_mass
    //                 }`
    //               : "ไม่มีข้อมูล"
    //           }
    //         >
    //           <Checkbox
    //             checked={
    //               statusMassMap[record.item_id] !== undefined
    //                 ? statusMassMap[record.item_id]
    //                 : record.status_mass === "approved"
    //             }
    //             onChange={(e) =>
    //               handleCheckboxChange(record.item_id, e.target.checked)
    //             }
    //             disabled={!(localStorage.getItem("username") !== "Messenger")}
    //           />
    //         </Tooltip>
    //         {record.date_of_inmass && (
    //           <div style={{ fontSize: "12px", color: "#888", marginTop: 8 }}>
    //             <h4>อัพเดตเมื่อ :</h4>
    //             <div>{formatDate(record.date_of_inmass)}</div>
    //           </div>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "งานด่วน",
      dataIndex: "Mass",
      key: "Mass",
      align: "center",
      width: 36,
      className: "red-border",
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (text, record) => {
        const formatDate = (text: any) => {
          if (!text) return "";
          const date = new Date(text);
          date.setHours(date.getHours() + 7); //เพิ่ม7ชั่วโมง
          return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
          )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
        };
        return (
          <div style={{ textAlign: "center" }}>
            <Tooltip
              title={
                record.date_of_inmass
                  ? `Update At : ${formatDate(record.date_of_inmass)} By : ${
                      record.author_mass
                    }`
                  : "ไม่มีข้อมูล"
              }
            >
              <Checkbox
                checked={
                  statusMassMap[record.item_id] !== undefined
                    ? statusMassMap[record.item_id]
                    : record.status_mass === "approved"
                }
                onChange={(e) =>
                  handleCheckboxChange(record.item_id, e.target.checked)
                }
                disabled={!(localStorage.getItem("username") !== "Messenger")}
              />
            </Tooltip>
            {record.date_of_inmass && (
              <div style={{ fontSize: "12px", color: "purple", marginTop: 8 }}>
                <h4>อัพเดตเมื่อ :</h4>
                <div>{formatDate(record.date_of_inmass)}</div>
              </div>
            )}
          </div>
        );
      },
    },
    // {
    //   title: "Comment",
    //   dataIndex: "comment",
    //   key: "comment",
    //   align: "center",
    //   width: 33,
    //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
    //   render: (text, record, index) => (
    //     <>
    //       <Button
    //         type="primary"
    //         icon={<CommentOutlined />}
    //         onClick={() => showModal(record.item_id)}
    //       />
    //     </>
    //   ),
    // },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      align: "center",
      width: 40,
      className: "red-border",
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (text, record, index) => (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => showModal(record.item_id)}
          />
          {record.author && (
            <Tag
              color={record.author === storedUsername ? "green" : "red"}
              style={{ marginTop: "10px" }}
            >
              Comment
            </Tag>
          )}
        </div>
      ),
    },
  ];
  // ✅ เงื่อนไขเพิ่ม column flie
  if (
    storedUsername === "Chanatip" ||
    storedUsername === "Adminlab1" ||
    storedUsername === "Adminlab2" ||
    storedUsername === "Adminlab3" ||
    storedUsername === "Lab_Earth" ||
    storedUsername === "Lab_Benz" ||
    storedUsername === "Lab_Champ" ||
    storedUsername === "Lab_Pruk" ||
    storedUsername === "Lab_Pech"
  ) {
    columns.push({
      title: "วันนัดลูกค้าใหม่",
      dataIndex: "finish_date",
      key: "finish_date",
      align: "center",
      width: 55,
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (_, record) => {
        const formatDate = (text: any) => {
          if (!text) return "";
          const date = new Date(text);
          date.setHours(date.getHours() + 7);
          return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
          )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
        };

        const displayDate = record.finish_date || record.date_of_book;

        return (
          <div style={{ textAlign: "center" }}>
            <Tooltip
              title={
                record.date_of_insertsss
                  ? `Update At : ${formatDate(record.date_of_insertsss)} By : ${
                      record.author_finishdate
                    }`
                  : "ไม่มีข้อมูล"
              }
            >
              <DatePicker
                value={displayDate ? dayjs(displayDate, "YYYY-MM-DD") : null}
                style={{ marginBottom: 8 }}
                onChange={(date) => handleFinishDateChange(record.key, date)}
                format="DD/MM/YYYY"
                disabled={
                  !(
                    localStorage.getItem("username") === "Adminlab1" ||
                    localStorage.getItem("username") === "Adminlab2" ||
                    localStorage.getItem("username") === "Adminlab3" ||
                    localStorage.getItem("username") === "Chanatip"
                  )
                }
              />
            </Tooltip>
          </div>
        );
      },
    });
    columns.push({
      title: "เช็คไฟล์สแกน",
      dataIndex: "status_file",
      key: "status_file",
      align: "center",
      width: 30,
      className: "red-border",
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (_, record) => {
        const formatDate = (text: any) => {
          if (!text) return "";
          const date = new Date(text);
          date.setHours(date.getHours() + 7);
          return `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}/${date.getFullYear()} ${String(
            date.getHours()
          ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
            2,
            "0"
          )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
        };

        const getIconColor = (status?: string) => {
          if (status === "เช็คไฟล์สแกนแล้ว") return "blue";
          return "gray";
        };

        const renderIcon = (status?: string) => {
          if (status === "เช็คไฟล์สแกนแล้ว") {
            return <CodeSandboxOutlined />;
          }
          return <CodepenOutlined />;
        };

        return (
          <div style={{ textAlign: "center" }}>
            <Tooltip
              title={
                record.date_of_insertfile
                  ? `Update At : ${formatDate(
                      record.date_of_insertfile
                    )} By : ${record.author_status_file}`
                  : "ไม่มีข้อมูล"
              }
            >
              <span
                style={{
                  fontSize: 24,
                  color: getIconColor(record.status_file),
                  cursor: "pointer",
                  marginBottom: 8,
                  display: "inline-block",
                }}
                onClick={() => handleStatusIconClick(record.key)}
              >
                {renderIcon(record.status_file)}
              </span>
              <span style={{ fontSize: 12, display: "block", marginTop: 4 }}>
                {record.author_status_file || ""}
              </span>
            </Tooltip>
          </div>
        );
      },
    });
    columns.push({
      title: "flie",
      dataIndex: "flie",
      key: "flie",
      align: "center",
      width: 40,
      className: "red-border",
      onHeaderCell: () => ({ style: { textAlign: "center" } }),
      render: (text, record, index) => (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            icon={<MenuUnfoldOutlined />}
            onClick={() => showModal1(record.item_id)}
          />
          {record.author_file && (
            <Tag
              color={record.author_file === storedUsername ? "green" : "red"}
              style={{ marginTop: "10px" }}
            >
              flie
            </Tag>
          )}
        </div>
      ),
    });
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <>
        <Modal
          title="QR Code"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          {qrCodeImageUrl ? (
            <>
              <p>Item_Id Value: {qrData}</p>
              <img
                src={qrCodeImageUrl}
                alt="QR Code"
                style={{ display: "block", margin: "auto" }}
                width={200}
                height={200}
              />
            </>
          ) : (
            <p>กำลังโหลด...</p>
          )}
        </Modal>

        <Modal
          title="Edit Comment"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel} loading={loading}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              loading={loading}
              onClick={async () => {
                try {
                  if (!currentItemId || !currentAuthor || !currentComment) {
                    message.error("Please fill in all fields before saving.");
                    return;
                  }

                  setLoading(true);

                  const formData = new FormData();
                  formData.append("item_id", currentItemId);
                  formData.append("author", currentAuthor);
                  formData.append("comment", currentComment);
                  if (uploadedFile) {
                    formData.append("image", uploadedFile);
                  }

                  const response: any = await axiosInstance.post(
                    "/commons/save_comment",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );

                  if (response.data.success) {
                    setComments([
                      ...comments,
                      {
                        item_id: currentItemId,
                        author: currentAuthor,
                        comment: currentComment,
                        comment_image: uploadedFile
                          ? URL.createObjectURL(uploadedFile)
                          : null,
                        created_at: response.data.created_at,
                      },
                    ]);
                    setIsModalVisible(false);
                    setCurrentComment("");
                    setUploadedFile(null);
                    setFileList([]);
                    message.success(response.data.message);
                  }
                } catch (error) {
                  console.error("Error saving comment:", error);
                  message.error("Failed to save comment. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>,
          ]}
        >
          <h3>User :</h3>
          <Spin spinning={loading}>
            <Input
              value={currentAuthor ?? ""}
              readOnly
              style={{ marginBottom: "16px", fontWeight: "bold" }}
            />
          </Spin>
          <h3>Comment :</h3>
          <Spin spinning={loading}>
            <Input.TextArea
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              rows={4}
              placeholder="Enter your comment here..."
              style={{ marginBottom: "16px" }}
            />
          </Spin>
          <h3>Upload Image:</h3>
          <Spin spinning={loading}>
            <Upload
              fileList={fileList}
              beforeUpload={(file) => {
                setUploadedFile(file);
                setFileList([
                  {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    url: URL.createObjectURL(file),
                  },
                ]);
                return false;
              }}
              onRemove={() => setFileList([])}
              accept="image/*"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Spin>
          <div style={{ marginTop: "16px" }}>
            <strong>Item ID:</strong> {currentItemId}
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3>All Comments</h3>
            <List
              bordered
              dataSource={comments
                .filter((item) => item.item_id === currentItemId)
                .sort(
                  (a, b) =>
                    new Date(a.created_at || 0).getTime() -
                    new Date(b.created_at || 0).getTime()
                )}
              renderItem={(item) => <CommentItem item={item} />}
            />
          </div>
        </Modal>

        <Modal
          title="Edit Comment"
          open={isModalFile}
          onOk={handleOk1}
          onCancel={handleCancel1}
          footer={[
            <Button key="cancel" onClick={handleCancel1} loading={loading}>
              Cancel
            </Button>,
            <Button
              key="save"
              type="primary"
              loading={loading}
              onClick={async () => {
                try {
                  if (!currentItemId1 || !currentAuthor || !currentComment1) {
                    message.error("Please fill in all fields before saving.");
                    return;
                  }
                  setLoading(true);
                  const formData = new FormData();
                  formData.append("item_id", currentItemId1); // ✅ ตรง
                  formData.append("author_file", currentAuthor); // ✅ เปลี่ยนเป็น author_file
                  formData.append("comment_file", currentComment1); // ✅ เปลี่ยนเป็น comment_file
                  if (uploadedFile1) {
                    formData.append("image", uploadedFile1); // ✅ ส่งไฟล์จริง
                  }

                  const response: any = await axiosInstance.post(
                    "/commons/save_file_comment",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  if (response.data.success) {
                    setComments1([
                      ...comments1,
                      {
                        item_id: currentItemId1,
                        author_file: currentAuthor,
                        comment_file: currentComment1,
                        upload_commentfile: uploadedFile1
                          ? URL.createObjectURL(uploadedFile1)
                          : null,
                        created_file: response.data.created_at,
                      },
                    ]);
                    setIsModalFile(false);
                    setCurrentComment1("");
                    setUploadedFile1(null);
                    setFileList1([]);
                    message.success(response.data.message);
                    notification.success({
                      key: Date.now(),
                      message: "Comment Saved",
                      description: `📝 ${currentComment1}`,
                      placement: "bottomRight",
                      duration: 3,
                    });
                  }
                } catch (error) {
                  console.error("Error saving comment:", error);
                  message.error("Failed to save comment. Please try again.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>,
          ]}
        >
          <h3>User :</h3>
          <Spin spinning={loading}>
            <Input
              value={currentAuthor ?? ""}
              readOnly
              style={{ marginBottom: "16px", fontWeight: "bold" }}
            />
          </Spin>
          <h3>Comment :</h3>
          <Spin spinning={loading}>
            <Input.TextArea
              value={currentComment1}
              onChange={(e) => setCurrentComment1(e.target.value)}
              rows={4}
              placeholder="Enter your comment here..."
              style={{ marginBottom: "16px" }}
            />
          </Spin>
          <h3>Upload STL File:</h3>
          <Spin spinning={loading}>
            <Upload
              fileList={fileList1}
              beforeUpload={(file) => {
                setUploadedFile1(file); // ✅ เก็บไฟล์ object จริง ไม่ต้องเก็บ url
                setFileList1([
                  {
                    uid: file.uid,
                    name: file.name,
                    status: "done",
                    url: URL.createObjectURL(file),
                    originFileObj: file, // ✅ เพิ่มไว้สำหรับเผื่อใช้
                  },
                ]);
                return false;
              }}
              onRemove={() => {
                setUploadedFile1(null);
                setFileList1([]);
              }}
              accept="*/*" // ✅ รับไฟล์ .stl เท่านั้น
              listType="text" // ✅ แสดงแบบ text ไม่ใช่รูป
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select STL File</Button>
            </Upload>
          </Spin>
          <div style={{ marginTop: "16px" }}>
            <strong>Item ID:</strong> {currentItemId1}
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3>All Comments</h3>
            <List
              bordered
              dataSource={comments1
                .filter((item) => item.item_id === currentItemId1)
                .sort(
                  (a, b) =>
                    new Date(a.created_file || 0).getTime() -
                    new Date(b.created_file || 0).getTime()
                )}
              renderItem={(item) => <CommentItem1 item={item} />}
            />
          </div>
        </Modal>
      </>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Retainer Data
      </h2>
      <Space
        size="large"
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>
          <CalendarOutlined /> วันที่ :
        </span>
        <RangePicker
          style={{ width: 220, marginLeft: -20 }}
          onChange={(values) =>
            setDates([
              values?.[0]?.toDate() || null,
              values?.[1]?.toDate() || null,
            ])
          }
          format="DD/MM/YYYY"
          disabled={loading}
        />
        <span>
          <BarsOutlined /> สาขา :
        </span>
        <Select
          value={branchName}
          // onChange={setBranchName}
          onChange={(newValues) => setBranchName(newValues)}
          style={{ width: 80, marginLeft: -20 }}
          mode="multiple"
          showSearch={false}
          disabled={loading}
        >
          <Option
            value="All"
            disabled={branchName.length > 0 && !branchName.includes("All")}
          >
            All
          </Option>
          <Option value="RA" disabled={branchName.includes("All")}>
            RA
          </Option>
          <Option value="AR" disabled={branchName.includes("All")}>
            AR
          </Option>
          <Option value="SA" disabled={branchName.includes("All")}>
            SA
          </Option>
          <Option value="AS" disabled={branchName.includes("All")}>
            AS
          </Option>
          <Option value="ON" disabled={branchName.includes("All")}>
            ON
          </Option>
          <Option value="UD" disabled={branchName.includes("All")}>
            UD
          </Option>
          <Option value="NW" disabled={branchName.includes("All")}>
            NW
          </Option>
          <Option value="CW" disabled={branchName.includes("All")}>
            CW
          </Option>
          <Option value="R2" disabled={branchName.includes("All")}>
            R2
          </Option>
          <Option value="LB" disabled={branchName.includes("All")}>
            LB
          </Option>
          <Option value="BK" disabled={branchName.includes("All")}>
            BK
          </Option>
          <Option value="SQ" disabled={branchName.includes("All")}>
            SQ
          </Option>
          <Option value="BN" disabled={branchName.includes("All")}>
            BN
          </Option>
          <Option value="PK" disabled={branchName.includes("All")}>
            PK
          </Option>
          <Option value="RS" disabled={branchName.includes("All")}>
            RS
          </Option>
          <Option value="FS" disabled={branchName.includes("All")}>
            FS
          </Option>
          <Option value="T3" disabled={branchName.includes("All")}>
            T3
          </Option>
          <Option value="BP" disabled={branchName.includes("All")}>
            BP
          </Option>
          <Option value="NT" disabled={branchName.includes("All")}>
            NT
          </Option>
          <Option value="PP" disabled={branchName.includes("All")}>
            PP
          </Option>
        </Select>
        <span>
          <FilterOutlined /> Filter :
        </span>
        <Input
          placeholder="ชื่อ-สกุล หรือ เลขHN"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 200, marginLeft: -20 }}
          disabled={loading || !data.length}
        />
        <span>
          <ProjectOutlined /> สถานะการผลิต :
        </span>
        <Select
          mode="multiple"
          placeholder="Search by Status"
          value={Array.isArray(searchQuerystatus) ? searchQuerystatus : ["All"]}
          onChange={(values) => {
            if (values.includes("All")) {
              setSearchQuerystatus(["All"]);
            } else {
              setSearchQuerystatus(values.filter((v) => v !== "All"));
            }
          }}
          style={{ width: 160, marginLeft: -20 }}
          disabled={loading || !data.length}
        >
          <Option
            value="All"
            disabled={
              searchQuerystatus.length > 0 && searchQuerystatus[0] !== "All"
            }
          >
            All
          </Option>
          <Option
            value="รอช่างมารับงาน"
            disabled={searchQuerystatus.includes("All")}
          >
            รอช่างมารับงาน
          </Option>
          <Option
            value="ช่างรับงานแล้ว"
            disabled={searchQuerystatus.includes("All")}
          >
            ช่างรับงานแล้ว
          </Option>
          <Option
            value="งานเสร็จแล้วรอส่ง"
            disabled={searchQuerystatus.includes("All")}
          >
            งานเสร็จแล้วรอส่ง
          </Option>
          <Option
            value="จัดส่งงานแล้ว"
            disabled={searchQuerystatus.includes("All")}
          >
            จัดส่งงานแล้ว
          </Option>
          <Option
            value="ลูกค้ารับงานแล้ว"
            disabled={searchQuerystatus.includes("All")}
          >
            ลูกค้ารับงานแล้ว
          </Option>
          <Option value="แก้งาน" disabled={searchQuerystatus.includes("All")}>
            แก้งาน
          </Option>
        </Select>
        <span>
          <AppstoreOutlined /> หัตถการ :
        </span>
        <Select
          mode="multiple"
          placeholder="Search by Product"
          value={
            Array.isArray(searchQueryproduct) ? searchQueryproduct : ["All"]
          }
          onChange={(values) => {
            if (values.includes("All")) {
              setSearchQueryproduct(["All"]);
            } else {
              setSearchQueryproduct(values.filter((v) => v !== "All"));
            }
          }}
          style={{ width: 200, marginLeft: -20 }}
          disabled={loading || !data.length}
        >
          <Option
            value="All"
            disabled={
              searchQueryproduct.length > 0 && searchQueryproduct[0] !== "All"
            }
          >
            All
          </Option>
          <Option
            value="พิมพ์ retainer - ลวด"
            disabled={searchQueryproduct.includes("All")}
          >
            พิมพ์ retainer - ลวด
          </Option>
          <Option
            value="พิมพ์ retainer - ใส"
            disabled={searchQueryproduct.includes("All")}
          >
            พิมพ์ retainer - ใส
          </Option>
          <Option
            value="พิมพ์ retainer แพ็คคู่"
            disabled={searchQueryproduct.includes("All")}
          >
            พิมพ์ retainer - แพ็คคู่
          </Option>
          <Option
            value="สแกน retainer - ลวด"
            disabled={searchQueryproduct.includes("All")}
          >
            สแกน retainer - ลวด
          </Option>
          <Option
            value="สแกน retainer - ใส"
            disabled={searchQueryproduct.includes("All")}
          >
            สแกน retainer - ใส
          </Option>
          <Option
            value="สแกน retainer แพ็คคู่"
            disabled={searchQueryproduct.includes("All")}
          >
            สแกน retainer - แพ็คคู่
          </Option>
          <Option
            value="งานแก้ รีเทนเนอร์ ลวด"
            disabled={searchQueryproduct.includes("All")}
          >
            งานแก้ รีเทนเนอร์ ลวด
          </Option>
          <Option
            value="งานแก้ รีเทนเนอร์ ใส"
            disabled={searchQueryproduct.includes("All")}
          >
            งานแก้ รีเทนเนอร์ ใส
          </Option>
          <Option
            value="ทำ tray ฟอกสีฟัน"
            disabled={searchQueryproduct.includes("All")}
          >
            ทำ tray ฟอกสีฟัน
          </Option>
          <Option
            value="night guard"
            disabled={searchQueryproduct.includes("All")}
          >
            Night Guard
          </Option>
        </Select>
        <span>
          <AppstoreOutlined /> พื้นที่ :
        </span>
        <Select
          mode="multiple"
          placeholder="Search by Product"
          value={
            Array.isArray(searchQuerybrcsname) ? searchQuerybrcsname : ["All"]
          }
          onChange={(values) => {
            if (values.includes("All")) {
              setSearchQuerybrcsname(["All"]);
            } else {
              setSearchQuerybrcsname(values.filter((v) => v !== "All"));
            }
          }}
          style={{ width: 230, marginLeft: -20 }}
          disabled={loading || !data.length}
        >
          <Option
            value="All"
            disabled={
              searchQuerybrcsname.length > 0 && searchQuerybrcsname[0] !== "All"
            }
          >
            All
          </Option>
          <Option
            value="RA,BP,FS,LB,AR,NW,CW,RS"
            disabled={searchQuerybrcsname.includes("All")}
          >
            วันจันทร์
          </Option>
          <Option
            value="BK,R2,PK,T3,SA,NT,AS,SQ,ON,PP,BN,UD"
            disabled={searchQuerybrcsname.includes("All")}
          >
            วันอังคาร
          </Option>
          <Option
            value="RA,BP,FS,LB,AR,NW,CW,RS"
            disabled={searchQuerybrcsname.includes("All")}
          >
            วันพุธ
          </Option>
          <Option
            value="BK,R2,PK,T3,SA,NT,AS,SQ,ON,PP,BN,UD"
            disabled={searchQuerybrcsname.includes("All")}
          >
            วันพฤหัสบดี
          </Option>
          <Option
            value="RA,BP,FS,LB,AR,NW,CW,RS"
            disabled={searchQuerybrcsname.includes("All")}
          >
            วันศุกร์
          </Option>
          <Option
            value="BK,R2,PK,T3,SA,NT,AS,SQ,ON,PP,BN,UD"
            disabled={searchQuerybrcsname.includes("All")}
          >
            วันเสาร์
          </Option>
        </Select>
        <span>
          <MenuUnfoldOutlined /> วันที่นัดลูกค้า :
        </span>
        <DatePicker.RangePicker
          value={searchQueryDate}
          onChange={(dates) => setSearchQueryDate(dates ?? null)}
          format="DD/MM/YYYY"
          style={{ width: 220, marginLeft: -20 }}
          disabled={loading || !data.length}
        />
        <Button
          type="primary"
          onClick={fetchData}
          loading={loading}
          style={{
            boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)",
            marginLeft: -10,
          }}
        >
          Search <SearchOutlined />
        </Button>
      </Space>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="default"
          onClick={DownloadImageAll}
          loading={loading}
          disabled={
            !data.length ||
            storedUsername === "Messenger" ||
            restrictedUsers.includes(storedUsername ?? "")
          }
          style={{
            marginBottom: "20px",
            boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)",
            marginRight: "5px",
          }}
        >
          ดาวน์โหลดรูปภาพทั้งหมด <FileImageOutlined />
        </Button>
        <Button
          type="default"
          onClick={exportCSV}
          loading={loading}
          disabled={
            !data.length ||
            storedUsername === "Messenger" ||
            restrictedUsers.includes(storedUsername ?? "")
          }
          style={{
            marginBottom: "20px",
            boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)",
          }}
        >
          Export CSV <DownloadOutlined />
        </Button>
      </div>
      {error && (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      )}

      <Tabs
        defaultActiveKey="all"
        onChange={(key) => {
          const status = statusTabs.find((s) => s.key === key);
          if (!status) return;

          if (status.value === "All") {
            setSearchQuerystatus(["All"]);
          } else if (status.value === "") {
            setSearchQuerystatus([""]); // ✨ ฟิลเตอร์ค่าว่าง
          } else {
            setSearchQuerystatus([status.value.toLowerCase()]);
          }
        }}
        style={{ marginBottom: 16 }}
      >
        {statusTabs.map((status) => (
          <TabPane tab={status.label} key={status.key} />
        ))}
      </Tabs>

      <Table
        size="small" // ✅ เพิ่มอันนี้
        columns={columns}
        dataSource={data.filter((item) => {
          const itemDate = item.date_of_book
            ? dayjs(item.date_of_book, "YYYY-MM-DD")
            : null;
          const startDate = searchQueryDate ? searchQueryDate[0] : null;
          const endDate = searchQueryDate ? searchQueryDate[1] : null;

          return (
            (searchQuery
              ? item.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.pt_ohn?.toLowerCase().includes(searchQuery.toLowerCase())
              : true) &&
            // (searchQuerystatus.includes("All") ||
            //   searchQuerystatus.includes(
            //     item.status_data?.toLowerCase() ?? ""
            //   ))
            (searchQuerystatus.includes("All") ||
              searchQuerystatus.includes(
                (item.status_data
                  ? item.status_data
                  : "รอช่างมารับงาน"
                ).toLowerCase()
              )) &&
            (searchQueryproduct.includes("All") ||
              searchQueryproduct.includes(
                item.prd_name?.toLowerCase() ?? ""
              )) &&
            (searchQuerybrcsname.includes("All") ||
              searchQuerybrcsname.some((brc) =>
                item.brc_sname
                  ?.split(",")
                  .map((s) => s.trim().toLowerCase())
                  .some((brcName) =>
                    brc
                      .split(",") // เปลี่ยนจาก Array เป็น String และแยกค่า
                      .some((branch) =>
                        branch.toLowerCase().includes(brcName.toLowerCase())
                      )
                  )
              )) &&
            // (!searchQueryDate ||
            //   (itemDate &&
            //     (itemDate.isSame(startDate, "day") ||
            //       itemDate.isAfter(startDate, "day")) &&
            //     (itemDate.isSame(endDate, "day") ||
            //       itemDate.isBefore(endDate, "day"))))
            (!searchQueryDate ||
              !itemDate || // ดึงรายการที่ไม่มีวันที่ด้วย
              (itemDate &&
                (itemDate.isSame(startDate, "day") ||
                  itemDate.isAfter(startDate, "day")) &&
                (itemDate.isSame(endDate, "day") ||
                  itemDate.isBefore(endDate, "day"))))
          );
        })}
        rowClassName={(record) => {
          const today = dayjs();
          const dateOfRcp = record.date_of_rcp
            ? dayjs(record.date_of_rcp)
            : null;

          if (dateOfRcp && dateOfRcp.isSame(today, "day")) {
            return "highlight-today"; // ใช้ class CSS เปลี่ยนสีแถว
          }
          return "";
        }}
        loading={loading}
        bordered
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100", "1000"],
          defaultPageSize: 10,
          onChange: (page, pageSize) => {
            if (pageSize === 1000) {
              setDataSource(data);
            } else {
              const pageSizeNumber =
                typeof pageSize === "string" ? Number(pageSize) : pageSize;
              const startIndex = (page - 1) * pageSizeNumber;
              const endIndex = page * pageSizeNumber;
              setDataSource(data.slice(startIndex, endIndex));
            }
          },
        }}
        scroll={{
          x: 2100,
          y: 500, // ✅ เพิ่ม scrollbar ด้านในแนวตั้ง
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={handleSummit}
          loading={loading}
          disabled={!data.length}
          style={{
            boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)",
            marginTop: "10px",
          }}
        >
          <SaveOutlined /> Submit
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
