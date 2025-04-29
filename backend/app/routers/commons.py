from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query # type: ignore
from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from fastapi.responses import FileResponse # type: ignore
from typing import AsyncGenerator, List
from sqlalchemy.sql import text # type: ignore
from app.schemas.commons import (DataAll, brcName, IsertStatus, Dataitem, imageAll, MassStatus, IsertFinish, Qtydata, DataAll_dentallight, IsertStatus2, AuthorInfo, linkInfo, Dataitemfile)
from app.manager import CommonsManager
from app.functions import api_key_auth
from pathlib import Path
import shutil
import os

def commons_routers(db: AsyncGenerator) -> APIRouter:
    router = APIRouter()
    manager = CommonsManager()

###################################################################################
    @router.get(
        "/get_all_data",
        response_model=List[DataAll],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_all_data(
        start_date: str,
        end_date: str,
        branch_name: List[str] = Query(..., alias="branch_name[]"),  # รองรับ branch_name[]
        db: AsyncSession = Depends(db),
    ):
        try:
            data_all = await manager.get_all_data(
                start_date=start_date,
                end_date=end_date,
                branch_name=branch_name,
                db=db,
            )
            return list(data_all)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data: {e}"
            )

###################################################################################
    @router.get(
            "/get_all_image_path",
            response_model=List[imageAll],
            dependencies=[Depends(api_key_auth)],
        )
    async def get_all_image_path(
        start_date: str,
        end_date: str,
        branch_name: List[str] = Query(..., alias="branch_name[]"),  # รองรับ branch_name[]
        db: AsyncSession = Depends(db),
    ):
        try:
            image_all = await manager.get_all_image_path(
                start_date=start_date,
                end_date=end_date,
                branch_name=branch_name,
                db=db,
            )
            return list(image_all)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data: {e}"
            )
        
###################################################################################
    @router.get(
        "/get_brc",
        response_model=List[brcName],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_brc(db: AsyncSession = Depends(db)):
        try:
            brc_data = await manager.get_brc(db=db)
            return list(brc_data)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
            )
        
###################################################################################
    @router.get(
        "/get_comment_data",
        response_model=List[Dataitem],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_comment_data(item_id=int, db: AsyncSession = Depends(db)):
        try:
            data_comment = await manager.get_comment_data(item_id=item_id, db=db)
            return list(data_comment)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
            )

###################################################################################
    @router.get(
        "/get_file_data",
        response_model=List[Dataitemfile],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_file_data(item_id=int, db: AsyncSession = Depends(db)):
        try:
            data_comment = await manager.get_file_data(item_id=item_id, db=db)
            return list(data_comment)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data : {e}"
            )
        
