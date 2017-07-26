#!/usr/bin/python
#coding:utf-8

import pandas
import csv, sqlite3
conn= sqlite3.connect("./assets/wenhaotest.db")
df = pandas.read_csv('d:\\filefolder\csvname.csv')
df.to_sql('tablename', conn, if_exists='append', index=False)
print('ok')
