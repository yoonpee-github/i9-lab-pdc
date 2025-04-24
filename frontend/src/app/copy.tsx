// "use client";
// import React, { useState } from "react";
// import axiosInstance from "@/app/utils/axios";
// import { RcFile } from "antd/lib/upload/interface";
// import {
//   Table,
//   DatePicker,
//   Select,
//   Input,
//   Button,
//   Space,
//   message,
//   Upload,
//   Modal,
//   List,
// } from "antd";
// import { FileImageOutlined, CommentOutlined } from "@ant-design/icons";
// import type { ColumnsType } from "antd/es/table";
// import { format } from "date-fns";
// import "antd/dist/reset.css";
// import dayjs from "dayjs";

// const { RangePicker } = DatePicker;
// const { Option } = Select;

// interface DataWi {
//   key: string;
//   item_id: string;
//   Name: string;
//   pt_ohn: string;
//   prd_name: string;
//   date_of_book: string;
//   item_qty: string;
//   lc_no: string;
//   doctor_name: number;
//   brc_sname: string;
//   status_data?: string;
//   finish_date?: string;
//   previous_status_data?: string;
//   previous_finish_date?: string;
//   file_path?: string;
//   date_of_insertss?: string;
// }

// const status_data = ["Pending", "In Progress", "Completed", "Cancelled"];

// const getStatusTextColor = (status: any) => {
//   switch (status) {
//     case "Completed":
//       return "green";
//     case "Cancelled":
//       return "red";
//     case "In Progress":
//       return "blue";
//     default:
//       return "black";
//   }
// };

// const DataTable: React.FC = () => {
//   const [data, setData] = useState<DataWi[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
//   const [branchName, setBranchName] = useState<string>("All");
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [searchQuerystatus, setSearchQuerystatus] = useState<string>("All");
//   const [searchQueryproduct, setSearchQueryproduct] = useState<string>("All");
//   const [dataSource, setDataSource] = useState(data);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [currentItemId, setCurrentItemId] = useState("");
//   const [currentComment, setCurrentComment] = useState("");
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [currentAuthor, setCurrentAuthor] = useState("");
//   const [comments, setComments] = useState<
//     { author: string; comment: string; item_id: string }[]
//   >([]);

//   const exportCSV = () => {
//     const header = [
//       "Name",
//       "เลข HN",
//       "ชนิด",
//       "Due Date",
//       "จำนวน",
//       "เลขที่",
//       "ชื่อแพทย์",
//       "สาขา2",
//     ];

//     const csvData = data.map((item) => [
//       `"${item.Name || ""}"`,
//       `"${item.pt_ohn || ""}"`,
//       `"${item.prd_name || ""}"`,
//       `"${
//         item.date_of_book
//           ? format(new Date(item.date_of_book), "dd/MM/yyyy")
//           : ""
//       }"`,
//       `"${item.item_qty || ""}"`,
//       `"${item.lc_no || ""}"`,
//       `"${item.doctor_name || ""}"`,
//       `"${item.brc_sname || ""}"`,
//     ]);

//     const csvContent = [header, ...csvData].map((e) => e.join(",")).join("\n");

//     const blob = new Blob(["\uFEFF" + csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "retainer_data.csv";
//     link.click();
//   };

//   const fetchData = async () => {
//     if (!dates[0] || !dates[1]) {
//       message.error("Please select both Start Date and End Date");
//       return;
//     }

//     setLoading(true);
//     try {
//       const formattedStartDate = format(dates[0], "yyyy-MM-dd");
//       const formattedEndDate = format(dates[1], "yyyy-MM-dd");

//       const response = await axiosInstance.get("/commons/get_all_data", {
//         params: {
//           start_date: formattedStartDate,
//           end_date: formattedEndDate,
//           branch_name: branchName,
//         },
//       });

