import psycopg2
from psycopg2 import sql, pool
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
import threading
import json
import os
from backend.config import POSTGRES_URI

# Thread-local storage for database connections
_local = threading.local()

class PostgreSQL:
    def __init__(self, dsn=None):
        self.dsn = dsn
        self.connection_pool = None

    def init_app(self, app=None):
        """Initialize the PostgreSQL connection pool."""
        if not self.connection_pool:
            try:
                self.connection_pool = psycopg2.pool.ThreadedConnectionPool(
                    minconn=10,
                    maxconn=60,
                    dsn=self.dsn,
                    keepalives=1,
                    keepalives_idle=5,
                    keepalives_interval=2,
                    keepalives_count=2,
                )
                print(f"Connection pool created for: {self.dsn}")
            except Exception as e:
                print(f"Failed to create Postgres connection pool: {e}")
                self.connection_pool = None

    def get_connection(self):
        if not self.connection_pool:
            raise Exception("Connection pool is not initialized")
        return self.connection_pool.getconn()

    def release_connection(self, conn, broken=False):
        if self.connection_pool and conn:
            self.connection_pool.putconn(conn, close=broken)

    def close_all_connections(self):
        if self.connection_pool:
            self.connection_pool.closeall()

# Global instance of PostgreSQL
postgres = PostgreSQL(POSTGRES_URI)

class DBHelper:
    @staticmethod
    @contextmanager
    def transaction():
        """
        Context manager for atomic database transactions.
        """
        if getattr(_local, "conn", None):
            yield
            return

        conn = None
        try:
            conn = postgres.get_connection()
            _local.conn = conn
            yield
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise e
        finally:
            _local.conn = None
            if conn:
                postgres.release_connection(conn)

    @staticmethod
    def _get_conn_cursor(cursor_factory=None):
        """Helper to get connection and cursor, handling transaction state."""
        txn_conn = getattr(_local, "conn", None)
        if txn_conn:
            return txn_conn, txn_conn.cursor(cursor_factory=cursor_factory), True
        else:
            conn = postgres.get_connection()
            return conn, conn.cursor(cursor_factory=cursor_factory), False

    @staticmethod
    def insert(table_name, return_column="id", **kwargs):
        conn = None
        cur = None
        is_transaction = False
        _broken = False
        try:
            conn, cur, is_transaction = DBHelper._get_conn_cursor()

            columns = list(kwargs.keys())
            values = []

            for val in kwargs.values():
                if isinstance(val, dict):
                    values.append(json.dumps(val))
                else:
                    values.append(val)

            columns_sql = sql.SQL(", ").join(map(sql.Identifier, columns))
            placeholders = sql.SQL(", ").join(sql.Placeholder() * len(values))

            query = sql.SQL(
                "INSERT INTO {table} ({fields}) VALUES ({values}) RETURNING {returning}"
            ).format(
                table=sql.Identifier(table_name),
                fields=columns_sql,
                values=placeholders,
                returning=sql.Identifier(return_column),
            )

            cur.execute(query, values)
            result = cur.fetchone()

            if not is_transaction:
                conn.commit()

            return result[0] if result else None

        except Exception as e:
            _broken = True
            if conn and not is_transaction:
                try:
                    conn.rollback()
                except Exception:
                    pass
            raise e
        finally:
            if cur:
                cur.close()
            if conn and not is_transaction:
                postgres.release_connection(conn, broken=_broken)

    @staticmethod
    def find_one(table_name, filters=None, select_fields=None, retry=False):
        """Retrieve a single row from a table."""
        conn = cur = None
        is_transaction = False
        _broken = False
        try:
            conn, cur, is_transaction = DBHelper._get_conn_cursor(
                cursor_factory=RealDictCursor
            )

            fields_sql = (
                sql.SQL(", ").join(map(sql.Identifier, select_fields))
                if select_fields
                else sql.SQL("*")
            )

            query_parts = [
                sql.SQL("SELECT {fields} FROM {table}").format(
                    fields=fields_sql, table=sql.Identifier(table_name)
                )
            ]
            values = []

            if filters:
                where_conditions = [
                    sql.SQL("{col} = %s").format(col=sql.Identifier(k))
                    for k in filters.keys()
                ]
                query_parts.append(
                    sql.SQL("WHERE ") + sql.SQL(" AND ").join(where_conditions)
                )
                values.extend(filters.values())

            query_parts.append(sql.SQL("LIMIT 1"))
            final_query = sql.SQL(" ").join(query_parts)

            cur.execute(final_query, values)
            return cur.fetchone()

        except psycopg2.OperationalError as e:
            _broken = True
            if not retry and not is_transaction:
                if cur:
                    cur.close()
                if conn:
                    postgres.release_connection(conn, broken=True)
                    conn = None
                return DBHelper.find_one(table_name, filters, select_fields, retry=True)
            raise e
        except Exception as e:
            print(f"Find_one error: {e}")
            raise
        finally:
            if cur:
                cur.close()
            if conn and not is_transaction:
                postgres.release_connection(conn, broken=_broken)
