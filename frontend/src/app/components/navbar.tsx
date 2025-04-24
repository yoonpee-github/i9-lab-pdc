"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import denso from "@/app/assets/plusdental.png";
import { useRouter, usePathname } from "next/navigation";
import { Button, Dropdown, Menu, Popover, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useUser } from "@/app/components/UserContext";

const Navbar = () => {
  const { username, setUsername } = useUser();
  const router = useRouter();
  const pathname = usePathname(); // ดึง path ปัจจุบัน
  const [menuVisible, setMenuVisible] = React.useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    setMenuVisible(false);
    router.push("/");
  };

  return (
    <div
      style={{
        borderBottom: "2px solid lightgray",
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        position: "relative",
        height: "60px",
        justifyContent: "space-between",
        backgroundImage: `url("https://images8.alphacoders.com/128/1283469.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "200px -340px",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
        <Image src={denso} alt="denso" width={50} height={50} priority />
        <Typography.Link
          onClick={(e) => {
            if (username === "Chanatip" || username === "Adminlab1" || username === "Adminlab2" || username === "Adminlab3") {
              router.push("/components");
            } else {
              e.preventDefault(); // Prevent the link from being followed if disabled
            }
          }}
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color:
              pathname === "/components"
                ? "rgb(160, 160, 160)"
                : "rgb(26, 142, 250)",
            pointerEvents:
              username === "Chanatip" || username === "Adminlab1" || username === "Adminlab2" || username === "Adminlab3"
                ? "auto"
                : "none", // Disable pointer events
          }}
        >
          Retainer
        </Typography.Link>

        <Typography.Link
          onClick={(e) => {
            if (username === "Chanatip" || username === "Adminlab1" || username === "Adminlab2" || username === "Adminlab3") {
              router.push("/components/Lab");
            } else {
              e.preventDefault(); // Prevent the link from being followed if disabled
            }
          }}
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color:
              pathname === "/components/Lab"
                ? "rgb(160, 160, 160)"
                : "rgb(26, 142, 250)",
            pointerEvents:
              username === "Chanatip" || username === "Adminlab1" || username === "Adminlab2" || username === "Adminlab3"
                ? "auto"
                : "none", // Disable pointer events
          }}
        >
          Lab
        </Typography.Link>
      </div>

      {username ? (
        <Popover
          content={
            <Menu>
              <Menu.Item key="1">
                <Button
                  type="text"
                  onClick={() => {
                    handleLogout();
                    setMenuVisible(false);
                  }}
                  icon={<LogoutOutlined />}
                  style={{ width: "100%" }}
                >
                  Log out
                </Button>
              </Menu.Item>
            </Menu>
          }
          title="User Options"
          trigger="click"
          open={menuVisible}
          onOpenChange={setMenuVisible}
        >
          <Button type="link" style={{ fontSize: "18px", fontWeight: "bold" }}>
            {username}
          </Button>
        </Popover>
      ) : (
        <Button
          type="link"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333",
            padding: 0,
            marginLeft: 10,
          }}
          onClick={() => router.push("/")}
        >
          Log in
        </Button>
      )}
    </div>
  );
};

export default Navbar;

// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import denso from "@/app/assets/plusdental.png";
// import { useRouter } from "next/navigation";
// import { Button, Menu, Popover } from "antd";
// import { LogoutOutlined } from "@ant-design/icons";
// import { useUser } from "@/app/components/UserContext";

// const Navbar = () => {
//   const { username, setUsername } = useUser();
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = React.useState(false);

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, [setUsername]);

//   const handleLogout = () => {
//     localStorage.removeItem("username");
//     setUsername(null);
//     setMenuOpen(false);
//     router.push("/");
//   };

//   const menuItems = [
//     {
//       key: "1",
//       label: (
//         <Button
//           type="text"
//           onClick={handleLogout}
//           icon={<LogoutOutlined />}
//           style={{ width: "100%" }}
//         >
//           Logout
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div
//       style={{
//         borderBottom: "2px solid lightgray",
//         display: "flex",
//         alignItems: "center",
//         padding: "1rem",
//         position: "relative",
//         height: "60px",
//         justifyContent: "space-between",
//       }}
//     >
//       <div>
//         <Image src={denso} alt="denso" width={50} height={50} priority={true} />
//       </div>
//       {username ? (
//         <Popover
//           content={<Menu items={menuItems} />}
//           title="User Options"
//           trigger="click"
//           open={menuOpen}
//           onOpenChange={(open) => setMenuOpen(open)}
//         >
//           <Button
//             type="link"
//             style={{
//               fontSize: "18px",
//               fontWeight: "bold",
//             }}
//             onClick={() => setMenuOpen(!menuOpen)}
//           >
//             {username}
//           </Button>
//         </Popover>
//       ) : (
//         <Button
//           type="link"
//           style={{
//             fontSize: "18px",
//             fontWeight: "bold",
//             color: "#333",
//             padding: 0,
//             marginLeft: 10,
//           }}
//           onClick={() => router.push("/")}
//         >
//           Log in
//         </Button>
//       )}
//     </div>
//   );
// };

// export default Navbar;
