from sqlalchemy.ext.asyncio import AsyncSession # type: ignore
from sqlalchemy.sql import text # type: ignore
from app.schemas.commons import (IsertStatus,MassStatus,IsertFinish,Qtydata,IsertStatus2,AuthorInfo,linkInfo)
from typing import List

def convert_result(res):
    return [{c: getattr(r, c) for c in res.keys()} for r in res]


class CommonsCRUD:
    def __init__(self):
        pass
        
###################################################################################
    async def get_all_data(
        self, start_date: str, end_date:str, branch_name:List[str], db: AsyncSession,
    ):
        try:
            stmt = f"""
        SELECT
            rcp_item.item_id,
            CONCAT(
                "(",
                IFNULL(pt_info.pt_type, ""), 
                "-", 
                IFNULL(pt_info.pt_ohn, ""), " ",
                IFNULL(pt_info.pt_fname, ""), " ",
                IFNULL(pt_info.pt_lname, ""),
                "_",
                IFNULL(DATE_FORMAT(rcp_info.date_of_rcp, '%e/%m,'), ""),
                " ใช้ ",
                IFNULL(DATE_FORMAT(second_query.date_of_book, '%e/%m '), ""),
                IFNULL(DATE_FORMAT(second_query.time_of_book_start, '%H:%i'), ""),
                ")"
            ) AS Name,
            pt_info.pt_ohn,
            CASE
                WHEN sto_prd.prd_name LIKE '%พิมพ์ retainer - ลวด%' THEN 'พิมพ์ retainer - ลวด'
                WHEN sto_prd.prd_name LIKE '%พิมพ์ retainer - ใส%' THEN 'พิมพ์ retainer - ใส'
                WHEN sto_prd.prd_name LIKE '%พิมพ์ retainer แพคคู่%' THEN 'พิมพ์ retainer แพ็คคู่'
                WHEN sto_prd.prd_name LIKE '%สแกน retainer - ลวด%' THEN 'สแกน retainer - ลวด'
                WHEN sto_prd.prd_name LIKE '%สแกน retainer - ใส%' THEN 'สแกน retainer - ใส'
                WHEN sto_prd.prd_name LIKE '%สแกน retainer แพคคู่%' THEN 'สแกน retainer แพ็คคู่'
                WHEN sto_prd.prd_name LIKE '%ทำ Tray ฟอกสีฟัน%' THEN 'ทำ tray ฟอกสีฟัน'
                WHEN sto_prd.prd_name LIKE '%Night Guard%' THEN 'night guard'
                ELSE sto_prd.prd_name
            END AS prd_name,
            second_query.date_of_book,
            rcp_item.item_qty, 
            dr_info.lc_no,
            CONCAT(IFNULL(dr_info.dr_fname, ""), " ", IFNULL(dr_info.dr_lname, ""), " ท.", IFNULL(dr_info.lc_no, "")) AS doctor_name,
            bsn_branch.brc_sname,
            status_info.status_data,
            status_info.date_of_inserts,
            status_info.author_status,
            finishdate_info.finish_date,
            finishdate_info.date_of_insertsss,
            finishdate_info.author_finishdate,
            latest_file.file_path,
            latest_file.date_of_insertss,
            latest_file.author_image,
            latest_mass_status.status_mass,
            latest_mass_status.date_of_inmass,
            latest_mass_status.author_mass,
            latest_qty_data.qty_data,
            latest_qty_data.date_of_qty,
            latest_qty_data.author_qty,
            status_infile.status_file,
            status_infile.date_of_insertfile,
            status_infile.author_status_file,
            author_info.author_number,
            author_info.author_insert,
            author_info.author_date_insert,
            latest_comments.author,
            rcp_info.date_of_rcp,
            link_info.link_data,
            latest_file_lab.author_file
        FROM 
            rcp_info
        LEFT JOIN 
            pt_info ON rcp_info.pt_id = pt_info.pt_id
        LEFT JOIN 
            rcp_item ON rcp_info.rcp_id = rcp_item.rcp_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    status_mass, 
                    date_of_inmass,
                    author_mass
                FROM 
                    mass_status ms1
                WHERE 
                    ms1.date_of_inmass = (
                        SELECT MAX(ms2.date_of_inmass)
                        FROM mass_status ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_mass_status ON rcp_item.item_id = latest_mass_status.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    qty_data, 
                    date_of_qty,
                    author_qty
                FROM 
                    qty_info ms1
                WHERE 
                    ms1.date_of_qty = (
                        SELECT MAX(ms2.date_of_qty)
                        FROM qty_info ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_qty_data ON rcp_item.item_id = latest_qty_data.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    status_data, 
                    date_of_inserts,
                    author_status
                FROM 
                    status_info si1
                WHERE 
                    si1.date_of_inserts = (
                        SELECT MAX(si2.date_of_inserts)
                        FROM status_info si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) status_info ON rcp_item.item_id = status_info.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    status_file, 
                    date_of_insertfile,
                    author_status_file
                FROM 
                    status_infile si1
                WHERE 
                    si1.date_of_insertfile = (
                        SELECT MAX(si2.date_of_insertfile)
                        FROM status_infile si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) status_infile ON rcp_item.item_id = status_infile.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    author_number, 
                    author_insert,
                    author_date_insert
                FROM 
                    author_info si1
                WHERE 
                    si1.author_date_insert = (
                        SELECT MAX(si2.author_date_insert)
                        FROM author_info si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) author_info ON rcp_item.item_id = author_info.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    finish_date, 
                    date_of_insertsss,
                    author_finishdate
                FROM 
                    finishdate_info si1
                WHERE 
                    si1.date_of_insertsss = (
                        SELECT MAX(si2.date_of_insertsss)
                        FROM finishdate_info si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) finishdate_info ON rcp_item.item_id = finishdate_info.item_id
        LEFT JOIN 
            pt_book ON rcp_info.rcp_id = pt_book.rcp_id
        LEFT JOIN 
            (
                SELECT item_id, file_path, date_of_insertss, author_image
                FROM file_uploads fu1
                WHERE fu1.date_of_insertss = (
                    SELECT MAX(fu2.date_of_insertss)
                    FROM file_uploads fu2
                    WHERE fu2.item_id = fu1.item_id
                )
            ) latest_file ON rcp_item.item_id = latest_file.item_id
        LEFT JOIN 
            sto_prd ON rcp_item.prd_id = sto_prd.prd_id
        LEFT JOIN 
            dr_info ON rcp_item.dr_id = dr_info.dr_id
        LEFT JOIN 
            bsn_branch ON rcp_info.brc_id = bsn_branch.brc_id
        LEFT JOIN 
            (
                SELECT pt_id, date_of_insert, date_of_book, time_of_book_start
                FROM pt_book 
                WHERE date_of_book IS NOT NULL
            ) second_query ON rcp_info.pt_id = second_query.pt_id AND DATE(rcp_info.date_of_insert) = DATE(second_query.date_of_insert)
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    created_at,
                    author
                FROM 
                    comments ms1
                WHERE 
                    ms1.created_at = (
                        SELECT MAX(ms2.created_at)
                        FROM comments ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_comments ON rcp_item.item_id = latest_comments.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    created_file,
                    author_file
                FROM 
                    file_lab ms1
                WHERE 
                    ms1.created_file = (
                        SELECT MAX(ms2.created_file)
                        FROM file_lab ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_file_lab ON rcp_item.item_id = latest_file_lab.item_id
        LEFT JOIN 
            link_info ON rcp_item.item_id = link_info.item_id
        WHERE 
            DATE(rcp_info.date_of_rcp) BETWEEN :start_date AND :end_date
            AND pt_book.date_of_delete IS NULL
            AND rcp_item.prd_id IN (53, 54, 55, 56, 57, 71, 72, 122, 126, 231, 283, 307, 314, 338, 339, 357, 378, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 421, 422, 423, 424, 425, 426, 427, 429, 430, 431, 432)
            AND rcp_info.brc_id > '1'
            AND rcp_info.date_of_delete IS NULL
            AND (:all_branches = 1 OR bsn_branch.brc_sname IN :branch_names)
        GROUP BY 
            rcp_item.item_id, pt_info.pt_ohn, pt_info.pt_type, pt_info.pt_fname, pt_info.pt_lname, 
            rcp_info.date_of_rcp, second_query.date_of_book, second_query.time_of_book_start, 
            sto_prd.prd_name, dr_info.dr_fname, dr_info.dr_lname, dr_info.lc_no, 
            bsn_branch.brc_sname, status_info.status_data, status_info.date_of_inserts, status_info.author_status,
            finishdate_info.finish_date, finishdate_info.date_of_insertsss, finishdate_info.author_finishdate, latest_file.file_path, latest_file.date_of_insertss,
            latest_file.author_image, latest_mass_status.status_mass, latest_mass_status.date_of_inmass, latest_mass_status.author_mass;
        """
            all_branches = 1 if "All" in branch_name else 0
            rs = await db.execute(
                text(stmt),
                {
                    "start_date": start_date,
                    "end_date": end_date,
                    "branch_names": tuple(branch_name),
                    "all_branches": all_branches,
                },
            )
            return rs.fetchall()
        except Exception as e:
            raise e  

