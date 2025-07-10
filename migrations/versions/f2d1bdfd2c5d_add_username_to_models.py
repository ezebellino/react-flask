"""Add Username to Models

Revision ID: f2d1bdfd2c5d
Revises: 5b796e555ad0
Create Date: 2025-07-10 11:37:00.691344

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f2d1bdfd2c5d'
down_revision = '5b796e555ad0'
branch_labels = None
depends_on = None


def upgrade():
    # 1) Añadir columna como nullable para no romper filas existentes
    op.add_column(
        'user',
        sa.Column('username', sa.String(length=50), nullable=True)
    )
    # 2) Poblar la columna con un valor único existente (aquí copiamos email)
    op.execute(
        "UPDATE \"user\" SET username = email"
    )
    # 3) Ahora convertir username en NOT NULL y añadir constraint único con nombre
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column(
            'username',
            existing_type=sa.String(length=50),
            nullable=False
        )
        batch_op.create_unique_constraint(
            'uq_user_username',
            ['username']
        )

    # ### end Alembic commands ###


def downgrade():
    # 1) Eliminar el constraint único
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('uq_user_username', type_='unique')
    # 2) Eliminar la columna
    op.drop_column('user', 'username')

    # ### end Alembic commands ###
