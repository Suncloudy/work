import json,datetime
import re
import pymysql
from DBUtils.PooledDB import PooledDB
import openpyxl
import ast


def transferContent(content):
    if content is None:
        return None
    else:
        string = ""
        for c in content:
            if c == '"':
                string += '\\\"'
            elif c == "'":
                string += "\\\'"
            elif c == "\\":
                string += "\\\\"
            else:
                string += c
        return string


def strB2Q(ustring):
    """把字符串全角转半角"""


def qingxi(ustring):
    if(ustring!=None):
        ss = []
        for s in ustring:
            rstring = ""
            for uchar in s:
                inside_code = ord(uchar)
                if inside_code == 12288:  # 全角空格直接转换
                    inside_code = 32
                elif (inside_code >= 65281 and inside_code <= 65374):  # 全角字符（除空格）根据关系转化
                    inside_code -= 65248
                rstring += chr(inside_code)
            ss.append(rstring)
        return ''.join(ss)
    else:
        return ustring

MYSQL_HOST = '43.247.184.94'
USER = 'nice'
PASSWORD = 'Niceee@2020#@'
DB = 'ic_middle_gsb'
PORT = 9187
DB2 = "UpdateData2019"

class DBpool(object):
    def __init__(self,MYSQL_HOST,USER,PASSWORD,DB,PORT):
        # 5为连接池里的最少连接
        self.pool = PooledDB(pymysql, 5, host=MYSQL_HOST,
                             user=USER, passwd=PASSWORD, db=DB, port=PORT)

    def insertData(self, sql, a):
        conn = self.pool.connection()
        cursor = conn.cursor()
        try:
            cursor.executemany(sql, a)
            conn.commit()
        except Exception as e:
            print(e)
        cursor.close()
        conn.close()
    
    def UpdateData(self, sql,a):
        conn = self.pool.connection()
        cursor = conn.cursor()
        try:
            cursor.executemany(sql, a)
            conn.commit()
        except Exception as e:
            print(e)
        cursor.close()
        conn.close()
    
    def returnData(self, sql):
        conn = self.pool.connection()
        cursor = conn.cursor()
        try:
            cursor.execute(sql)
            return cursor.fetchall()
        except Exception as e:
            print(e)
            return "ERROR"
        cursor.close()
        conn.close()

def returnStringDate(dat):
    if(dat !=None):
        return datetime.datetime.strftime(dat, "%Y-%m-%d")
    else:
        return dat

db = DBpool(MYSQL_HOST,USER,PASSWORD,DB,PORT)
db2 = DBpool(MYSQL_HOST,USER,PASSWORD,DB2,PORT)

sql = "SELECT id,company_name FROM gsb_tm_branch2 WHERE (company_name REGEXP '[^0-9.]')=0;"
sql2 = "Update gsb_tm_branch2 set company_name=%s where id=%s"

companys = db.returnData(sql)
print(companys)
arr=[]
for company in companys:
    cid = company[0]
    parent_id = int(company[1])
    sql3 = "select name from zcompany_all where id=%d" %(parent_id)
    print(sql3)
    ss = db2.returnData(sql3)
    print(ss)
    if(len(ss)>0):
        companyName = ss[0][0]
        arr.append((companyName,cid))
    if(arr.__len__()>200):
        db.UpdateData(sql2,arr)
        arr=[]

db.UpdateData(sql2,arr)