###################################################################################
    async def get_brc(self, db: AsyncSession):
        try:
            stmt = f"""
            SELECT brc_id FROM rcp_info WHERE date_of_rcp BETWEEN '2024-12-05' AND '2024-12-06'            
            """
            rs = await db.execute(text(stmt))
            return rs
        except Exception as e:
            raise e
        
###################################################################################
    async def get_comment_data(
        self, item_id: int, db: AsyncSession,
    ):
        try:
            stmt = f"""
            SELECT item_id, author, comment, created_at, comment_image
            FROM comments
            WHERE item_id = :item_id;
            """
            rs = await db.execute(text(stmt),{"item_id":item_id})
            return rs
        except Exception as e:
            raise e    

###################################################################################
    async def get_file_data(
        self, item_id: int, db: AsyncSession,
    ):
        try:
            stmt = f"""
            SELECT item_id, author_file, comment_file, created_file, upload_commentfile
            FROM file_lab
            WHERE item_id = :item_id;
            """
            rs = await db.execute(text(stmt),{"item_id":item_id})
            return rs
        except Exception as e:
            raise e  
        
###################################################################################
    async def post_status_data(self, db: AsyncSession, item:IsertStatus):
        try:
            stmt = f"""
            INSERT INTO status_info (item_id, status_data, author_status) 
            VALUES (:item_id, :status_data, :author_status);
            """
            rs = await db.execute(
                text(stmt),
                        {
                            "item_id": item.item_id,
                            "status_data": item.status_data,
                            "author_status": item.author_status,
                        }
                    )
            await db.commit()
            return rs
        except Exception as e:
            raise e
        
