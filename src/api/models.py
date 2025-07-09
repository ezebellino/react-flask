from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__= 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
        
    tasks = relationship('Task', back_populates='user')
    
class Task(db.Model):
    __tablename__= 'task'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    label: Mapped[str] = mapped_column(String(256), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean(), default=False, nullable=False)
    user_id: Mapped[int] =  mapped_column(Integer, ForeignKey('user.id'), nullable=False)
    
    user = relationship('User', back_populates='tasks')
    
    def serialize(self):
        return {
            "id": self.id,
            "label": self.label,
            "completed": self.completed
        }