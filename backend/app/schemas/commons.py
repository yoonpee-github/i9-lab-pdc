from pydantic import BaseModel # type: ignore
from typing import Optional, List, Union
from datetime import datetime

###################################################################################
class CommentData(BaseModel):
    author: Optional[str] = None
    comment: Optional[str] = None
    created_at: Optional[datetime] = None

class DataAll(BaseModel):
    item_id: Optional[int] = None
    Name: Optional[str] = None
    pt_ohn: Optional[str] = None
    prd_name: Optional[str] = None
    date_of_book: Optional[datetime] = None
    item_qty: Optional[Union[str, int]] = None
    lc_no: Optional[str] = None
    doctor_name: Optional[str] = None
    brc_sname: Optional[str] = None
    status_data: Optional[str] = None
    author_status: Optional[str] = None
    date_of_inserts: Optional[datetime] = None
    finish_date: Optional[datetime] = None
    date_of_insertsss: Optional[datetime] = None
    author_finishdate: Optional[str] = None
    file_path: Optional[str] = None
    date_of_insertss: Optional[datetime] = None
    author_image: Optional[str] = None
    status_mass: Optional[str] = None
    date_of_inmass: Optional[datetime] = None
    author_mass: Optional[str] = None
    qty_data: Optional[str] = None
    date_of_qty: Optional[datetime] = None
    author_qty: Optional[str] = None
    status_file: Optional[str] = None
    author_status_file: Optional[str] = None
    date_of_insertfile: Optional[datetime] = None
    author_number: Optional[Union[str, int]] = None
    author_insert: Optional[str] = None
    author_date_insert: Optional[datetime] = None
    author: Optional[str] = None
    date_of_rcp: Optional[datetime] = None
    link_data: Optional[str] = None
    author_file: Optional[str] = None
    
class ListDataAll(BaseModel):
    data: List[DataAll]

###################################################################################
class brcName(BaseModel):
    brc_id: Optional[int] = None   

class brcName_data(BaseModel):
    value:List[brcName]

###################################################################################
class IsertStatus(BaseModel):
    item_id: Optional[int] = None
    status_data: Optional[str] = None
    author_status: Optional[str] = None

###################################################################################
class IsertStatus2(BaseModel):
    item_id: int
    status_file: Optional[str] = None
    author_status_file: Optional[str] = None

###################################################################################
class IsertFinish(BaseModel):
    item_id: Optional[int] = None
    finish_date: Optional[datetime] = None
    author_finishdate: Optional[str] = None

###################################################################################
class Dataitem(BaseModel):
    item_id: Optional[int] = None
    author: Optional[str] = None
    comment: Optional[str] = None
    created_at: Optional[datetime] = None 
    comment_image : Optional[str] = None
    
class ListDataitem(BaseModel):
    data:List[Dataitem]

###################################################################################
class imageAll(BaseModel):
    item_id: Optional[int] = None
    file_path: Optional[str] = None

class ListimageAll(BaseModel):
    data: List[imageAll]

###################################################################################
class MassStatus(BaseModel):
    item_id: Optional[int] = None
    status_mass: Optional[str] = None
    author_mass: Optional[str] = None

###################################################################################
class Qtydata(BaseModel):
    item_id: Optional[int] = None
    qty_data: Optional[str] = None
    author_qty: Optional[str] = None
    
###################################################################################
class DataAll_dentallight(BaseModel):
    item_id: int
    Name: Optional[str] = None
    pt_ohn: Optional[str] = None
    prd_name: Optional[str] = None
    date_of_book: Optional[datetime] = None
    item_qty: Optional[Union[str, int]] = None
    lc_no: Optional[str] = None
    doctor_name: Optional[str] = None
    brc_sname: Optional[str] = None
    status_data: Optional[str] = None
    author_status: Optional[str] = None
    date_of_inserts: Optional[datetime] = None
    finish_date: Optional[datetime] = None
    date_of_insertsss: Optional[datetime] = None
    author_finishdate: Optional[str] = None
    file_path: Optional[str] = None
    date_of_insertss: Optional[datetime] = None
    author_image: Optional[str] = None
    status_mass: Optional[str] = None
    date_of_inmass: Optional[datetime] = None
    author_mass: Optional[str] = None
    qty_data: Optional[str] = None
    date_of_qty: Optional[datetime] = None
    author_qty: Optional[str] = None
    author: Optional[str] = None
    
class ListDataAll_dentallight(BaseModel):
    data: List[DataAll_dentallight]

###################################################################################

class AuthorInfo(BaseModel):
    item_id: int
    author_number: Optional[int] = None
    author_insert: Optional[str] = None

###################################################################################
class linkInfo(BaseModel):
    item_id: int
    link_data: Optional[str] = None
    author_link: Optional[str] = None

###################################################################################
class Dataitemfile(BaseModel):
    item_id: int
    author_file: Optional[str] = None
    comment_file: Optional[str] = None
    created_file: Optional[datetime] = None 
    upload_commentfile : Optional[str] = None
    
class ListDataitemfile(BaseModel):
    data:List[Dataitemfile]

###################################################################################