###################################################################################
    async def post_author_info(self, db: AsyncSession, item:AuthorInfo):
        try:
            stmt = f"""
            INSERT INTO author_info (item_id, author_number, author_insert) 
            VALUES (:item_id, :author_number, :author_insert);
            """
            rs = await db.execute(
                text(stmt),
                        {
                            "item_id": item.item_id,
                            "author_number": item.author_number,
                            "author_insert": item.author_insert,
                        }
                    )
            await db.commit()
            return rs
        except Exception as e:
            raise e
        
###################################################################################        
    async def post_link_info(self, db: AsyncSession, item:linkInfo):
        try:
            stmt = f"""
            INSERT INTO link_info (item_id, link_data, author_link) 
            VALUES (:item_id, :link_data, :author_link);
            """
            rs = await db.execute(
                text(stmt),
                        {
                            "item_id": item.item_id,
                            "link_data": item.link_data,
                            "author_link": item.author_link,
                        }
                    )
            await db.commit()
            return rs
        except Exception as e:
            raise e
        
###################################################################################
    async def post_status_file(self, db: AsyncSession, item:IsertStatus2):
        try:
            stmt = f"""
            INSERT INTO status_infile (item_id, status_file, author_status_file) 
            VALUES (:item_id, :status_file, :author_status_file);
            """
            rs = await db.execute(
                text(stmt),
                        {
                            "item_id": item.item_id,
                            "status_file": item.status_file,
                            "author_status_file": item.author_status_file,
                        }
                    )
            await db.commit()
            return rs
        except Exception as e:
            raise e

###################################################################################
    async def post_finish_date(self, db: AsyncSession, item:IsertFinish):
        try:
            stmt = f"""
            INSERT INTO finishdate_info (item_id, finish_date, author_finishdate) 
            VALUES (:item_id, :finish_date, :author_finishdate);
            """
            rs = await db.execute(
                text(stmt),
                        {
                            "item_id": item.item_id,
                            "finish_date": item.finish_date,
                            "author_finishdate": item.author_finishdate,
                        }
                    )
            await db.commit()
            return rs
        except Exception as e:
            raise e
        
