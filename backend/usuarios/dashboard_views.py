from django.db import connection
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


def table_exists(table_name):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = %s
            )
            """,
            [table_name]
        )

        return cursor.fetchone()[0]


def column_exists(table_name, column_name):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = %s
                AND column_name = %s
            )
            """,
            [table_name, column_name]
        )

        return cursor.fetchone()[0]


def get_column_type(table_name, column_name):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = %s
            AND column_name = %s
            """,
            [table_name, column_name]
        )

        result = cursor.fetchone()

        if result is None:
            return ""

        return result[0]


def get_scalar(query):
    with connection.cursor() as cursor:
        cursor.execute(query)
        result = cursor.fetchone()

        if result is None:
            return 0

        return result[0] or 0


def get_pelicula_estado_condition():
    if not column_exists("cine_pelicula", "estado"):
        return "TRUE"

    column_type = get_column_type("cine_pelicula", "estado")

    if column_type == "boolean":
        return "estado = TRUE"

    return "LOWER(CAST(estado AS TEXT)) IN ('true', 'activa', 'activo', 'disponible')"


def get_pelicula_estado_expr():
    if not column_exists("cine_pelicula", "estado"):
        return "TRUE"

    column_type = get_column_type("cine_pelicula", "estado")

    if column_type == "boolean":
        return "estado"

    return "LOWER(CAST(estado AS TEXT)) IN ('true', 'activa', 'activo', 'disponible')"


def get_peliculas_activas():
    if not table_exists("cine_pelicula"):
        return 0

    condition = get_pelicula_estado_condition()

    return get_scalar(
        f"""
        SELECT COUNT(*)
        FROM cine_pelicula
        WHERE {condition}
        """
    )


def get_usuarios_registrados():
    if not table_exists("auth_user"):
        return 0

    return get_scalar("SELECT COUNT(*) FROM auth_user")


def get_tickets_vendidos():
    if table_exists("cine_pelicula") and column_exists("cine_pelicula", "tickets_vendidos"):
        return get_scalar("SELECT COALESCE(SUM(tickets_vendidos), 0) FROM cine_pelicula")

    if table_exists("ventas_ticket"):
        return get_scalar("SELECT COUNT(*) FROM ventas_ticket")

    if table_exists("ventas_entrada"):
        return get_scalar("SELECT COUNT(*) FROM ventas_entrada")

    if table_exists("ventas_detalleventa") and column_exists("ventas_detalleventa", "cantidad"):
        return get_scalar("SELECT COALESCE(SUM(cantidad), 0) FROM ventas_detalleventa")

    if table_exists("ventas_venta"):
        return get_scalar("SELECT COUNT(*) FROM ventas_venta")

    return 0


def get_funciones_hoy():
    possible_tables = ["cine_funcion", "cine_funciones"]
    possible_columns = ["fecha", "fecha_funcion", "fecha_hora", "inicio", "hora_inicio"]

    for table_name in possible_tables:
        if not table_exists(table_name):
            continue

        for column_name in possible_columns:
            if not column_exists(table_name, column_name):
                continue

            return get_scalar(
                f"""
                SELECT COUNT(*)
                FROM {table_name}
                WHERE ({column_name})::date = CURRENT_DATE
                """
            )

    return 0


def fetch_dashboard_peliculas():
    if not table_exists("cine_pelicula"):
        return []

    titulo_expr = "titulo" if column_exists("cine_pelicula", "titulo") else "''"
    genero_expr = "genero" if column_exists("cine_pelicula", "genero") else "''"
    duracion_expr = "duracion" if column_exists("cine_pelicula", "duracion") else "0"
    clasificacion_expr = "clasificacion" if column_exists("cine_pelicula", "clasificacion") else "''"
    formato_expr = "formato" if column_exists("cine_pelicula", "formato") else "''"
    fecha_expr = "fecha_estreno" if column_exists("cine_pelicula", "fecha_estreno") else "NULL::date"
    poster_expr = "poster" if column_exists("cine_pelicula", "poster") else "NULL"
    tickets_expr = "tickets_vendidos" if column_exists("cine_pelicula", "tickets_vendidos") else "0"
    estado_expr = get_pelicula_estado_expr()

    query = f"""
        SELECT
            id,
            {titulo_expr} AS titulo,
            {genero_expr} AS genero,
            {estado_expr} AS estado,
            {tickets_expr} AS tickets_vendidos,
            {fecha_expr} AS fecha_estreno,
            {duracion_expr} AS duracion,
            {clasificacion_expr} AS clasificacion,
            {formato_expr} AS formato,
            {poster_expr} AS poster
        FROM cine_pelicula
        ORDER BY id DESC
        LIMIT 6
    """

    with connection.cursor() as cursor:
        cursor.execute(query)

        columns = [column[0] for column in cursor.description]
        rows = cursor.fetchall()

    data = []

    for row in rows:
        item = dict(zip(columns, row))

        if item.get("fecha_estreno"):
            item["fecha_estreno"] = item["fecha_estreno"].isoformat()

        data.append(item)

    return data


class DashboardView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            "estadisticas": {
                "peliculas_activas": get_peliculas_activas(),
                "tickets_vendidos": get_tickets_vendidos(),
                "usuarios_registrados": get_usuarios_registrados(),
                "funciones_hoy": get_funciones_hoy()
            },
            "peliculas": fetch_dashboard_peliculas()
        }

        return Response(data, status=status.HTTP_200_OK)