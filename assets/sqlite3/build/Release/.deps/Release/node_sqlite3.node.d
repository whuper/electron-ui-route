cmd_Release/node_sqlite3.node := c++ -bundle -undefined dynamic_lookup -Wl,-no_pie -Wl,-search_paths_first -Wl,-dead_strip -mmacosx-version-min=10.7 -arch x86_64 -L./Release  -o Release/node_sqlite3.node Release/obj.target/node_sqlite3/src/database.o Release/obj.target/node_sqlite3/src/node_sqlite3.o Release/obj.target/node_sqlite3/src/statement.o Release/sqlite3.a 