###################################################################################
    async def post_status_mass(self, db: AsyncSession, item:MassStatus):
            try:
                stmt = f"""
                INSERT INTO mass_status (item_id, status_mass, author_mass) 
                VALUES (:item_id, :status_mass, :author_mass);
                """
                rs = await db.execute(
                    text(stmt),
                            {
                                "item_id": item.item_id,
                                "status_mass": item.status_mass,
                                "author_mass": item.author_mass,
                            }
                        )
                await db.commit()
                return rs
            except Exception as e:
                raise e

###################################################################################
    async def post_qty_data(self, db: AsyncSession, item:Qtydata):
            try:
                stmt = f"""
                INSERT INTO qty_info (item_id, qty_data, author_qty) 
                VALUES (:item_id, :qty_data, :author_qty);
                """
                rs = await db.execute(
                    text(stmt),
                            {
                                "item_id": item.item_id,
                                "qty_data": item.qty_data,
                                "author_qty": item.author_qty,
                            }
                        )
                await db.commit()
                return rs
            except Exception as e:
                raise e
            
###################################################################################
    # async def put_edit_wi(self,item:IsertStatus, db:AsyncSession):
    #     try:
    #         stmt = f"""
    #         UPDATE status_info
    #         SET status_data = :status_data,
    #             finish_date = :finish_date,
    #         WHERE item_id = :item_id;
    #         """
    #         rs = await db.execute(
    #                 text(stmt),
    #                         {
    #                             "status_data": item.status_data,
    #                             "finish_date": item.finish_date,
    #                             "item_id": item.item_id,
    #                         }
    #                     )
    #         await db.commit()
    #         return rs
    #     except Exception as e:
    #         raise e

###################################################################################
    async def get_all_image_path(
        self, start_date: str, end_date:str, branch_name:List[str], db: AsyncSession,
    ):
        try:
            stmt = f"""
        SELECT
            latest_file.item_id,
            latest_file.file_path
        FROM 
            rcp_info
        LEFT JOIN 
            pt_info ON rcp_info.pt_id = pt_info.pt_id
        LEFT JOIN 
            rcp_item ON rcp_info.rcp_id = rcp_item.rcp_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    status_data, 
                    date_of_inserts
                FROM 
                    status_info si1
                WHERE 
                    si1.date_of_inserts = (
                        SELECT MAX(si2.date_of_inserts)
                        FROM status_info si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) status_info ON rcp_item.item_id = status_info.item_id
        LEFT JOIN 
            pt_book ON rcp_info.rcp_id = pt_book.rcp_id
        LEFT JOIN 
            (
                SELECT item_id, file_path, date_of_insertss
                FROM file_uploads fu1
                WHERE fu1.date_of_insertss = (
                    SELECT MAX(fu2.date_of_insertss)
                    FROM file_uploads fu2
                    WHERE fu2.item_id = fu1.item_id
                )
            ) latest_file ON rcp_item.item_id = latest_file.item_id
        LEFT JOIN 
            sto_prd ON rcp_item.prd_id = sto_prd.prd_id
        LEFT JOIN 
            dr_info ON rcp_item.dr_id = dr_info.dr_id
        LEFT JOIN 
            bsn_branch ON rcp_info.brc_id = bsn_branch.brc_id
        LEFT JOIN 
            (
                SELECT pt_id, date_of_insert, date_of_book, time_of_book_start
                FROM pt_book 
                WHERE date_of_book IS NOT NULL
            ) second_query ON rcp_info.pt_id = second_query.pt_id 
            AND DATE(rcp_info.date_of_insert) = DATE(second_query.date_of_insert)
        WHERE 
            DATE(rcp_info.date_of_rcp) BETWEEN :start_date AND :end_date
            AND pt_book.date_of_delete IS NULL
            AND rcp_item.prd_id IN (53, 54, 55, 56, 57, 231, 283, 307, 314, 338, 339, 357)
            AND (:all_branches = 1 OR bsn_branch.brc_sname IN :branch_names)
        GROUP BY 
            rcp_item.item_id, pt_info.pt_ohn, pt_info.pt_type, pt_info.pt_fname, pt_info.pt_lname, 
            rcp_info.date_of_rcp, second_query.date_of_book, second_query.time_of_book_start, 
            sto_prd.prd_name, dr_info.dr_fname, dr_info.dr_lname, dr_info.lc_no, 
            bsn_branch.brc_sname, status_info.status_data, status_info.date_of_inserts, 
            latest_file.file_path, latest_file.date_of_insertss;
        """
            all_branches = 1 if "All" in branch_name else 0
            rs = await db.execute(
                text(stmt),
                {
                    "start_date": start_date,
                    "end_date": end_date,
                    "branch_names": tuple(branch_name),
                    "all_branches": all_branches,
                },
            )
            return rs.fetchall()
        except Exception as e:
            raise e 