//       setData(
//         response.data.map((item: any, index: number) => ({
//           ...item,
//           key: index.toString(),
//           finish_date: item.finish_date
//             ? format(new Date(item.finish_date), "yyyy-MM-dd")
//             : "",
//         }))
//       );
//       setError(null);
//     } catch (err) {
//       setError("Failed to Search data. Please try again.");
//       message.error("Failed to Search data.");
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (key: string, newStatus: string) => {
//     setData((prevData) =>
//       prevData.map((item) =>
//         item.key === key ? { ...item, status_data: newStatus } : item
//       )
//     );

//     const item = data.find((item) => item.key === key);

//     if (item) {
//       try {
//         const payload: any = {
//           item_id: item.item_id,
//           status_data: newStatus,
//         };

//         if (item.finish_date) {
//           payload.finish_date = item.finish_date;
//         }

//         await axiosInstance.post("/commons/post_status_data", payload);
//         message.success("Status updated successfully");

//         // await fetchData();
//       } catch (err) {
//         message.error("Failed to update status");
//       }
//     }
//   };

//   const handleFinishDateChange = async (key: string, date: any) => {
//     const formattedDate = date ? format(new Date(date), "yyyy-MM-dd") : "";

//     setData((prevData) =>
//       prevData.map((item) =>
//         item.key === key ? { ...item, finish_date: formattedDate } : item
//       )
//     );

//     const item = data.find((item) => item.key === key);

//     if (item) {
//       try {
//         await axiosInstance.post("/commons/post_status_data", {
//           item_id: item.item_id,
//           status_data: item.status_data,
//           finish_date: formattedDate,
//         });
//         message.success("Finish date updated successfully");

//         // await fetchData();
//       } catch (err) {
//         message.error("Failed to update finish date");
//       }
//     }
//   };

//   const handleSummit = async () => {
//     setLoading(true);
//     try {
//       await fetchData();
//       message.success("Save Data successfully.");
//     } catch (err) {
//       setError("Failed to fetch data. Please try again.");
//       message.error("Failed to fetch data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showModal = (commentText: string, itemId: string) => {
//     setCurrentComment(commentText);
//     setCurrentItemId(itemId);
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     console.log(
//       "Updated comment for index:",
//       editingIndex,
//       "Name",
//       currentAuthor,
//       "Value:",
//       currentComment
//     );
//     setIsModalVisible(false);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const columns: ColumnsType<DataWi> = [
//     {
//       title: "#",
//       dataIndex: "key",
//       key: "key",
//       align: "center",
//       fixed: "left",
//       width: 15,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//       render: (text) => parseInt(text) + 1,
//     },
//     {
//       title: "Name",
//       dataIndex: "Name",
//       key: "Name",
//       fixed: "left",
//       width: 75,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//       render: (text: string) => {
//         const dateMatch = text.match(/(\d{1,2})\/(\d{1,2})/);
//         const formattedDate = dateMatch
//           ? `${dateMatch[2]}/${dateMatch[1]}`
//           : "";
//         return (
//           <>
//             {text}{" "}
//             {formattedDate && (
//               <span style={{ fontSize: "12px", color: "gray" }}>
//                 ({formattedDate})
//               </span>
//             )}
//           </>
//         );
//       },
//       sorter: (a: DataWi, b: DataWi) => {
//         const dateA = a.Name.match(/(\d{1,2})\/(\d{1,2})/);
//         const dateB = b.Name.match(/(\d{1,2})\/(\d{1,2})/);

//         if (!dateA || !dateB) return 0;

//         const dateAObj = new Date(`${dateA[2]}/${dateA[1]}`);
//         const dateBObj = new Date(`${dateB[2]}/${dateB[1]}`);

//         return dateAObj.getTime() - dateBObj.getTime();
//       },
//     },
//     {
//       title: "HN",
//       dataIndex: "pt_ohn",
//       key: "pt_ohn",
//       align: "center",
//       width: 25,
//     },
//     {
//       title: "Procedure",
//       dataIndex: "prd_name",
//       key: "prd_name",
//       width: 45,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "Due Date",
//       dataIndex: "date_of_book",
//       key: "date_of_book",
//       align: "center",
//       width: 35,
//       render: (date: string) =>
//         date ? format(new Date(date), "dd/MM/yyyy") : "",
//     },
//     {
//       title: "Quantity",
//       dataIndex: "item_qty",
//       key: "item_qty",
//       align: "center",
//       width: 21,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "License Number",
//       dataIndex: "lc_no",
//       key: "lc_no",
//       align: "center",
//       width: 30,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "Doctor Name",
//       dataIndex: "doctor_name",
//       key: "doctor_name",
//       width: 50,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "Branch",
//       dataIndex: "brc_sname",
//       key: "brc_sname",
//       align: "center",
//       width: 25,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "Status",
//       dataIndex: "status_data",
//       key: "status_data",
//       align: "center",
//       width: 50,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//       render: (_, record) => (
//         <Select
//           value={record.status_data}
//           onChange={(value) => handleStatusChange(record.key, value)}
//           style={{ width: 120 }}
//           dropdownStyle={{ textAlign: "center" }}
//         >
//           {status_data.map((status) => (
//             <Option
//               key={status}
//               value={status}
//               style={{ color: getStatusTextColor(status) }}
//             >
//               {status}
//             </Option>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Update Status",
//       dataIndex: "date_of_inserts",
//       key: "date_of_inserts",
//       align: "center",
//       width: 35,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "Finish Date",
//       dataIndex: "finish_date",
//       key: "finish_date",
//       align: "center",
//       width: 50,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//       render: (_, record) => (
//         <DatePicker
//           value={
//             record.finish_date ? dayjs(record.finish_date, "YYYY-MM-DD") : null
//           }
//           onChange={(date) => handleFinishDateChange(record.key, date)}
//           format="YYYY-MM-DD"
//         />
//       ),
//     },
//     // {
//     //   title: "Show Image",
//     //   dataIndex: "file_path",
//     //   key: "file_path",
//     //   align: "center",
//     //   width: 80,
//     //   onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     //   render: (file_path) => {
//     //     const updatedFilePath = file_path.replace(/\\\\/g, "/");
//     //     const fileName = updatedFilePath.split("/").pop(); // ดึงชื่อไฟล์ออกมา
//     //     return (
//     //       <img
//     //         src={`http://localhost:8000/uploads/${fileName}`} // URL ใหม่ที่ถูกต้อง
//     //         alt="Uploaded Image"
//     //         style={{ width: "100px", height: "auto" }}
//     //         onError={(e) => {
//     //           const img = e.target;
//     //           img.onerror = null;
//     //           img.src = "https://via.placeholder.com/100";
//     //         }}
//     //       />
//     //     );
//     //   },
//     // },
//     {
//       title: "Upload Image",
//       key: "actions",
//       align: "center",
//       width: 40,
//       render: (_, record) => (
//         <Upload
//           name="file"
//           accept=".jpg,.png,.jpeg,.pdf"
//           showUploadList={false}
//           customRequest={async ({
//             file,
//             onSuccess = () => {},
//             onError = () => {},
//           }) => {
//             const typedFile = file as RcFile;
//             setLoading(true);

//             try {
//               const formData = new FormData();
//               formData.append("file", typedFile);
//               formData.append("item_id", record.item_id);

//               const response = await axiosInstance.post(
//                 "/commons/upload_file",
//                 formData,
//                 {
//                   headers: {
//                     "Content-Type": "multipart/form-data",
//                   },
//                 }
//               );

//               await fetchData();

//               onSuccess(response.data);
//               message.success(`${typedFile.name} uploaded successfully.`);
//             } catch (error: any) {
//               onError(error);
//               message.error(`${typedFile.name} upload failed.`);
//             } finally {
//               setLoading(false);
//             }
//           }}
//         >
//           <Button type="primary" icon={<FileImageOutlined />}>
//             Upload
//           </Button>
//         </Upload>
//       ),
//     },
//     {
//       title: "Update Image",
//       dataIndex: "date_of_insertss",
//       key: "date_of_insertss",
//       align: "center",
//       width: 35,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//     },
//     {
//       title: "Comment",
//       dataIndex: "comment",
//       key: "comment",
//       align: "center",
//       width: 30,
//       onHeaderCell: () => ({ style: { textAlign: "center" } }),
//       render: (text, record, index) => (
//         <>
//           <Button
//             type="primary"
//             icon={<CommentOutlined />}
//             onClick={() => showModal(text, record.item_id)}
//           />
//         </>
//       ),
//     },
//   ];
//   return (
//     <div style={{ padding: "20px" }}>
//       <>
//         <Modal
//           title="Edit Comment"
//           visible={isModalVisible}
//           onOk={handleOk}
//           onCancel={handleCancel}
//           footer={[
//             <Button key="cancel" onClick={handleCancel}>
//               Cancel
//             </Button>,
//             <Button
//               key="save"
//               type="primary"
//               onClick={async () => {
//                 try {
//                   if (!currentItemId || !currentAuthor || !currentComment) {
//                     alert("Please fill in all fields before saving.");
//                     return;
//                   }
//                   const response = await axiosInstance.post(
//                     `/commons/save_comment?item_id=${currentItemId}&author=${encodeURIComponent(
//                       currentAuthor
//                     )}&comment=${encodeURIComponent(currentComment)}`
//                   );

//                   if (response.data.success) {
//                     setComments([
//                       ...comments,
//                       {
//                         item_id: currentItemId,
//                         author: currentAuthor,
//                         comment: currentComment,
//                       },
//                     ]);
//                     setCurrentAuthor("");
//                     setCurrentComment("");
//                     setCurrentItemId("");
//                     handleOk();
//                     message.success(response.data.message);
//                   }
//                 } catch (error) {
//                   console.error("Error saving comment:", error);
//                   message.error("Failed to save comment. Please try again.");
//                 }
//               }}
//             >
//               Save
//             </Button>,
//           ]}
//         >
//           <Input
//             value={currentAuthor}
//             onChange={(e) => setCurrentAuthor(e.target.value)}
//             placeholder="Enter your name..."
//             style={{ marginBottom: "16px" }}
//           />
//           <Input.TextArea
//             value={currentComment}
//             onChange={(e) => setCurrentComment(e.target.value)}
//             rows={4}
//             placeholder="Enter your comment here..."
//           />
//           <div style={{ marginTop: "16px" }}>
//             <strong>Item ID:</strong> {currentItemId}
//           </div>
//           <div style={{ marginTop: "20px" }}>
//             <h3>All Comments</h3>
//             <List
//               bordered
//               dataSource={comments.filter(
//                 (item) => item.item_id === currentItemId
//               )}
//               renderItem={(item, index) => (
//                 <List.Item key={index}>
//                   <strong>{item.author}:</strong> {item.comment} (Item ID:{" "}
//                   {item.item_id})
//                 </List.Item>
//               )}
//             />
//           </div>
//         </Modal>
//       </>

//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         Retainer Data
//       </h2>
//       <Space
//         size="large"
//         style={{
//           marginBottom: "20px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <span>Date :</span>
//         <RangePicker
//           style={{ width: 220, marginLeft: -15 }}
//           onChange={(values) =>
//             setDates([
//               values?.[0]?.toDate() || null,
//               values?.[1]?.toDate() || null,
//             ])
//           }
//           format="YYYY-MM-DD"
//           disabled={loading}
//         />
//         <span>Branch :</span>
//         <Select
//           value={branchName}
//           onChange={setBranchName}
//           style={{ width: 60, marginLeft: -15 }}
//           disabled={loading}
//         >
//           <Option value="All">All</Option>
//           <Option value="RA">RA</Option>
//           <Option value="AR">AR</Option>
//           <Option value="SA">SA</Option>
//           <Option value="AS">AS</Option>
//           <Option value="ON">ON</Option>
//           <Option value="UD">UD</Option>
//           <Option value="NW">NW</Option>
//           <Option value="CW">CW</Option>
//           <Option value="R2">R2</Option>
//           <Option value="LB">LB</Option>
//           <Option value="BK">BK</Option>
//           <Option value="PK">PK</Option>
//           <Option value="RS">RS</Option>
//           <Option value="FS">FS</Option>
//           <Option value="T3">T3</Option>
//           <Option value="BP">BP</Option>
//           <Option value="NT">NT</Option>
//           <Option value="PP">PP</Option>
//         </Select>
//         <span>Filter :</span>
//         <Input
//           placeholder="Search by Name or HN"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           style={{ width: 180, marginLeft: -15 }}
//           disabled={loading}
//         />
//         <span>Status :</span>
//         <Select
//           placeholder="Search by Status"
//           value={searchQuerystatus || "All"}
//           onChange={(value: string) => setSearchQuerystatus(value)}
//           style={{ width: 120, marginLeft: -15 }}
//           disabled={loading}
//         >
//           <Option value="All">All</Option>
//           <Option value="Pending">Pending</Option>
//           <Option value="Completed">Completed</Option>
//           <Option value="In Progress">In Progress</Option>
//           <Option value="Cancelled">Cancelled</Option>
//         </Select>
//         <span>Product :</span>
//         <Select
//           placeholder="Search by Product"
//           value={searchQueryproduct || "All"}
//           onChange={(value: string) => setSearchQueryproduct(value)}
//           style={{ width: 160, marginLeft: -15 }}
//           disabled={loading}
//         >
//           <Option value="All">All</Option>
//           <Option value="พิมพ์ retainer - ลวด">พิมพ์ retainer - ลวด</Option>
//           <Option value="พิมพ์ retainer - ใส">พิมพ์ retainer - ใส</Option>
//           <Option value="งานแก้ รีเทนเนอร์ ลวด">งานแก้ รีเทนเนอร์ ลวด</Option>
//           <Option value="งานแก้ รีเทนเนอร์ ใส">งานแก้ รีเทนเนอร์ ใส</Option>
//         </Select>
//         <Button
//           type="primary"
//           onClick={fetchData}
//           loading={loading}
//           style={{ boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)" }}
//         >
//           Search
//         </Button>
//       </Space>

//       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           type="default"
//           onClick={exportCSV}
//           loading={loading}
//           style={{
//             marginBottom: "20px",
//             boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)",
//           }}
//         >
//           Export CSV
//         </Button>
//       </div>

//       {error && (
//         <div style={{ color: "red", textAlign: "center" }}>{error}</div>
//       )}

//       <Table
//         columns={columns}
//         dataSource={data.filter(
//           (item) =>
//             (searchQuery
//               ? item.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 item.pt_ohn?.toLowerCase().includes(searchQuery.toLowerCase())
//               : true) &&
//             (searchQuerystatus === "All" ||
//               item.status_data?.toLowerCase() ===
//                 searchQuerystatus.toLowerCase()) &&
//             (searchQueryproduct === "All" ||
//               item.prd_name?.toLowerCase() === searchQueryproduct.toLowerCase())
//         )}
//         loading={loading}
//         bordered
//         pagination={{
//           pageSizeOptions: ["10", "20", "50", "100", "1000"],
//           defaultPageSize: 10,
//           onChange: (page, pageSize) => {
//             if (pageSize === 1000) {
//               setDataSource(data);
//             } else {
//               const pageSizeNumber =
//                 typeof pageSize === "string" ? Number(pageSize) : pageSize;
//               const startIndex = (page - 1) * pageSizeNumber;
//               const endIndex = page * pageSizeNumber;
//               setDataSource(data.slice(startIndex, endIndex));
//             }
//           },
//         }}
//         scroll={{
//           x: 1800,
//         }}
//       />
//       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//         <Button
//           type="primary"
//           onClick={handleSummit}
//           loading={loading}
//           style={{
//             boxShadow: "4px 4px 8px rgba(0, 15, 56, 0.2)",
//           }}
//         >
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default DataTable;

////////////////////////////////////////////////////////////////////////////////////////

// const handleStatusChange = async (key: string, newStatus: string) => {
//   setData((prevData) =>
//     prevData.map((item) =>
//       item.key === key ? { ...item, status_data: newStatus } : item
//     )
//   );

//   const item = data.find((item) => item.key === key);
//   if (item) {
//     try {
//       const payload: any = {
//         item_id: item.item_id,
//         status_data: newStatus,
//       };
//       if (item.finish_date) {
//         payload.finish_date = item.finish_date;
//       }
//       await axiosInstance.post("/commons/post_status_data", payload);
//       message.success("Status updated successfully");
//       // await fetchData();
//     } catch (err) {
//       message.error("Failed to update status");
//     }
//   }
// };

// {
//   title: "Quantity",
//   dataIndex: "item_qty",
//   key: "item_qty",
//   align: "center",
//   width: 30,
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
// },

// {
//   title: "Status",
//   dataIndex: "status_data",
//   key: "status_data",
//   align: "center",
//   width: 50,
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
//   render: (_, record) => (
//     <Select
//       value={record.status_data}
//       onChange={(value) => handleStatusChange(record.key, value)}
//       style={{ width: 120 }}
//       dropdownStyle={{ textAlign: "center" }}
//     >
//       {status_data.map((status) => (
//         <Option
//           key={status}
//           value={status}
//           style={{ color: getStatusTextColor(status) }}
//         >
//           {status}
//         </Option>
//       ))}
//     </Select>
//   ),
// },

// {
//   title: "Update Status",
//   dataIndex: "date_of_inserts",
//   key: "date_of_inserts",
//   align: "center",
//   width: 35,
//   render: (text) => {
//     if (!text) return "";
//     const date = new Date(text);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}/${date.getFullYear()} ${String(
//       date.getHours()
//     ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
//       2,
//       "0"
//     )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
//   },
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
// },

// {
//   title: "Finish Date",
//   dataIndex: "finish_date",
//   key: "finish_date",
//   align: "center",
//   width: 50,
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
//   render: (_, record) => (
//     <DatePicker
//       value={
//         record.finish_date ? dayjs(record.finish_date, "YYYY-MM-DD") : null
//       }
//       onChange={(date) => handleFinishDateChange(record.key, date)}
//       format="DD/MM/YYYY"
//     />
//   ),
// },

// {
//   title: "รูปใบงาน",
//   dataIndex: "file_path",
//   key: "file_path",
//   align: "center",
//   width: 50,
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
//   render: (file_path: string | null, record: DataWi) => {
//     const RenderImageWithHeaders: React.FC<{
//       file_path: string | null;
//     }> = ({ file_path }) => {
//       const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
//       const imageUrl = `${axiosInstancee.defaults.baseURL}${file_path}`;

//       useEffect(() => {
//         const fetchImage = async () => {
//           try {
//             const response = await fetch(imageUrl, {
//               headers: {
//                 "ngrok-skip-browser-warning": "69420",
//                 "Access-Control-Allow-Origin": "*",
//               },
//             });

//             if (!response.ok) {
//               console.error(
//                 "Failed to fetch image. Status:",
//                 response.status
//               );
//               return;
//             }

//             const blob = await response.blob();
//             const blobUrl = URL.createObjectURL(blob);
//             setImageBlobUrl(blobUrl);

//             return () => {
//               URL.revokeObjectURL(blobUrl);
//             };
//           } catch (error) {
//             console.error("Error fetching image:", error);
//           }
//         };

//         if (file_path) {
//           fetchImage();
//         }
//       }, [file_path, imageUrl]);

//       const DownloadImage = async () => {
//         try {
//           const response = await fetch(imageUrl, {
//             headers: {
//               "ngrok-skip-browser-warning": "69420",
//               "Access-Control-Allow-Origin": "*",
//             },
//           });

//           if (!response.ok) {
//             console.error(
//               "Failed to fetch image. Status:",
//               response.status
//             );
//             return;
//           }

//           const blob = await response.blob();
//           if (!blob.type.includes("image/")) {
//             console.error("Received file is not a valid image.", blob);
//             return;
//           }

//           const imageUrlFromBlob = URL.createObjectURL(blob);
//           const pdf = new jsPDF();
//           const pageWidth = pdf.internal.pageSize.getWidth();
//           const imgWidth = 160;
//           const imgHeight = 180;
//           const x = (pageWidth - imgWidth) / 2;
//           const y = 20;
//           pdf.addImage(imageUrlFromBlob, "JPEG", x, y, imgWidth, imgHeight);
//           pdf.save("Download_Image.pdf");
//           URL.revokeObjectURL(imageUrlFromBlob);
//         } catch (error) {
//           console.error("Error downloading image:", error);
//         }
//       };

//       const formatDate = (text: string | null) => {
//         if (!text) return "";
//         const date = new Date(text);
//         return `${String(date.getDate()).padStart(2, "0")}/${String(
//           date.getMonth() + 1
//         ).padStart(2, "0")}/${date.getFullYear()} ${String(
//           date.getHours()
//         ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
//           2,
//           "0"
//         )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
//       };

//       return (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             flexDirection: "column",
//           }}
//         >
//           {file_path && (
//             <Tooltip
//               title={
//                 record.date_of_insertss
//                   ? `Update At : ${formatDate(
//                       record.date_of_insertss
//                     )} By : ${record.author_image}`
//                   : "ไม่มีข้อมูล"
//               }
//             >
//               <Image
//                 src={imageBlobUrl || ""}
//                 alt="Uploaded Image"
//                 style={{
//                   width: "100px",
//                   height: "auto",
//                   marginBottom: "10px",
//                 }}
//                 preview={{
//                   src: imageBlobUrl || "",
//                 }}
//               />
//             </Tooltip>
//           )}
//           <Upload
//             name="file"
//             accept=".jpg,.png,.jpeg"
//             showUploadList={false}
//             customRequest={async ({
//               file,
//               onSuccess = () => {},
//               onError = () => {},
//             }) => {
//               const typedFile = file as RcFile;
//               setLoading(true);
//               const storedUsername = localStorage.getItem("username");

//               try {
//                 const formData = new FormData();
//                 formData.append("file", typedFile);
//                 formData.append("item_id", record.item_id);
//                 formData.append(
//                   "author_image",
//                   storedUsername || "Unknown"
//                 );

//                 const response = await axiosInstance.post(
//                   "/commons/upload_file",
//                   formData,
//                   {
//                     headers: {
//                       "Content-Type": "multipart/form-data",
//                     },
//                   }
//                 );
//                 await fetchData();
//                 onSuccess(response.data);
//                 message.success(`${typedFile.name} uploaded successfully.`);
//               } catch (error: any) {
//                 onError(error);
//                 message.error(`${typedFile.name} upload failed.`);
//               } finally {
//                 setLoading(false);
//               }
//             }}
//           >
//             {file_path ? (
//               <Button type="link" icon={<EditOutlined />}>
//                 แก้ไขรูปภาพ
//               </Button>
//             ) : (
//               <Button type="link" icon={<FileImageOutlined />}>
//                 บันทึกรูปภาพ
//               </Button>
//             )}
//           </Upload>
//           {file_path && (
//             <>
//               <Button
//                 type="link"
//                 icon={<DownloadOutlined />}
//                 onClick={DownloadImage}
//               >
//                 ดาวน์โหลดรูปภาพ
//               </Button>
//               {/* <div
//                 style={{
//                   fontSize: "12px",
//                   color: "#888",
//                   marginTop: "5px",
//                 }}
//               >
//                 {formatDate(record.date_of_insertss || "")}
//               </div> */}
//             </>
//           )}
//         </div>
//       );
//     };

//     return <RenderImageWithHeaders file_path={file_path} />;
//   },
// },

// {
//   title: "Update Image",
//   dataIndex: "date_of_insertss",
//   key: "date_of_insertss",
//   align: "center",
//   width: 35,
//   render: (text) => {
//     if (!text) return "";
//     const date = new Date(text);
//     return `${String(date.getDate()).padStart(2, "0")}/${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}/${date.getFullYear()} ${String(
//       date.getHours()
//     ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
//       2,
//       "0"
//     )}:${String(date.getSeconds()).padStart(2, "0")} น.`;
//   },
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
// },

// {
//   title: "Messenger",
//   dataIndex: "Mass",
//   key: "Mass",
//   align: "center",
//   width: 25,
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
//   render: (text, record) => (
//     <Checkbox
//       checked={
//         statusMassMap[record.item_id] !== undefined
//           ? statusMassMap[record.item_id]
//           : record.status_mass === "approved"
//       }
//       onChange={(e) =>
//         handleCheckboxChange(record.item_id, e.target.checked)
//       }
//     />
//   ),
// },

{/* <>
  <Modal
    title="Edit Comment"
    // visible={isModalVisible}
    open={isModalVisible}
    onOk={handleOk}
    onCancel={handleCancel}
    footer={[
      <Button key="cancel" onClick={handleCancel}>
        Cancel
      </Button>,
      <Button
        key="save"
        type="primary"
        onClick={async () => {
          try {
            if (!currentItemId || !currentAuthor || !currentComment) {
              message.error("Please fill in all fields before saving.");
              return;
            }
            const response = await axiosInstance.post(
              `/commons/save_comment?item_id=${currentItemId}&author=${encodeURIComponent(
                currentAuthor
              )}&comment=${encodeURIComponent(currentComment)}`
            );
            if (response.data.success) {
              setComments([
                ...comments,
                {
                  item_id: currentItemId,
                  author: currentAuthor,
                  comment: currentComment,
                },
              ]);
              // setCurrentAuthor("");
              setCurrentComment("");
              // setCurrentItemId("");
              // handleOk();
              message.success(response.data.message);
            }
          } catch (error) {
            console.error("Error saving comment:", error);
            message.error("Failed to save comment. Please try again.");
          }
        }}
      >
        Save
      </Button>,
    ]}
  >
    <h3>User :</h3>
    <Input
      value={currentAuthor ?? ""}
      readOnly
      style={{ marginBottom: "16px", fontWeight: "bold" }}
    />
    <h3>Comment :</h3>
    <Input.TextArea
      value={currentComment}
      onChange={(e) => setCurrentComment(e.target.value)}
      rows={4}
      placeholder="Enter your comment here..."
    />
    <div style={{ marginTop: "16px" }}>
      <strong>Item ID:</strong> {currentItemId}
    </div>
    <div style={{ marginTop: "20px" }}>
      <h3>All Comments</h3>
      <List
        bordered
        dataSource={comments.filter((item) => item.item_id === currentItemId)}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <strong>{item.author} :</strong> {item.comment}
            <br />
            <small>
              Created at :{" "}
              {moment(item.created_at).format("DD/MM/YYYY HH:mm:ss น.")}
            </small>
          </List.Item>
        )}
      />
    </div>
  </Modal>
</>; */}

////////////////////////////////////////////////////////////////////////////////////////
// {
//   title: "Messenger",
//   dataIndex: "Mass",
//   key: "Mass",
//   align: "center",
//   width: 36,
//   onHeaderCell: () => ({ style: { textAlign: "center" } }),
//   render: (text, record) => {
//     const formatDate = (text: any) => {
//       if (!text) return "";
//       const date = new Date(text);
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
//           />
//         </Tooltip>
//         {/* {record.date_of_inmass && (
//           <div style={{ fontSize: "12px", color: "#888", marginTop: 8 }}>
//             <h4>อัพเดตเมื่อ :</h4>
//             <div>{formatDate(record.date_of_inmass)}</div>
//           </div>
//         )} */}
//       </div>
//     );
//   },
// },

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
