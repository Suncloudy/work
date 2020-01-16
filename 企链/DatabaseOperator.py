#-*- encoding:utf-8 -*-
import pymysql
"""批量查询,查询条件为含有sql语句的List"""
def queryList(ip, user, password, database, port, sqllist):
    try:
        db = pymysql.Connect(ip,user,password,database,port)
        cursor =db.cursor(cursor=pymysql.cursors.DictCursor)
        result = []
        try:
            for sql in sqllist:
                cursor.execute(sql)
                result.append(cursor.fetchone())
            db.close()
            return  result
        except Exception as e1:
            db.close()
            print(e1)
            return "error"
    except  Exception as e:
        print(e)
        return  "error"

"""查询返回多条记录,查询条件为一条sql，返回多条记录"""
def query(ip, user, password, database, port, sql):
    try:
        db = pymysql.Connect(ip,user,password,database,port)
        cursor =db.cursor(cursor=pymysql.cursors.DictCursor)
        try:
            cursor.execute(sql)
            result = cursor.fetchall()
            db.close()
            return  result
        except Exception as e:
            db.close()
            return "error"
    except  Exception as e:
        return  "error"

"""单条查询"""
def queryone(ip, user, password, database, port, sql):
    try:
        db = pymysql.Connect(ip, user, password, database, port)
        cursor = db.cursor(cursor=pymysql.cursors.DictCursor)
        try:
            cursor.execute(sql)
            result = cursor.fetchone()
            db.close()
            return result
        except Exception as e:
            db.close()
            return "error"
    except  Exception as e:
        print(e)
        return "error"

    """单条操作，增加、删除、修改"""
def operator(ip, user, password, database, port, sql):
    db = pymysql.Connect(ip, user, password, database, port)
    cursor = db.cursor()
    try:
        cursor.execute(sql)
        db.commit()
        db.close()
        return True
    except Exception as e:
        db.rollback()
        db.close()
        return False
"""批量操作，增加、删除、修改"""
def operatorlist(ip, user, password, database, port, sql,list):
    db = pymysql.Connect(ip, user, password, database, port)
    cursor = db.cursor()
    try:
        cursor.executemany(sql, list)
        db.commit()
        db.close()
        return True
    except Exception as e:
        print(e)
        db.rollback()
        db.close()
        return False
