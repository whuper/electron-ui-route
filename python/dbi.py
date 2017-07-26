#!/usr/bin/python
#coding:utf-8

class DBI(object):
    """database interface"""
    def __init__(self, conn):
        """keep connection"""
        self._conn = conn
        self._conn.text_factory = str
    def store(self, sql, data):
        """store data into database with given sql"""
        curr = self._conn.cursor()
        curr.executemany(sql, data)
        #curr.execute(sql, data)
        self._conn.commit()
        curr.close()
    def execute(self, sql, *args, **kwgs):
        """execute sql on database"""
        curr = self._conn.cursor()
        curr.execute(sql, *args, **kwgs)
        self._conn.commit()
        curr.close()
 
 
def ipager(serial, pagesize):
    """make serial page by page"""
    buff = []
    for row in serial:
        buff.append(row)
        if len(buff) >= pagesize:
            send, buff, = buff, []
            yield send
    if len(buff):
        yield buff
 
 
def tester():
    import csv
    import sqlite3
     
    dbi = DBI(sqlite3.connect("../assets/wenhaotest.db"))
    #dbi.execute("create table tb_tester (id, key, val, tm)")
    sql = "insert into dict (words,meaning,example) values (?, ?, ?)"
    with open('../assets/dict.csv', 'rb') as handle:
        for rows in ipager(csv.reader(handle), 512):
            dbi.store(sql,rows)
tester()
