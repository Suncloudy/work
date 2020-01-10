import json,re
import pymysql
from DBUtils.PooledDB import PooledDB 

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
    """全角转半角"""
    if ustring:
        rstring = ""

        for uchar in ustring:
            inside_code = ord(uchar)
            if inside_code == 12288:  # 全角空格直接转换
                inside_code = 32
            elif (inside_code >= 65281 and inside_code <= 65374):  # 全角字符（除空格）根据关系转化
                inside_code -= 65248
            rstring += chr(inside_code)
        for line in list(rstring):
            if line in ['·','(',')']:
                return  rstring

        data = re.sub('([\W,_]+)', '', rstring)
        return data


MYSQL_HOST = '39.106.39.121'
USER = 'root'
PASSWORD = 'YUZ224102lss@#'
DB = 'ali'
PORT = 3306

class DBpool(object):
    def __init__(self):
        # 5为连接池里的最少连接
        self.pool = PooledDB(pymysql, 5, host=MYSQL_HOST, user=USER, passwd=PASSWORD, db=DB, port=PORT)
    
    def insertData(self,sql,a):
        conn = self.pool.connection()
        cursor = conn.cursor()
        try:
            cursor.executemany(sql,a)
            conn.commit()
        except Exception as e:
            print(e)
        cursor.close()
        conn.close()



db = DBpool()

with open('22.json', 'r', encoding="utf-8") as f:
    # 读取所有行 每行会是一个字符串
    args=[]
    sql = "insert into cace_fin_gaoxin_quanguo(CompanyName,TechType,CertificateNo,Address,province,GotYear,BusinessScope,MainID,CompanyGUID)\
            values(%s,%s,%s,%s,%s,%s,%s,%s,%s)" 
    for jsonstr in f.readlines():
        # 将josn字符串转化为dict字典
        try:
            jsonstr = json.loads(jsonstr)

            company=jsonstr

            CompanyName=qingxi(company["CompanyName"])
            TechType=transferContent(company["TechType"])
            CertificateNo=company["CertificateNo"]
            Address=transferContent(qingxi(company["Address"]))
            Area=transferContent(qingxi(company["Area"]))
            GotYear=company["GotYear"]
            BusinessScope=transferContent(company["BusinessScope"])
            MainID=company["MainID"]
            CompanyGUID=company["CompanyGUID"]

            args.append((CompanyName,TechType,CertificateNo,Address,Area,GotYear,BusinessScope,MainID,CompanyGUID))
            if(len(args)>200):
                db.insertData(sql,args)
                args=[]
            else:
                pass
        except:
            pass

    try:
        db.insertData(sql,args)
    except:
        pass