###################################################################################

    async def get_all_data_dentallight(
        self, start_date: str, end_date:str, branch_name:List[str], db: AsyncSession,
    ):
        try:
            stmt = f"""
        SELECT
            rcp_item.item_id,
            CONCAT(
                "(",
                IFNULL(pt_info.pt_type, ""), 
                "-", 
                IFNULL(pt_info.pt_ohn, ""), " ",
                IFNULL(pt_info.pt_fname, ""), " ",
                IFNULL(pt_info.pt_lname, ""),
                "_",
                IFNULL(DATE_FORMAT(rcp_info.date_of_rcp, '%e/%m,'), ""),
                " ใช้ ",
                IFNULL(DATE_FORMAT(second_query.date_of_book, '%e/%m '), ""),
                IFNULL(DATE_FORMAT(second_query.time_of_book_start, '%H:%i'), ""),
                ")"
            ) AS Name,
            pt_info.pt_ohn,
            CASE
                WHEN sto_prd.prd_name LIKE '%งานแก้ รีเทนเนอร์ ลวด(พิมพ์)%' THEN 'งานแก้ รีเทนเนอร์ ลวด(พิมพ์)'
                WHEN sto_prd.prd_name LIKE '%งานแก้ รีเทนเนอร์ ลวด(สแกน)%' THEN 'งานแก้ รีเทนเนอร์ ลวด(สแกน)'
                WHEN sto_prd.prd_name LIKE '%งานแก้ รีเทนเนอร์ ใส(พิมพ์)%' THEN 'งานแก้ รีเทนเนอร์ ใส(พิมพ์)'
                WHEN sto_prd.prd_name LIKE '%งานแก้ รีเทนเนอร์ ใส(สแกน)%' THEN 'งานแก้ รีเทนเนอร์ ใส(สแกน)'
                WHEN sto_prd.prd_name LIKE '%พิมพ์ retainer - ลวด%' THEN 'พิมพ์ retainer - ลวด'
                WHEN sto_prd.prd_name LIKE '%พิมพ์ retainer - ใส%' THEN 'พิมพ์ retainer - ใส'
                WHEN sto_prd.prd_name LIKE '%พิมพ์ retainer แพคคู่%' THEN 'พิมพ์ retainer แพ็คคู่'
                WHEN sto_prd.prd_name LIKE '%สแกน retainer - ลวด%' THEN 'สแกน retainer - ลวด'
                WHEN sto_prd.prd_name LIKE '%สแกน retainer - ใส%' THEN 'สแกน retainer - ใส'
                WHEN sto_prd.prd_name LIKE '%สแกน retainer แพคคู่%' THEN 'สแกน retainer แพ็คคู่'
                WHEN sto_prd.prd_name LIKE '%ทำ Tray ฟอกสีฟัน%' THEN 'ทำ tray ฟอกสีฟัน'
                WHEN sto_prd.prd_name LIKE '%Night Guard%' THEN 'night guard'
                ELSE sto_prd.prd_name
            END AS prd_name,
            second_query.date_of_book,
            rcp_item.item_qty, 
            dr_info.lc_no,
            CONCAT(IFNULL(dr_info.dr_fname, ""), " ", IFNULL(dr_info.dr_lname, ""), " ท.", IFNULL(dr_info.lc_no, "")) AS doctor_name,
            bsn_branch.brc_sname,
            status_info.status_data,
            status_info.date_of_inserts,
            status_info.author_status,
            finishdate_info.finish_date,
            finishdate_info.date_of_insertsss,
            finishdate_info.author_finishdate,
            latest_file.file_path,
            latest_file.date_of_insertss,
            latest_file.author_image,
            latest_mass_status.status_mass,
            latest_mass_status.date_of_inmass,
            latest_mass_status.author_mass,
            latest_qty_data.qty_data,
            latest_qty_data.date_of_qty,
            latest_qty_data.author_qty,
            latest_comments.author
        FROM 
            rcp_info
        LEFT JOIN 
            pt_info ON rcp_info.pt_id = pt_info.pt_id
        LEFT JOIN 
            rcp_item ON rcp_info.rcp_id = rcp_item.rcp_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    status_mass, 
                    date_of_inmass,
                    author_mass
                FROM 
                    mass_status ms1
                WHERE 
                    ms1.date_of_inmass = (
                        SELECT MAX(ms2.date_of_inmass)
                        FROM mass_status ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_mass_status ON rcp_item.item_id = latest_mass_status.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    created_at,
                    author
                FROM 
                    comments ms1
                WHERE 
                    ms1.created_at = (
                        SELECT MAX(ms2.created_at)
                        FROM comments ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_comments ON rcp_item.item_id = latest_comments.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    qty_data, 
                    date_of_qty,
                    author_qty
                FROM 
                    qty_info ms1
                WHERE 
                    ms1.date_of_qty = (
                        SELECT MAX(ms2.date_of_qty)
                        FROM qty_info ms2
                        WHERE ms2.item_id = ms1.item_id
                    )
            ) latest_qty_data ON rcp_item.item_id = latest_qty_data.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    status_data, 
                    date_of_inserts,
                    author_status
                FROM 
                    status_info si1
                WHERE 
                    si1.date_of_inserts = (
                        SELECT MAX(si2.date_of_inserts)
                        FROM status_info si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) status_info ON rcp_item.item_id = status_info.item_id
        LEFT JOIN 
            (
                SELECT 
                    item_id, 
                    finish_date, 
                    date_of_insertsss,
                    author_finishdate
                FROM 
                    finishdate_info si1
                WHERE 
                    si1.date_of_insertsss = (
                        SELECT MAX(si2.date_of_insertsss)
                        FROM finishdate_info si2
                        WHERE si2.item_id = si1.item_id
                    )
            ) finishdate_info ON rcp_item.item_id = finishdate_info.item_id
        LEFT JOIN 
            pt_book ON rcp_info.rcp_id = pt_book.rcp_id
        LEFT JOIN 
            (
                SELECT item_id, file_path, date_of_insertss, author_image
                FROM file_uploads fu1
                WHERE fu1.date_of_insertss = (
                    SELECT MAX(fu2.date_of_insertss)
                    FROM file_uploads fu2
                    WHERE fu2.item_id = fu1.item_id
                )
            ) latest_file ON rcp_item.item_id = latest_file.item_id
        LEFT JOIN 
            sto_prd ON rcp_item.prd_id = sto_prd.prd_id
        LEFT JOIN 
            dr_info ON rcp_item.dr_id = dr_info.dr_id
        LEFT JOIN 
            bsn_branch ON rcp_info.brc_id = bsn_branch.brc_id
        LEFT JOIN 
            (
                SELECT pt_id, date_of_insert, date_of_book, time_of_book_start
                FROM pt_book 
                WHERE date_of_book IS NOT NULL
            ) second_query ON rcp_info.pt_id = second_query.pt_id AND DATE(rcp_info.date_of_insert) = DATE(second_query.date_of_insert)
        WHERE 
            DATE(rcp_info.date_of_rcp) BETWEEN :start_date AND :end_date
            AND pt_book.date_of_delete IS NULL
            AND rcp_item.prd_id IN (310)
            AND rcp_info.brc_id > '1'
            AND rcp_info.date_of_delete IS NULL
            AND (:all_branches = 1 OR bsn_branch.brc_sname IN :branch_names)
        GROUP BY 
            rcp_item.item_id, pt_info.pt_ohn, pt_info.pt_type, pt_info.pt_fname, pt_info.pt_lname, 
            rcp_info.date_of_rcp, second_query.date_of_book, second_query.time_of_book_start, 
            sto_prd.prd_name, dr_info.dr_fname, dr_info.dr_lname, dr_info.lc_no, 
            bsn_branch.brc_sname, status_info.status_data, status_info.date_of_inserts, status_info.author_status,
            finishdate_info.finish_date, finishdate_info.date_of_insertsss, finishdate_info.author_finishdate, latest_file.file_path, latest_file.date_of_insertss,
            latest_file.author_image, latest_mass_status.status_mass, latest_mass_status.date_of_inmass, latest_mass_status.author_mass;
        """
            all_branches = 1 if "All" in branch_name else 0
            rs = await db.execute(
                text(stmt),
                {
                    "start_date": start_date,
                    "end_date": end_date,
                    "branch_names": tuple(branch_name),
                    "all_branches": all_branches,
                },
            )
            return rs.fetchall()
        except Exception as e:
            raise e  

###################################################################################

        
