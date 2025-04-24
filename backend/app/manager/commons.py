from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from app.crud import CommonsCRUD
from app.schemas.commons import (DataAll, brcName, IsertStatus, Dataitem, CommentData, imageAll, MassStatus, IsertFinish, Qtydata, DataAll_dentallight, IsertStatus2, AuthorInfo)
import json

class CommonsManager:
    def __init__(self) -> None:
        self.crud = CommonsCRUD()

###################################################################################
    async def get_all_data(
        self,
        start_date=any,
        end_date=any,
        branch_name=any,
        db: AsyncSession = None,
    ):
        res = await self.crud.get_all_data(db=db, start_date=start_date, end_date=end_date, branch_name=branch_name)
        return_list = []
        
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                DataAll(
                    item_id=r[key_index.get("item_id")],
                    Name=r[key_index.get("Name")],
                    pt_ohn=r[key_index.get("pt_ohn")],
                    prd_name=r[key_index.get("prd_name")],
                    date_of_book=r[key_index.get("date_of_book")],
                    item_qty=r[key_index.get("item_qty")],
                    lc_no=r[key_index.get("lc_no")],
                    doctor_name=r[key_index.get("doctor_name")],
                    brc_sname=r[key_index.get("brc_sname")],
                    status_data=r[key_index.get("status_data")],
                    date_of_inserts=r[key_index.get("date_of_inserts")],
                    author_status=r[key_index.get("author_status")],
                    finish_date=r[key_index.get("finish_date")],
                    date_of_insertsss=r[key_index.get("date_of_insertsss")],
                    author_finishdate=r[key_index.get("author_finishdate")],
                    file_path=r[key_index.get("file_path")],
                    date_of_insertss=r[key_index.get("date_of_insertss")],
                    author_image=r[key_index.get("author_image")],
                    status_mass=r[key_index.get("status_mass")],
                    date_of_inmass=r[key_index.get("date_of_inmass")],
                    author_mass=r[key_index.get("author_mass")],
                    qty_data=r[key_index.get("qty_data")],
                    date_of_qty=r[key_index.get("date_of_qty")],
                    author_qty=r[key_index.get("author_qty")],
                    status_file=r[key_index.get("status_file")],
                    date_of_insertfile=r[key_index.get("date_of_insertfile")],
                    author_status_file=r[key_index.get("author_status_file")],
                    author_number=r[key_index.get("author_number")],
                    author_insert=r[key_index.get("author_insert")],
                    author_date_insert=r[key_index.get("author_date_insert")],
                    author=r[key_index.get("author")],
                )
            )
        return return_list
    
###################################################################################
    async def get_all_image_path(
        self,
        start_date=any,
        end_date=any,
        branch_name=any,
        db: AsyncSession = None,
    ):
        res = await self.crud.get_all_image_path(db=db, start_date=start_date, end_date=end_date, branch_name=branch_name)
        return_list = []
        
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                imageAll(
                    item_id=r[key_index.get("item_id")],
                    file_path=r[key_index.get("file_path")],
                )
            )
        return return_list
    
###################################################################################
    async def get_brc(
        self,
        db: AsyncSession = None,
    ):
        res = await self.crud.get_brc(db=db)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                brcName(
                    brc_id=r[key_index["brc_id"]],
                )
            )
        return return_list
    
###################################################################################
    async def get_comment_data(
        self,
        item_id=int,
        db: AsyncSession = None,
    ):
        res = await self.crud.get_comment_data(db=db, item_id=item_id)
        return_list = []
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                Dataitem(
                    item_id=r[key_index["item_id"]],
                    author=r[key_index["author"]],
                    comment=r[key_index["comment"]],
                    created_at=r[key_index["created_at"]],
                    comment_image=r[key_index["comment_image"]],
                )
            )
        return return_list
    
###################################################################################
    async def post_status_data(
        self,
        item: IsertStatus,
        db: AsyncSession = None,
    ):
        print("edit", item)
        await self.crud.post_status_data(db=db, item=item)
        return True
    
###################################################################################
    async def post_author_info(
        self,
        item: AuthorInfo,
        db: AsyncSession = None,
    ):
        print("edit", item)
        await self.crud.post_author_info(db=db, item=item)
        return True
    

###################################################################################
    async def post_status_file(
        self,
        item: IsertStatus2,
        db: AsyncSession = None,
    ):
        print("edit", item)
        await self.crud.post_status_file(db=db, item=item)
        return True

###################################################################################
    async def post_finish_date(
        self,
        item: IsertFinish,
        db: AsyncSession = None,
    ):
        print("edit", item)
        await self.crud.post_finish_date(db=db, item=item)
        return True
    
###################################################################################
    async def post_status_mass(
        self,
        item: MassStatus,
        db: AsyncSession = None,
    ):
        print("edit", item)
        await self.crud.post_status_mass(db=db, item=item)
        return True

###################################################################################
    async def post_qty_data(
        self,
        item: Qtydata,
        db: AsyncSession = None,
    ):
        print("edit", item)
        await self.crud.post_qty_data(db=db, item=item)
        return True
    
###################################################################################
    # async def put_edit_wi(
    #         self,
    #         item:IsertStatus,
    #         db:AsyncSession = None,
    # ):
    #     print("update",item)
    #     await self.crud.put_edit_wi(db=db, item=item)
    #     return True

###################################################################################
    async def get_all_data_dentallight(
        self,
        start_date=any,
        end_date=any,
        branch_name=any,
        db: AsyncSession = None,
    ):
        res = await self.crud.get_all_data_dentallight(db=db, start_date=start_date, end_date=end_date, branch_name=branch_name)
        return_list = []
        
        for r in res:
            key_index = r._key_to_index
            return_list.append(
                DataAll_dentallight(
                    item_id=r[key_index.get("item_id")],
                    Name=r[key_index.get("Name")],
                    pt_ohn=r[key_index.get("pt_ohn")],
                    prd_name=r[key_index.get("prd_name")],
                    date_of_book=r[key_index.get("date_of_book")],
                    item_qty=r[key_index.get("item_qty")],
                    lc_no=r[key_index.get("lc_no")],
                    doctor_name=r[key_index.get("doctor_name")],
                    brc_sname=r[key_index.get("brc_sname")],
                    status_data=r[key_index.get("status_data")],
                    date_of_inserts=r[key_index.get("date_of_inserts")],
                    author_status=r[key_index.get("author_status")],
                    finish_date=r[key_index.get("finish_date")],
                    date_of_insertsss=r[key_index.get("date_of_insertsss")],
                    author_finishdate=r[key_index.get("author_finishdate")],
                    file_path=r[key_index.get("file_path")],
                    date_of_insertss=r[key_index.get("date_of_insertss")],
                    author_image=r[key_index.get("author_image")],
                    status_mass=r[key_index.get("status_mass")],
                    date_of_inmass=r[key_index.get("date_of_inmass")],
                    author_mass=r[key_index.get("author_mass")],
                    qty_data=r[key_index.get("qty_data")],
                    date_of_qty=r[key_index.get("date_of_qty")],
                    author_qty=r[key_index.get("author_qty")],
                    author=r[key_index.get("author")],
                )
            )
        return return_list