###################################################################################
    @router.post(
        "/post_status_data",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_status_data(item:IsertStatus, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_status_data = await manager.post_status_data(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )
        
###################################################################################
    @router.post(
        "/post_author_info",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_author_info(item:AuthorInfo, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_author_info = await manager.post_author_info(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )
        
###################################################################################
    @router.post(
        "/post_link_info",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_link_info(item:linkInfo, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_link_info = await manager.post_link_info(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )
        
###################################################################################
    @router.post(
        "/post_status_file",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_status_file(item:IsertStatus2, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_status_file = await manager.post_status_file(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )

###################################################################################
    @router.post(
        "/post_finish_date",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_finish_date(item:IsertFinish, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_finish_date = await manager.post_finish_date(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )
        
###################################################################################
    @router.post(
        "/post_status_mass",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_status_mass(item:MassStatus, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_status_mass = await manager.post_status_mass(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )

###################################################################################
    @router.post(
        "/post_qty_data",
        dependencies=[Depends(api_key_auth)],
    )
    async def post_qty_data(item:Qtydata, db: AsyncSession = Depends(db)):
        print("hello",item)
        try:
            post_qty_data = await manager.post_qty_data(item=item, db=db)
            return {"success": True}
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during update : {e}"
            )

###################################################################################        
    @router.post("/upload_file", dependencies=[Depends(api_key_auth)])
    async def upload_file(
        file: UploadFile = File(...),
        item_id: str = Form(...),
        author_image: str = Form(...),
        db: AsyncSession = Depends(db),
    ):
        try:
            upload_folder = Path("uploaded_files")
            upload_folder.mkdir(parents=True, exist_ok=True)

            unique_filename = get_unique_filename(upload_folder, file.filename)

            file_path = upload_folder / unique_filename
            with file_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            public_url = f"/uploaded_files/{unique_filename}"

            stmt = """
            INSERT INTO file_uploads (file_name, file_path, item_id, author_image)
            VALUES (:file_name, :file_path, :item_id, :author_image);
            """
            await db.execute(
                text(stmt),
                {"file_name": unique_filename, "file_path": public_url, "item_id": item_id, "author_image": author_image}
            )
            await db.commit()

            return {"success": True, "message": "File uploaded successfully!", "file_url": public_url}

        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during file upload: {e}"
            )
        
    def get_unique_filename(upload_folder: Path, filename: str) -> str:
        base_filename, extension = os.path.splitext(filename)
        counter = 1
        unique_filename = filename
        while (upload_folder / unique_filename).exists():
            unique_filename = f"{base_filename}_{counter}{extension}"
            counter += 1
        return unique_filename


    # @router.post("/upload_file", dependencies=[Depends(api_key_auth)])
    # async def upload_file(
    #     file: UploadFile = File(...),
    #     item_id: str = Form(...),
    #     db: AsyncSession = Depends(db),
    # ):
    #     try:
    #         # Set the new upload folder path
    #         upload_folder = Path(r"C:\Users\nt\Desktop\Code\asd\WS\frontend\Upload")
    #         upload_folder.mkdir(parents=True, exist_ok=True)

    #         # Get a unique filename
    #         unique_filename = get_unique_filename(upload_folder, file.filename)

    #         # Save the file to the new path
    #         file_path = upload_folder / unique_filename
    #         with file_path.open("wb") as buffer:
    #             shutil.copyfileobj(file.file, buffer)

    #         # Generate the public URL
    #         public_url = f"/frontend/Upload/{unique_filename}"

    #         # Insert into the database
    #         stmt = """
    #         INSERT INTO file_uploads (file_name, file_path, item_id)
    #         VALUES (:file_name, :file_path, :item_id);
    #         """
    #         await db.execute(
    #             text(stmt),
    #             {"file_name": unique_filename, "file_path": public_url, "item_id": item_id}
    #         )
    #         await db.commit()

    #         return {"success": True, "message": "File uploaded successfully!", "file_url": public_url}

    #     except Exception as e:
    #         raise HTTPException(
    #             status_code=400, detail=f"Error during file upload: {e}"
    #         )

    # def get_unique_filename(upload_folder: Path, filename: str) -> str:
    #     base_filename, extension = os.path.splitext(filename)
    #     counter = 1
    #     unique_filename = filename
    #     while (upload_folder / unique_filename).exists():
    #         unique_filename = f"{base_filename}_{counter}{extension}"
    #         counter += 1
    #     return unique_filename

###################################################################################
    @router.get("/get_files/{item_id}")
    async def get_files(item_id: int, db: AsyncSession = Depends(db)):
        stmt = """
        SELECT file_name, file_path
        FROM file_uploads
        WHERE item_id = :item_id
        ORDER BY date_of_insertss DESC
        LIMIT 1;
        """
        result = await db.execute(text(stmt), {"item_id": item_id})
        files = result.fetchall()

        if not files:
            raise HTTPException(status_code=404, detail="No files found for this item_id.")
        
        return {"item_id": item_id, "files": [{"name": file.file_name, "path": file.file_path} for file in files]}
    
################################################################################### 
    # @router.get("/files/{filename}")
    # async def get_file(filename: str):
    #     file_path = os.path.join(UPLOAD_FOLDER, filename)

    #     # ตรวจสอบว่าไฟล์นั้นมีจริงในโฟลเดอร์หรือไม่
    #     if os.path.exists(file_path):
    #         return FileResponse(file_path)
    #     else:
    #         return {"error": "File not found"}

###################################################################################
    # @router.post("/save_comment")
    # async def save_comment(
    #     item_id: int, 
    #     author: str, 
    #     comment: str, 
    #     db: AsyncSession = Depends(db)
    # ):
    #     try:
    #         stmt = """
    #         INSERT INTO comments (item_id, author, comment)
    #         VALUES (:item_id, :author, :comment);
    #         """
    #         await db.execute(
    #             text(stmt),
    #             {"item_id": item_id, "author": author, "comment": comment},
    #         )
    #         await db.commit()

    #         return {"success": True, "message": "Comment saved successfully!"}
    #     except Exception as e:
    #         raise HTTPException(status_code=400, detail=f"Error saving comment: {e}")

    @router.post("/save_comment")
    async def save_comment(
        item_id: int = Form(...),
        author: str = Form(...),
        comment: str = Form(...),
        image: UploadFile = File(None),
        db: AsyncSession = Depends(db)
    ):
        try:
            save_directory = r"D:\Chanatip\LabPDC\backend\comment_image"
            os.makedirs(save_directory, exist_ok=True)
            comment_image = None
            if image:
                unique_filename = get_unique_filename(save_directory, image.filename)
                image_path = os.path.join(save_directory, unique_filename)
                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
                comment_image = f"/comment_image/{unique_filename}"
            stmt = """
            INSERT INTO comments (item_id, author, comment, comment_image)
            VALUES (:item_id, :author, :comment, :comment_image);            """
            await db.execute(
                text(stmt),
                {
                    "item_id": item_id,
                    "author": author,
                    "comment": comment,
                    "comment_image": comment_image,
                },
            )
            await db.commit()
            return {"success": True, "message": "Comment saved successfully!", "imageUrl": comment_image}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error saving comment: {e}")
    def get_unique_filename(upload_folder: str, filename: str) -> str:
        """
        Generate a unique filename by appending a counter if the file already exists.
        """
        base_filename, extension = os.path.splitext(filename)
        counter = 1
        unique_filename = filename
        while os.path.exists(os.path.join(upload_folder, unique_filename)):
            unique_filename = f"{base_filename}_{counter}{extension}"
            counter += 1
        return unique_filename
    
##################################################################################
    
    @router.post("/save_file_comment")
    async def save_file_comment(
        item_id: int = Form(...),
        author_file: str = Form(...),
        comment_file: str = Form(...),
        image: UploadFile = File(None),
        db: AsyncSession = Depends(db)
    ):
        try:
            save_directory = r"D:/Chanatip/LabPDC/backend/stl_upload"
            os.makedirs(save_directory, exist_ok=True)
            
            upload_commentfile = None
            if image:
                # ✅ เช็กชื่อซ้ำก่อนบันทึก
                unique_filename = get_unique_filename(save_directory, image.filename)
                image_path = os.path.join(save_directory, unique_filename)

                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)
                
                upload_commentfile = f"/stl_upload/{unique_filename}"

            # ✅ บันทึกชื่อไฟล์จริงที่อัปโหลด (หลังเช็กซ้ำแล้ว)
            stmt = """
                INSERT INTO file_lab (item_id, author_file, comment_file, upload_commentfile)
                VALUES (:item_id, :author_file, :comment_file, :upload_commentfile);
            """
            await db.execute(
                text(stmt),
                {
                    "item_id": item_id,
                    "author_file": author_file,
                    "comment_file": comment_file,
                    "upload_commentfile": upload_commentfile,
                },
            )
            await db.commit()
            return {"success": True, "message": "Comment saved successfully!", "imageUrl": upload_commentfile}
        
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error saving comment: {e}")


    def get_unique_filename(upload_folder: str, filename: str) -> str:
        """
        Generate a unique filename by appending a counter if the file already exists.
        Example:
            - ถ้า ESP32.stl มีอยู่แล้ว → จะเป็น ESP32_1.stl, ESP32_2.stl, ...
        """
        base_filename, extension = os.path.splitext(filename)
        counter = 1
        unique_filename = filename
        while os.path.exists(os.path.join(upload_folder, unique_filename)):
            unique_filename = f"{base_filename}_{counter}{extension}"
            counter += 1
        return unique_filename


##################################################################################
    # @router.put(
    #     "/put_edit_wi",
    #     dependencies=[Depends(api_key_auth)],
    # )
    # async def put_edit_wi(item: IsertStatus, db: AsyncSession = Depends(db)):
    #     try:
    #         # ลบการอ้างถึง image_path
    #         update_data = await manager.put_edit_wi(item, db=db)
    #         return {"success": True}
    #     except Exception as e:
    #         raise HTTPException(status_code=400, detail=f"Error during update: {e}")

###################################################################################
    @router.get(
        "/get_all_image_path",
        response_model=List[imageAll],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_all_image_path(
        start_date: str,
        end_date: str,
        branch_name: List[str] = Query(..., alias="branch_name[]"),  # รองรับ branch_name[]
        db: AsyncSession = Depends(db),
    ):
        try:
            image_all = await manager.get_all_image_path(
                start_date=start_date,
                end_date=end_date,
                branch_name=branch_name,
                db=db,
            )
            return list(image_all)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data: {e}"
            )
        
###################################################################################  

    @router.get(
        "/get_all_data_dentallight",
        response_model=List[DataAll_dentallight],
        dependencies=[Depends(api_key_auth)],
    )
    async def get_all_data_dentallight(
        start_date: str,
        end_date: str,
        branch_name: List[str] = Query(..., alias="branch_name[]"),  # รองรับ branch_name[]
        db: AsyncSession = Depends(db),
    ):
        try:
            data_all = await manager.get_all_data_dentallight(
                start_date=start_date,
                end_date=end_date,
                branch_name=branch_name,
                db=db,
            )
            return list(data_all)
        except Exception as e:
            raise HTTPException(
                status_code=400, detail=f"Error during get data: {e}"
            )
        
###################################################################################
    return router
