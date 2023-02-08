create database Nodens_Users
use Nodens_Users

create table Users(
	Id int primary key identity(1,1),
	Email varchar(300) not null unique,
	First_Name varchar(30) not null,
	Second_Name varchar(30),
	First_Lastname varchar(30) not null,
	Second_Lastname varchar(30),
	Rol varchar(10) not null,
	Birthdate Date
);

create table Auth_Users(
	Email varchar(300) not null,
	Password varchar(max) not null,
	Constraint fk_email foreign key (Email) references Users(Email)
);
-------------------------------------------------------------------------


go
create procedure SP_CreateUser
	@Email varchar(300),
	@First_Name varchar(30),
	@Second_Name varchar(30),
	@First_Lastname varchar(30),
	@Second_Lastname varchar(30),
	@Rol varchar(10),
	@Birthdate Date,
	@Password varchar(max)
as
begin transaction New_User
	BEGIN TRY
		INSERT INTO Users(Email, First_Name, Second_Name, First_Lastname, Second_Lastname, Rol, Birthdate)
		values (@Email, @First_Name, @Second_Name, @First_Lastname, @Second_Lastname, @Rol, @Birthdate)
		INSERT INTO Auth_Users(Email, Password) values (@Email, @Password)
		COMMIT TRANSACTION New_User
		SELECT 'Usuario Creado Correctamente' as Message, 0 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION New_User
		SELECT ERROR_MESSAGE() as Message, 1 as Error
	END CATCH

------

go
create procedure SP_AuthUser
	@Email varchar(300),
	@Password varchar(max)
as
begin
	if exists(SELECT * FROM Auth_Users where Email = @Email)
		SELECT Password, Users.Id as Id from Auth_Users, Users where Auth_Users.Email = @Email
	else
		SELECT null as Password
end

-------------------------------------------------------------------------


go
create procedure SP_ChangePassword
	@Id int,
	@Password varchar(max)
as
begin transaction TX_ChangePassword
	BEGIN TRY
		declare @Email varchar(300);
		SELECT @Email = Email from Users where Id = @Id
		UPDATE Auth_Users set Password = @Password where Email = @Email
		COMMIT TRANSACTION TX_ChangePassword
		SELECT 'Contraseña actualizada correctamente' as Respuesta, 0 as Error
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_ChangePassword
		SELECT ERROR_MESSAGE() as Respuesta, 1 as Error
	END CATCH
	
--------------

go
create procedure SP_ReadUser
	@Id int
as
begin
	SELECT * FROM Users where Id = @Id
end

------

go
create procedure SP_DeleteUser
	@Id int
as
begin
	declare @Email varchar(300)
	SELECT @Email = Email from Users where Id = @Id
	DELETE FROM Auth_Users where Email = @Email
	DELETE  FROM Users where Id = @Id
end

------

go
create procedure SP_UpdateUser
	@Id int,
	@Email varchar(300),
	@First_Name varchar(30),
	@Second_Name varchar(30),
	@First_Lastname varchar(30),
	@Second_Lastname varchar(30),
	@Rol varchar(10),
	@Birthdate Date
as
begin transaction TX_UpdateUser
	BEGIN TRY
		UPDATE Users 
			set First_Name = ISNULL(@First_Name, First_Name),
			Second_Name = ISNULL(@Second_Name, Second_Name),
			First_Lastname = ISNULL(@First_Lastname, First_Lastname),
			Second_Lastname = ISNULL(@Second_Lastname, Second_Lastname),
			Rol = ISNULL(@Rol, Rol),
			Birthdate = ISNULL(@Birthdate, Birthdate)
		where Id = @Id
		IF @Email != null AND @Email != (SELECT Email from Users where Id = @Id)
		BEGIN
			declare @OldEmail varchar(300);
			SELECT @OldEmail = Email from Users where Id = @Id;
			UPDATE Users set Email = @Email where Id = @Id;
			UPDATE Auth_Users set Email = @Email where Email = @OldEmail;
			COMMIT TRANSACTION TX_UpdateUser;
			SELECT 'Información y correo del Usuario  actualizados correctamente' as Respuesta, 0 as Error;
		END
		ELSE 
		BEGIN
			SELECT 'Información del usuario actualizada correctamente' as Respuestas, 0 as Error
		END
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION TX_UpdateUser
		SELECT ERROR_MESSAGE() as Respuesta, 1 as Error
	END CATCH